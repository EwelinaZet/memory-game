<template>
  <div class="game-stats">
    <div class="stat-item">
      <span class="label">Level:</span>
      <span class="value">{{ stats.level }}</span>
    </div>
    <div class="stat-item">
      <span class="label">Attempts:</span>
      <span class="value">{{ stats.attempts }}</span>
    </div>
    <div class="stat-item">
      <span class="label">Incorrect Pairs:</span>
      <span class="value">{{ stats.incorrectPairs }}</span>
    </div>
    <div class="stat-item">
      <span class="label">Time:</span>
      <span class="value">{{ formattedTime }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { GameStats } from '../types/memory'

const props = defineProps<{
  stats: GameStats
}>()

const currentTime = ref(Date.now())

const formattedTime = computed(() => {
  if (!props.stats.startTime) return '00:00'

  const endTime = props.stats.endTime || currentTime.value
  const timeMs = endTime - props.stats.startTime
  if (timeMs < 0) return '00:00'
  const seconds = Math.floor(timeMs / 1000)
  const minutes = Math.floor(seconds / 60)
  return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`
})

let timerInterval: number
onMounted(() => {
  timerInterval = setInterval(() => {
    currentTime.value = Date.now()
  }, 1000)
})

onUnmounted(() => {
  if (timerInterval) {
    clearInterval(timerInterval)
  }
})
</script>

<style scoped>
.game-stats {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.8);
  padding: 15px;
  border-radius: 8px;
  color: white;
  font-family: Arial, sans-serif;
}

.stat-item {
  margin: 5px 0;
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.label {
  font-weight: bold;
  color: #ccc;
}

.value {
  color: #fff;
  min-width: 60px;
  text-align: right;
}
</style>
