<template>
  <div class="game-board-container" ref="containerRef">
    <div class="board" :style="{ width: boardSize.width + 'px', height: boardSize.height + 'px' }">
      <GameCard
        v-for="card in cards"
        :key="card.id"
        :card="card"
        :dpr="dpr"
        @card-click="handleCardClick"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Card, BoardSize, CardRarity } from '../types/memory'
import GameCard from './GameCard.vue'

const props = defineProps<{
  boardSize: BoardSize
}>()

const containerRef = ref<HTMLDivElement | null>(null)
const cards = ref<Card[]>([])
const level = ref<number>(1)
const dpr = window.devicePixelRatio || 1
const flippedCards = ref<Card[]>([])

const createcards = () => {
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
    })
  })

  return cards
}

const handleCardClick = (clickedCard: Card) => {
  flippedCards.value.push(clickedCard)
}

onMounted(() => {
  createcards()
  cards.value = createcards()
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
