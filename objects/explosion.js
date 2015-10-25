'use strict'

const Actor = require('gamox').Actor

class Explosion extends Actor {
  create () {
    this.setSpriteFromName('explosion')
    this.animationSpeed = 0.1875
    this.solid = false

    this.setupDone = false
  }

  step () {
    if (this.setupDone === false) {
      this.setupDone = true

      const isInitial = (this.explosionType === 'initial')
      this.ttl = (isInitial ? 16 : 60)
      this.animationSpeed = (isInitial ? 0.1875 : 0)
      this.setSpriteFromName(isInitial ? 'explosion' : 'explosion-arms')

      switch (this.explosionType) {
        case 'origin': this.frameIndex = 2; break
        case 'right': this.frameIndex = 3; break
        case 'left': this.frameIndex = 0; break
        case 'down': this.frameIndex = 6; break
        case 'up': this.frameIndex = 4; break
      }
    }

    if (this.ttl === 0) this.destroyInstance()

    this.ttl--
  }

  destroy () {
    let other, box, player
    const { x, y } = this

    if (this.explosionType === 'initial') {
      other = this.createInstance('explosion', 0, 0, true)
      other.explosionType = 'origin'

      box = this.collisionRectangle(x + 32, y, x + 64, y + 32, 'box', false, true)
      if (box) box.destroyInstance()
      player = this.collisionRectangle(x + 32, y, x + 64, y + 32, 'player', false, true)
      if (player) player.destroyInstance()
      if (this.checkEmpty(32, 0, true, true)) {
        other = this.createInstance('explosion', 32, 0, true)
        other.explosionType = 'right'
      }

      box = this.collisionRectangle(x - 32, y, x, y + 32, 'box', false, true)
      if (box) box.destroyInstance()
      player = this.collisionRectangle(x - 32, y, x, y + 32, 'player', false, true)
      if (player) player.destroyInstance()
      if (this.checkEmpty(-32, 0, true, true)) {
        other = this.createInstance('explosion', -32, 0, true)
        other.explosionType = 'left'
      }

      box = this.collisionRectangle(x, y + 32, x + 32, y + 64, 'box', false, true)
      if (box) box.destroyInstance()
      player = this.collisionRectangle(x, y + 32, x + 32, y + 64, 'player', false, true)
      if (player) player.destroyInstance()
      if (this.checkEmpty(0, 32, true, true)) {
        other = this.createInstance('explosion', 0, 32, true)
        other.explosionType = 'down'
      }

      box = this.collisionRectangle(x, y - 32, x + 32, y, 'box', false, true)
      if (box) box.destroyInstance()
      player = this.collisionRectangle(x, y - 32, x + 32, y, 'player', false, true)
      if (player) player.destroyInstance()
      if (this.checkEmpty(0, -32, true, true)) {
        other = this.createInstance('explosion', 0, -32, true)
        other.explosionType = 'up'
      }
    }
  }
}

module.exports = Explosion
