<template>
  <canvas
    class="card"
    ref="canvasRef"
    :width="card.width * dpr"
    :height="card.height * dpr"
    :style="{
      width: card.width + 'px',
      height: card.height + 'px',
      position: 'absolute',
      left: card.x + 'px',
      top: card.y + 'px',
    }"
    @click="startFlip"
    @mousemove="onMouseMove"
    @mouseout="onMouseOut"
  >
  </canvas>
  <img :src="`/src/assets/${RARITY_COLORS[props.card.rarity][1]}`" />
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import type { Card } from '../types/memory'
import { RARITY_COLORS } from '../types/memory'
import { Howl } from 'howler'

const props = defineProps<{
  card: Card
  dpr: number
  flipLocked: boolean
}>()

const emit = defineEmits<{
  (e: 'cardClick', card: Card): void
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
const isBack = ref(false)

const angle = ref(0)
const duration = 600
let animFrame: number | null = null
let parallaxAnimFrame: number | null = null
const parallax = ref({ x: 0, y: 0 })
const targetParallax = ref({ x: 0, y: 0 })
const ctx = ref<CanvasRenderingContext2D | null>(null)
const bgImage = ref<HTMLImageElement | null>(null)
const sound = new Howl({
  src: ['src/assets/sounds/swish.wav'],
})

const initCanvas = () => {
  if (!canvasRef.value) return

  const canvas = canvasRef.value
  ctx.value = canvas.getContext('2d')
  if (ctx.value) {
    ctx.value.scale(props.dpr, props.dpr)
  }
  loadBackgroundImage()
}
const loadBackgroundImage = () => {
  const img = new Image()
  img.onload = () => {
    bgImage.value = img
    drawCard()
  }
  img.src = `/src/assets/img/${RARITY_COLORS[props.card.rarity][1]}`
}

const drawCard = () => {
  if (!ctx.value) return

  const { width, height, rarity } = props.card
  ctx.value.clearRect(0, 0, width, height)
  const rad = angle.value * Math.PI
  const scaleX = Math.abs(Math.cos(rad))

  ctx.value.save()
  ctx.value.translate(width / 2 + parallax.value.x, height / 2 + parallax.value.y)
  ctx.value.scale(scaleX, 1)
  ctx.value.translate(-width / 2, -height / 2)

  if (angle.value < 0.5) {
    ctx.value.fillStyle = '#eee'
    ctx.value.fillRect(0, 0, width, height)
  } else {
    if (bgImage.value) {
      const frontGradient = ctx.value.createLinearGradient(0, 0, width, height)
      frontGradient.addColorStop(0, '#808080')
      frontGradient.addColorStop(1, RARITY_COLORS[rarity][0])
      ctx.value.fillStyle = frontGradient

      ctx.value.fillRect(0, 0, width, height)

      ctx.value.save()
      ctx.value.clip()
      ctx.value.restore()
      ctx.value.drawImage(bgImage.value, 0, 0, width, height)
    }
  }
  ctx.value.restore()
}

const startFlip = (): void => {
  if (isBack.value || animFrame || props.flipLocked) return
  isBack.value = true
  emit('cardClick', props.card)
  cardFlip(0, 1)
}

const cardFlip = (fromVal: number, toVal: number): void => {
  if (animFrame) return
  sound.play()
  const start = performance.now()
  const from = fromVal
  const to = toVal

  function animate(now: number) {
    const elapsed = now - start
    const progress = Math.min(elapsed / duration, 1)
    angle.value = from + (to - from) * progress

    drawCard()
    if (progress < 1) {
      animFrame = requestAnimationFrame(animate)
    } else {
      animFrame = null
    }
  }
  requestAnimationFrame(animate)
}

function onMouseMove(e) {
  const rect = canvasRef.value.getBoundingClientRect()
  const x = (e.clientX - rect.left - props.card.width / 2) / 10
  const y = (e.clientY - rect.top - props.card.height / 2) / 10
  targetParallax.value.x = x
  targetParallax.value.y = y
  if (!parallaxAnimFrame) animateParallax()
}

function onMouseOut() {
  targetParallax.value.x = 0
  targetParallax.value.y = 0
  if (!parallaxAnimFrame) animateParallax()
}

function animateParallax() {
  parallax.value.x += (targetParallax.value.x - parallax.value.x) * 0.1
  parallax.value.y += (targetParallax.value.y - parallax.value.y) * 0.1
  drawCard()
  if (
    Math.abs(parallax.value.x - targetParallax.value.x) > 0.5 ||
    Math.abs(parallax.value.y - targetParallax.value.y) > 0.5
  ) {
    parallaxAnimFrame = requestAnimationFrame(animateParallax)
  } else {
    parallax.value.x = targetParallax.value.x
    parallax.value.y = targetParallax.value.y
    drawCard()
    parallaxAnimFrame = null
  }
}

watch(
  () => props.card.flipBack,
  () => {
    if (props.card.flipBack) cardFlip(1, 0)
    isBack.value = false
    props.card.flipBack = false
  },
)

onMounted(() => {
  initCanvas()
})
</script>

<style scoped>
canvas {
  cursor: pointer;
}
.card {
  padding: 10px;
}
img {
  display: none;
}
</style>
