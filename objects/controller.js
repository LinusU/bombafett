'use strict'

const Actor = require('gamox').Actor

class Controller extends Actor {
  create () {
    const { roomWidth, roomHeight } = this
    let other
    this.solid = false

    function typeHere (x, y) {
      if (x === 0 || y === 0) return 'wall'
      if (x === roomWidth - 32) return 'wall'
      if (y === roomHeight - 32) return 'wall'
      if ((x % 64) === 0 && (y % 64) === 0) return 'wall'

      if (x === 32 && y === 32) return 'player'
      if (x === 32 && y === roomWidth - 64) return 'player'
      if (x === roomHeight - 64 && y === 32) return 'player'
      if (x === roomHeight - 64 && y === roomWidth - 64) return 'player'

      if (x < 96 && y < 96) return null
      if (x >= roomWidth - 96 && y < 96) return null
      if (x < 96 && y >= roomHeight - 96) return null
      if (x >= roomWidth - 96 && y >= roomHeight - 96) return null

      if (Math.random() < .6) return 'box'

      return null
    }

    for (let x = 0; x < roomWidth; x += 32) {
      for (let y = 0; y < roomHeight; y += 32) {
        const type = typeHere(x, y)

        if (type) this.createInstance(type, x, y, false)
      }
    }
  }

  toString() { return '[Actor Controller]' }
}

module.exports = Controller
