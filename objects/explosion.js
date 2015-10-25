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
        case 'right': this.frameIndex = 1; break
        case 'left': this.frameIndex = 1; break
        case 'down': this.frameIndex = 5; break
        case 'up': this.frameIndex = 5; break
        case 'right-end': this.frameIndex = 3; break
        case 'left-end': this.frameIndex = 0; break
        case 'down-end': this.frameIndex = 6; break
        case 'up-end': this.frameIndex = 4; break
      }
    }

    if (this.ttl === 0) this.destroyInstance()

    this.ttl--
  }

  destroy () {
    let other, box, player
    const { x, y, power } = this

    if (this.explosionType === 'initial') {
      other = this.createInstance('explosion', 0, 0, true)
      other.explosionType = 'origin'

      const addExpl = (dx, dy, explosionType, power) => {
        other = this.collisionRectangle(x + dx, y + dy, x + dx + 32, y + dy + 32, 'box', false, true)
        if (other) {
          other.destroyInstance()
          power = 0
        }

        other = this.collisionRectangle(x + dx, y + dy, x + dx + 32, y + dy + 32, 'player', false, true)
        if (other) {
          other.destroyInstance()
        }

        if (this.checkEmpty(dx, dy, true, true)) {
          other = this.createInstance('explosion', dx, dy, true)
          other.explosionType = explosionType

          if (power > 0) {
            addExpl(dx + Math.sign(dx) * 32, dy + Math.sign(dy) * 32, explosionType, power - 1)
          } else {
            other.explosionType += '-end'
          }
        }
      }

      addExpl(32, 0, 'right', power - 1)
      addExpl(-32, 0, 'left', power - 1)
      addExpl(0, 32, 'down', power - 1)
      addExpl(0, -32, 'up', power - 1)
    }
  }
}

module.exports = Explosion
