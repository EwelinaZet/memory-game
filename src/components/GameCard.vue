<template>
  <canvas
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
  ></canvas>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Card } from '../types/memory'
import { RARITY_COLORS } from '../types/memory'

const props = defineProps<{
  card: Card
  dpr: number
}>()

const emit = defineEmits<{
  (e: 'cardClick', card: Card): void
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
const isBack = ref(false)

const angle = ref(0)
const duration = 600
let animFrame: number | null = null

const ctx = ref<CanvasRenderingContext2D | null>(null)

const initCanvas = () => {
  if (!canvasRef.value) return

  const canvas = canvasRef.value
  ctx.value = canvas.getContext('2d')
  if (ctx.value) {
    ctx.value.scale(props.dpr, props.dpr)
  }
}

const drawCard = () => {
  if (!ctx.value) return

  const { width, height, rarity } = props.card

  ctx.value.clearRect(0, 0, width, height)

  const rad = angle.value * Math.PI
  const scaleX = Math.abs(Math.cos(rad))

  ctx.value.save()
  ctx.value.translate(width / 2, height / 2)
  ctx.value.scale(scaleX, 1)
  ctx.value.translate(-width / 2, -height / 2)

  if (angle.value < 0.5) {
    ctx.value.fillStyle = '#eee'
    ctx.value.fillRect(0, 0, width, height)
  } else {
    ctx.value.fillStyle = RARITY_COLORS[rarity]
    ctx.value.fillRect(0, 0, width, height)
  }
  ctx.value.restore()
}

function startFlip() {
  emit('cardClick', props.card)
  if (animFrame) return
  const start = performance.now()
  const from = isBack.value ? 1 : 0
  const to = isBack.value ? 0 : 1

  function animate(now: number) {
    const elapsed = now - start
    const progress = Math.min(elapsed / duration, 1)
    angle.value = from + (to - from) * progress

    drawCard()
    if (progress < 1) {
      animFrame = requestAnimationFrame(animate)
    } else {
      isBack.value = !isBack.value
      animFrame = null
    }
  }
  requestAnimationFrame(animate)
}

onMounted(() => {
  initCanvas()
  drawCard()
})
</script>

<style scoped>
canvas {
  cursor: pointer;
}
</style>
