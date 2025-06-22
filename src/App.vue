<template>
  <div class="game-container">
    <div v-if="!start" class="game-container__seed">
      <input v-model="seed" placeholder="Podaj seed" class="seed-input" />
      <button @click="startGame" class="seed-button">Start</button>
    </div>
    <GameBoard v-else :board-size="{ width: 1000, height: 600 }" :seed="seed" />
  </div>
</template>

<script setup lang="ts">
import GameBoard from './components/GameBoard.vue'
import { ref } from 'vue'

const seed = ref('')
const start = ref(false)

const startGame = () => {
  if (!seed.value) seed.value = generateRandomSeed()
  start.value = true
}

const generateRandomSeed = (): string => {
  const timestamp = Date.now().toString()
  const randomStr = Math.random().toString(36).substring(2, 10)
  return timestamp + randomStr
}
</script>

<style lang="scss" scoped>
.game-container {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

  &__seed {
    display: flex;
    flex-direction: column;
    gap: 15px;

    .seed-input {
      font-family: 'Roboto', sans-serif;
      color: #333;
      font-size: 1rem;
      padding: 1rem 1.5rem;
      border-radius: 6px;
      background-color: rgb(255, 255, 255);
      border: none;
      width: 100%;
      display: block;
      transition: all 0.3s;
    }

    .seed-button {
      appearance: none;
      background-color: #fafbfc;
      border: 1px solid rgba(27, 31, 35, 0.15);
      border-radius: 6px;
      color: #24292e;
      cursor: pointer;
      display: inline-block;
      font-size: 1rem;
      font-weight: 500;
      line-height: 20px;
      list-style: none;
      padding: 6px 16px;
    }

    .seed-button:hover {
      background-color: #717479;
      text-decoration: none;
      transition-duration: 0.1s;
    }
  }
}
</style>
