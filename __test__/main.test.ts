import { pickRandomPlayableCard } from './../src/utils/cards'
import { decideWinner } from './../src/utils/games'
import { Trick, Round, Card, Player, PlayedCard } from './../src/types'

// Utility to create a player
function createPlayer(name: string, hand: Card[]): Player {
  return { name, hand, team: { player1: {} as any, player2: {} as any } };
};

describe('testTest', () => {
  it('should pass this test', () => {
    expect(true).toEqual(true)
  })
})

describe('pickRandomPlayableCard', () => {
  it('should handle left being led', () => {
    const hand: Card[] = [
      { suit: 'hearts', rank: '9' },
      { suit: 'diamonds', rank: 'jack' }, // This is the left bauer when trump is hearts
    ];
    const leadCard: Card = { suit: 'hearts', rank: 'jack' }; // Right bauer
    const trump = 'hearts';

    const result = pickRandomPlayableCard(hand, leadCard, trump);
    expect(result).toEqual({ suit: 'diamonds', rank: 'jack' });
  });

  // ... Additional tests for edge cases
});

describe('decideWinner', () => {
  it('should handle left being led in a trick', () => {
    const player1 = createPlayer('Alice', []);
    const player2 = createPlayer('Bob', []);

    const trick: Trick = {
      playedCards: [
        { card: { suit: 'hearts', rank: 'jack' }, player: player1 }, // Left bauer
        { card: { suit: 'diamonds', rank: '10' }, player: player2 },
      ],
      leadingPlayer: player1,
      winningCard: null,
    };

    const round: Round = {
      trump: 'diamonds',
      turn: player1,
      tricks: [],
      deck: [],
      dealer: player1,
      trumpCaller: player1,
      shootingTheMoon: false,
    };

    decideWinner(trick, round);

    expect(trick.winningCard?.player.name).toBe('Alice');
  });

  it('should handle bauer comparisons', () => {
    const player1 = createPlayer('Alice', []);
    const player2 = createPlayer('Bob', []);

    const trick: Trick = {
      playedCards: [
        { card: { suit: 'hearts', rank: 'jack' }, player: player1 }, // Left bauer
        { card: { suit: 'diamonds', rank: 'jack' }, player: player2 }, // Right bauer
      ],
      leadingPlayer: player1,
      winningCard: null,
    };

    const round: Round = {
      trump: 'diamonds',
      turn: player1,
      tricks: [],
      deck: [],
      dealer: player1,
      trumpCaller: player1,
      shootingTheMoon: false,
    };

    decideWinner(trick, round);

    expect(trick.winningCard?.player.name).toBe('Bob');
  });

  it('should handle left being played after trump is led', () => {
    const player1 = createPlayer('Alice', []);
    const player2 = createPlayer('Bob', []);

    const trick: Trick = {
      playedCards: [
        { card: { suit: 'diamonds', rank: '10' }, player: player1 }, // Trump
        { card: { suit: 'hearts', rank: 'jack' }, player: player2 }, // Left bauer
      ],
      leadingPlayer: player1,
      winningCard: null,
    };

    const round: Round = {
      trump: 'diamonds',
      turn: player1,
      tricks: [],
      deck: [],
      dealer: player1,
      trumpCaller: player1,
      shootingTheMoon: false,
    };

    decideWinner(trick, round);

    expect(trick.winningCard?.player.name).toBe('Bob');
  });

  // ... Additional tests for edge cases
});
