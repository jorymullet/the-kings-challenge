export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades'
export type Rank = '9' | '10' | 'jack' | 'queen' | 'king' | 'ace'

export type Card = {
  suit: Suit
  rank: Rank
}

export type Team = {
  player1: Player
  player2: Player
}

export type Player = {
  name: string
  hand: Card[]
  tricksWon: number
  score: number
  isDealer: boolean
  team: Team
}

export type Game = {
  team1: Team
  team2: Team
  currentTrick: Card[] // Cards played in the current trick
  trump: Suit | null // Current trump suit or null if not yet determined
  dealer: Player // Reference to the current dealer
  turn: Player // Reference to the player whose turn it is to play
  score: { team1: number; team2: number } // Score for each team
  previousTricks: Card[][] // Array of previous tricks, each represented as an array of cards
}