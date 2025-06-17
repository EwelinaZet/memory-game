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

export const RARITY_COLORS: Record<CardRarity, string> = {
  common: '#808080',
  uncommon: '#00FF00',
  rare: '#0000FF',
  epic: '#800080',
}
