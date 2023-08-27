
import { Rank } from '../types'

// Rank mapping for normal suits
export const RANK_ORDER: Record<Rank, number> = {
  '9': 1,
  '10': 2,
  'jack': 3,
  'queen': 4,
  'king': 5,
  'ace': 6,
}

// Special rank for the Jack of the trump suit
export const TRUMP_RANK_ORDER: Record<Rank, number> = { ...RANK_ORDER, 'jack': 7 }

export const BAUER_RANK: Rank = 'jack'