import { Suit, Rank, Card } from '../types'

const suits: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades']
const ranks: Rank[] = ['9', '10', 'jack', 'queen', 'king', 'ace']

export function createDeck() {
  return suits.reduce((acc, suit) => acc.concat(ranks.map(rank => ({ suit, rank } as Card))), [] as Card[])
}

export function shuffleDeck(deck: Card[]) {
  return deck.map((_, index) => deck[Math.floor(Math.random() * (index + 1))])
}

export function dealCards(deck: Card[], players: number) {
  // TODO: Implement euchre-specific dealing logic
}

export function determineTrickWinner(
  playedCards: Card[],
  trump: string
) {
  // TODO: Implement logic to determine the winner of a trick based on euchre rules
}

export function evaluateRank(card: Card, trump: Suit) {
  // TODO: Implement logic to evaluate the rank of a card based on euchre rules, considering trump
}

export function isValidPlay(
  card: Card,
  currentTrick: Card[],
  hand: Card[],
  trump: Suit
) {
  // TODO: Implement logic to determine if a card is valid to play based on euchre rules
}

// TODO: Add more utility functions for gameplay, scoring, trump calling, etc., as needed
