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
  ></canvas>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Card } from '../types/memory'

const props = defineProps<{
  card: Card
  dpr: number
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
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

  const { width, height } = props.card

  ctx.value.beginPath()
  ctx.value.roundRect(0, 0, width, height, 8)

  ctx.value.fill()
  ctx.value.strokeStyle = '#ffffff'
  ctx.value.lineWidth = 2
  ctx.value.stroke()
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
