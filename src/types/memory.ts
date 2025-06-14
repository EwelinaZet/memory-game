export type CardRarity = 'common' | 'uncommon' | 'rare' | 'epic'

export interface Card {
  id: number
  x: number
  y: number
  width: number
  height: number
  rarity: CardRarity
}

export interface BoardSize {
  width: number
  height: number
}
