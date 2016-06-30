const { Turn } = require('../src/Turn.js')
const C = require('../src/constants.js')

class Game {
  constructor () {
    const board = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ]
    this.turn = new Turn(board, [], [])
    this.players = {}
    this.sockets = []
  }

  onPlayerJoin (socket) {
    let bikeId = 0
    while (this.sockets[bikeId] != null) ++bikeId
    this.sockets[bikeId] = socket
    this.players[socket.id] = bikeId
    this.turn.addPlayer(bikeId)

    const state = {
      turn: this.turn,
      players: this.players
    }
    this.sockets.forEach((socket) => socket && socket.emit('game:state', state))
  }

  onChangeDir (socket, dir) {
    const bikeId = this.players[socket.id]
    this.turn.setInput(bikeId, dir)
  }

  onPlayerLeave (socket) {
    const bikeId = this.players[socket.id]
    this.turn.setInput(bikeId, C.SELF_DESTRUCT)

    delete this.players[socket.id]
    this.sockets[bikeId] = null
  }
}
exports.Game = Game