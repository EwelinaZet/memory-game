<template>
  <GameStats :stats="gameStats" />
  <div class="game-board-container" ref="containerRef">
    <div class="board" :style="{ width: boardSize.width + 'px', height: boardSize.height + 'px' }">
      <GameCard
        v-for="card in cards"
        :key="card.id"
        :card="card"
        :dpr="dpr"
        :flipLocked="flipLocked"
        @card-click="handleCardClick"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import type { Card, BoardSize, CardRarity, GameStats as GameStatsType } from '../types/memory'
import GameCard from './GameCard.vue'
import GameStats from './GameStats.vue'
import { Howl } from 'howler'
import { generatePrng } from '../utils/generatePrng'

const props = defineProps<{
  boardSize: BoardSize
  seed: string
}>()

const containerRef = ref<HTMLDivElement | null>(null)
const cards = ref<Card[]>([])
const level = ref<number>(1)
const dpr = window.devicePixelRatio || 1
const flippedCards = ref<Card[]>([])
const flipLocked = ref(false)
const sound = new Howl({
  src: ['src/assets/sounds/success.wav'],
})
const soundWin = new Howl({
  src: ['src/assets/sounds/level-up.mp3'],
})

const gameStats = ref<GameStatsType>({
  level: level.value,
  attempts: 0,
  incorrectPairs: 0,
  startTime: null,
  endTime: null,
})

const STORAGE_KEY = 'memory-game-state'

const saveState = () => {
  const state = {
    seed: props.seed,
    level: level.value,
    cards: cards.value,
    gameStats: gameStats.value,
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

const loadState = () => {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    try {
      const state = JSON.parse(saved)
      if (state.seed === props.seed) {
        level.value = state.level
        cards.value = state.cards
        gameStats.value = state.gameStats
        return true
      }
    } catch {}
  }
  return false
}

const createCards = () => {
  const cards: Card[] = []
  const gridSize = 2 + level.value
  const padding = 10
  const containerWidth = props.boardSize.width
  const containerHeight = props.boardSize.height

  const cardWidth = (containerWidth - padding * (gridSize + 1)) / gridSize
  const cardHeight = (containerHeight - padding * (gridSize + 1)) / gridSize

  // Najpierw twórz tablicę rarity
  const cardRarities: CardRarity[] = []
  for (let i = 0; i < 4 + level.value * 2; i++) {
    if (i < 2) cardRarities.push('common', 'common')
    else if (i < 4) cardRarities.push('uncommon', 'uncommon')
    else if (i < 6) cardRarities.push('rare', 'rare')
    else cardRarities.push('epic', 'epic')
  }

  const shuffledRarities = shuffle(cardRarities)
  shuffledRarities.forEach((rarity, index) => {
    const row = Math.floor(index / gridSize)
    const col = index % gridSize
    cards.push({
      id: index,
      rarity,
      x: padding + col * (cardWidth + padding),
      y: padding + row * (cardHeight + padding),
      width: cardWidth,
      height: cardHeight,
      isMatched: false,
      flipBack: false,
    })
  })
  return cards
}

const shuffle = (array: CardRarity[]) => {
  const prng = generatePrng(props.seed)
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(prng() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

const handleCardClick = (clickedCard: Card) => {
  if (gameStats.value.startTime === null) {
    gameStats.value.startTime = Date.now()
  }

  flippedCards.value.push(clickedCard)

  if (flippedCards.value.length === 2) {
    gameStats.value.attempts++
    flipLocked.value = true
    setTimeout(() => {
      checkForMatch()
    }, 1000)
  }
}

const checkForMatch = () => {
  const [card1, card2] = flippedCards.value

  if (card1.rarity === card2.rarity) {
    cards.value = cards.value.filter((card) => card.id !== card1.id && card.id !== card2.id)
    if (cards.value.length === 0) levelUp()
    else sound.play()
  } else {
    gameStats.value.incorrectPairs++
    const flippedIds = new Set(flippedCards.value.map((card) => card.id))
    cards.value.forEach((card) => {
      if (flippedIds.has(card.id)) {
        card.flipBack = true
      }
    })
  }
  flippedCards.value = []
  flipLocked.value = false
}

const levelUp = async () => {
  gameStats.value.endTime = Date.now()
  level.value++
  await soundWin.play()
  resetGame()
}

const resetGame = () => {
  gameStats.value = {
    level: level.value,
    attempts: 0,
    incorrectPairs: 0,
    startTime: null,
    endTime: null,
  }
  flippedCards.value = []
  cards.value = createCards()
}

onMounted(() => {
  if (!loadState()) {
    cards.value = createCards()
    saveState()
  }
})

watch([cards, level, gameStats], saveState, { deep: true })
</script>

<style scoped>
.game-board-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.board {
  position: relative;
}
</style>
