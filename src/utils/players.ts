import { Player } from '../types'

export function getPartner(player: Player) {
  const {player1, player2} = player.team
  return player === player1 ? player2 : player1
}