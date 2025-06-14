<template>
  <div class="game-container">
    <GameBoard :board-size="{ width: 1000, height: 600 }" />
  </div>
</template>

<script setup lang="ts">
import GameBoard from './components/GameBoard.vue'
</script>

<style scoped>
.game-container {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
