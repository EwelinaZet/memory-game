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
import { ref, onMounted } from 'vue'
import type { Card, BoardSize, CardRarity, GameStats as GameStatsType } from '../types/memory'
import GameCard from './GameCard.vue'
import GameStats from './GameStats.vue'
import { Howl } from 'howler'

const props = defineProps<{
  boardSize: BoardSize
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

const createCards = () => {
  const cards: Card[] = []
  const gridSize = 2 + level.value
  const padding = 10
  const containerWidth = props.boardSize.width
  const containerHeight = props.boardSize.height

  const cardWidth = (containerWidth - padding * (gridSize + 1)) / gridSize
  const cardHeight = (containerHeight - padding * (gridSize + 1)) / gridSize

  const cardPairs = Array.from({ length: 4 + level.value * 2 }, (_, index) => {
    const rarity: CardRarity =
      index < 2 ? 'common' : index < 4 ? 'uncommon' : index < 6 ? 'rare' : 'epic'
    return [
      { id: index * 2, rarity },
      { id: index * 2 + 1, rarity },
    ]
  }).flat()

  const shuffledcards = cardPairs.sort(() => Math.random() - 0.5)
  shuffledcards.forEach((card, index) => {
    const row = Math.floor(index / gridSize)
    const col = index % gridSize

    cards.push({
      ...card,
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

const handleCardClick = (clickedCard: Card) => {
  if (gameStats.value.startTime === null) {
    gameStats.value.startTime = Date.now()
  }

  flippedCards.value.push(clickedCard)

  if (flippedCards.value.length === 2) {
    gameStats.value.attempts++
    flipLocked.value = true
    setTimeout(() => {
      checkForMatch(clickedCard)
    }, 1000)
  }
}

const checkForMatch = (clickedCard: Card) => {
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

const levelUp = () => {
  soundWin.play()
  setTimeout(() => {
    level.value++
    cards.value = createCards()
  }, 1200)

  gameStats.value.endTime = Date.now()
}

const resetGame = () => {
  gameStats.value = {
    attempts: 0,
    incorrectPairs: 0,
    startTime: null,
    endTime: null,
  }
  cards.value = createCards()
  flippedCards.value = []
}

onMounted(() => {
  createCards()
  cards.value = createCards()
})
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
