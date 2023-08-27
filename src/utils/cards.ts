import { BAUER_RANK } from '../constants/cards'
import { Suit, Rank, Card, Player } from '../types'

const suits: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades']
const ranks: Rank[] = ['9', '10', 'jack', 'queen', 'king', 'ace']

export function createDeck() {
  return suits.reduce((acc, suit) => acc.concat(ranks.map(rank => ({ suit, rank } as Card))), [] as Card[])
}

export function shuffleCards(cards: Card[]) {
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * i)
    const temp = cards[i]
    cards[i] = cards[j]
    cards[j] = temp
  }
  return cards
}

export function dealCards(deck: Card[], players: Player[]) {
  if (players.length === 4) {
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < players.length; j++) {
        players[j].hand.push(deck.pop() as Card)
      }
    }
  } else {
    throw new Error(`Don't know how to deal for ${players.length}  players`)
  }
}

export function pickRandomCardFromHand(
  hand: Card[],
  suitToAvoid?: Suit,
) {
  return shuffleCards(hand)
    .filter(card => !suitToAvoid || card.suit !== suitToAvoid)[0]
}

export function pickRandomSuitFromHand(hand: Card[], suitToAvoid?: Suit) {
  return pickRandomCardFromHand(hand, suitToAvoid)?.suit
}

export function isLeftBauer(card: Card, trump: Suit) {
  const leftBauerSuit = getLeftBauerSuit(trump)

  return (card.suit === leftBauerSuit) && (card.rank === BAUER_RANK)
}

export function isCardTrump(card: Card, trump: Suit) {
  return (card.suit === trump) || isLeftBauer(card, trump)
}

export function pickRandomPlayableCard(
  hand: Card[],
  leadCard: Card,
  trump: Suit,
): Card {
  const { suit: leadSuit, rank: leadRank } = leadCard

  const leadIsTrump = isCardTrump(leadCard, trump)

  const leadFollowingCards = hand.filter(card => {
    return leadIsTrump ?
      isCardTrump(card, trump) :
      ((card.suit === leadSuit) && !isLeftBauer(card, trump))
  })

  if (leadFollowingCards.length) return shuffleCards(leadFollowingCards)[0]

  return pickRandomCardFromHand(hand)
}

export function getLeftBauerSuit(trump: Suit) {
  switch (trump) {
    case 'hearts': return 'diamonds'
    case 'diamonds': return 'hearts'
    case 'clubs': return 'spades'
    case 'spades': return 'clubs'
  }
}