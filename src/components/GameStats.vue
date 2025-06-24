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
  min-width: 180px;
  backdrop-filter: blur(5px);
  z-index: 100;
  transition: all 0.3s;
}

.stat-item {
  margin: 5px 0;
  display: flex;
  justify-content: space-between;
  gap: 10px;
  font-size: 0.9rem;
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

@media (max-width: 900px) {
  .game-stats {
    position: static;
    top: unset;
    right: unset;
    margin: 16px auto 0 auto;
    width: 100%;
    max-width: 400px;
    border-radius: 8px;
    z-index: 1;
    display: block;
  }
}

@media (max-width: 768px) {
  .game-stats {
    padding: 10px;
    min-width: 140px;
    font-size: 0.8rem;
  }

  .stat-item {
    margin: 3px 0;
    font-size: 0.8rem;
  }

  .value {
    min-width: 45px;
  }
}

@media (max-width: 480px) {
  .game-stats {
    padding: 8px;
    font-size: 0.75rem;
    max-width: 98vw;
  }

  .stat-item {
    margin: 2px 5px;
    font-size: 0.75rem;
    min-width: 80px;
  }
}
</style>
