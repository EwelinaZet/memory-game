export type CardRarity = 'common' | 'uncommon' | 'rare' | 'epic'

export interface Card {
  id: number
  x: number
  y: number
  width: number
  height: number
  rarity: CardRarity
  isMatched: boolean
  flipBack: boolean
}

export interface BoardSize {
  width: number
  height: number
}

export const RARITY_COLORS: Record<CardRarity, [string, string]> = {
  common: ['#fff', 'cs-gun-1.png'],
  uncommon: ['#66ffec', 'cs-gun-2.png'],
  rare: ['#66e7ff', 'cs-gun-3.png'],
  epic: ['#800080', 'cs-gun-4.png'],
}

export interface GameStats {
  level: number
  attempts: number
  incorrectPairs: number
  startTime: number | null
  endTime: number | null
}
