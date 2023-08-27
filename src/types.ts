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
  team: Team
}

export type PlayedCard = {
  card: Card
  player: Player
}

export type Trick = {
  playedCards: PlayedCard[] // Cards played in the trick
  leadingPlayer: Player | null
  winningCard: PlayedCard | null // Card that won the round
}


export type Round = {
  trump: Suit | null // Current trump suit or null if not yet determined
  trumpCaller: Player | null // Player who decided trump for the round
  turn: Player// Reference to the player whose turn it is to play
  tricks: Trick[] // Array of previous tricks, each represented as an array of cards
  deck: Card[] // Current deck of cards
  dealer: Player
  shootingTheMoon: Boolean
}

export type Game = {
  previousRounds: Round[]
  team1: Team
  team2: Team
  score: { team1: number; team2: number } // Score for each team
  players: Player[]
}