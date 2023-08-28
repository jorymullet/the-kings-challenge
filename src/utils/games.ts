import { Game, Player, Round, Suit, Trick, Card, PlayedCard } from '../types'
import { BAUER_RANK, RANK_ORDER, TRUMP_RANK_ORDER } from '../constants/cards'
import * as odds from './odds'

import {
  createDeck,
  shuffleCards,
  dealCards,
  pickRandomSuitFromHand,
  pickRandomCardFromHand,
  pickRandomPlayableCard,
  isLeftBauer,
} from './cards'
import { getPartner } from './players'



export function getOpponents(game: Game, player: Player) {
  const { team1, team2 } = game
  const { player1, player2 } = player.team
  if (player1 === player) {
    return [team2.player1, team2.player2]
  } else if (player2 === player) {
    return [team1.player1, team1.player2]
  } else {
    throw new Error('Player is not in game')
  }
}

export type Initialization = {
  players: string[] // Names of the players
}

export function initializeGame(init: Initialization): Game {
  const [player1, player2, player3, player4] = init.players

  const team1 = {
    player1: { name: player1, hand: [], team: null as any },
    player2: { name: player3, hand: [], team: null as any }
  }
  const team2 = {
    player1: { name: player2, hand: [], team: null as any },
    player2: { name: player4, hand: [], team: null as any }
  }

  team1.player1.team = team1
  team1.player2.team = team1
  team2.player1.team = team2
  team2.player2.team = team2

  const players = [team1.player1, team2.player1, team1.player2, team2.player2]

  return {
    team1: team1,
    team2: team2,
    score: { team1: 0, team2: 0 },
    previousRounds: [],
    players,
  }
}

function decideDealer(game: Game) {
  const numRounds = game.previousRounds.length
  const { players } = game

  if (numRounds === 0) return players[Math.floor(Math.random() * players.length)]

  return players[(players.indexOf(game.previousRounds[numRounds - 1].dealer) + 1) % players.length]
}

function getLeftOfMe(current: Player, round: Round, game: Game): Player {
  const { players } = game

  const nextUp = players[(players.indexOf(current) + 1) % players.length]

  if (round.shootingTheMoon && round.trumpCaller === getPartner(nextUp)) {
    return getLeftOfMe(nextUp, round, game)
  }

  return nextUp
}

export function decideTrumpAndTrumpCaller(
  round: Round,
  game: Game,
): void {
  let { dealer, deck } = round

  const faceUpCard = deck[0].suit

  let currentBidder = getLeftOfMe(dealer, round, game)

  do { // go around and see if we want to pick up the face up card
    console.log('Current Bidder on face up card: ', currentBidder.name)
    const allCardsAreFaceUpSuit = currentBidder.hand.every(card => card.suit === faceUpCard)
    const isFaceUpCardInPlayerHand = currentBidder.hand.find(card => card.suit === faceUpCard)

    if (allCardsAreFaceUpSuit || (isFaceUpCardInPlayerHand && odds.ofDealing())) {
      round.trumpCaller = currentBidder
      round.trump = faceUpCard
      round.shootingTheMoon = odds.ofShootingTheMoon()
    }

    currentBidder = getLeftOfMe(currentBidder, round, game)
  } while (!round.trump && currentBidder !== dealer)

  if (round.trump) return

  do { // go around and see if we want to pick up a random suit
    console.log('Current Bidder on other card: ', currentBidder.name)
    if (
      (currentBidder === dealer) || // dealer must pick up a random suit (aka "stick the dealer")
      odds.ofDealing()
    ) {
      round.trumpCaller = currentBidder
      round.trump = pickRandomSuitFromHand(currentBidder.hand, faceUpCard) as Suit
      round.shootingTheMoon = odds.ofShootingTheMoon()
    }

    currentBidder = getLeftOfMe(currentBidder, round, game)
  } while (!round.trump)
}


export function initializeRound(game: Game): Round {
  const deck = shuffleCards(createDeck())

  const dealer = decideDealer(game)
  const round = {
    deck,
    trump: null,
    turn: null as any,
    dealer,
    trumpCaller: null,
    tricks: [],
    shootingTheMoon: false,
  }

  round.turn = getLeftOfMe(dealer, round, game)

  dealCards(deck, game.players)

  return round
}

function removeCardFromHand(round: Round, card: Card) {
  round.turn.hand = round.turn.hand.filter(cardInHand => cardInHand !== card)
}

function playTrick(round: Round, game: Game): Trick {

  const trick: Trick = {
    playedCards: [],
    leadingPlayer: round.turn,
    winningCard: null,
  }

  const leadingCard = pickRandomCardFromHand(round.turn.hand)
  removeCardFromHand(round, leadingCard)

  trick.playedCards.push({
    card: leadingCard,
    player: round.turn as Player,
  })

  round.turn = getLeftOfMe(round.turn as Player, round, game)

  while (round.turn !== trick.leadingPlayer) {
    console.log('Current Player: ', round.turn.name)
    // here is where the infinite loop is happening
    // TODO: when someone goes alone, it's possible the 'play trick' function goes infinitely.
    const card = pickRandomPlayableCard(round.turn.hand, leadingCard, round.trump as Suit)
    removeCardFromHand(round, card)

    trick.playedCards.push({
      card,
      player: round.turn,
    })

    round.turn = getLeftOfMe(round.turn, round, game)
  }

  return trick
}

function isCardTrump(card: Card, trump: Suit): Boolean {
  return card.suit === trump || isLeftBauer(card, trump)
}

function chooseHigherRankBetweenSameSuitCards(card1: Card, card2: Card, trump: Suit): Card {
  // Apply special trump rank if the card is of the trump suit
  if (card1.suit === trump) { // should work when right v left
    return TRUMP_RANK_ORDER[card1.rank] >= TRUMP_RANK_ORDER[card2.rank] ? card1 : card2
  }

  // Apply special rank for the left v right situation
  if (isLeftBauer(card1, trump)) {
    return card2.rank === BAUER_RANK ? card2 : card1
  }

  if (isLeftBauer(card2, trump)) return card2

  // Apply normal rank
  return RANK_ORDER[card1.rank] >= RANK_ORDER[card2.rank] ? card1 : card2;
}

function haveSameSuit(winningCard: Card, incomingCard: Card, trump: Suit) {
  return (winningCard.suit === incomingCard.suit) ||
    (winningCard.suit === trump && isLeftBauer(incomingCard, trump)) ||
    (isLeftBauer(winningCard, trump) && incomingCard.suit === trump)
}

export function decideWinner(trick: Trick, round: Round) {
  const { playedCards } = trick
  const { trump } = round

  if (!trump) {
    throw new Error('Cannot decide winner of trick without trump')
  }

  const winningPlayedCard = playedCards.reduce((winningPlayedCard, incomingPlayedCard) => {
    const { card: currentWinner } = winningPlayedCard
    const { card: incomingCompetitor } = incomingPlayedCard

    const winnerIsTrump = isCardTrump(currentWinner, trump)

    if (winnerIsTrump && !isCardTrump(incomingCompetitor, trump)) return winningPlayedCard
    if (!winnerIsTrump && isCardTrump(incomingCompetitor, trump)) return incomingPlayedCard

    if (haveSameSuit(currentWinner, incomingCompetitor, trump)) {
      const higherRankedCard = chooseHigherRankBetweenSameSuitCards(currentWinner, incomingCompetitor, trump)
      return winningPlayedCard.card === higherRankedCard ? winningPlayedCard : incomingPlayedCard
    }

    return winningPlayedCard
  }, playedCards[0])

  trick.winningCard = winningPlayedCard
  round.turn = winningPlayedCard.player
}

function awardPoints(round: Round, game: Game) {
  const { tricks, trumpCaller, shootingTheMoon } = round

  const [team1HandCount, team2HandCount] = tricks.reduce((handCounts, trick) => {
    const { winningCard } = trick
    const { player } = winningCard as PlayedCard

    handCounts[player.team === game.team1 ? 0 : 1] += 1

    return handCounts
  }, [0, 0])

  console.log('Hand Counts: ', team1HandCount, team2HandCount)
  console.log('Team 1: ', game.team1.player1.name, game.team1.player2.name)
  console.log('Team 2: ', game.team2.player1.name, game.team2.player2.name)
  console.log('Trump Caller: ', trumpCaller?.name)

  const winningTeam = team1HandCount > team2HandCount ? game.team1 : game.team2
  const winningTeamCalledTrump = winningTeam === trumpCaller?.team

  let pointsToAssign = 1

  if (!winningTeamCalledTrump) {
    pointsToAssign = 2
  } else if (shootingTheMoon && Math.abs(team1HandCount - team2HandCount) === 5) {
    pointsToAssign = 4
  }

  game.score[winningTeam === game.team1 ? 'team1' : 'team2'] += pointsToAssign
  console.log(game.score)
}

export function playRound(round: Round, game: Game) {
  const numberOfTricks = round.dealer.hand.length

  Array(numberOfTricks).fill(null).forEach(() => {
    const trick = playTrick(round, game)
    decideWinner(trick, round)
    round.tricks.push(trick)
  })

  awardPoints(round, game)
}