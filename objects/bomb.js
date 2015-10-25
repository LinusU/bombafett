'use strict'

const Actor = require('gamox').Actor

class Bomb extends Actor {
  create () {
    this.setSpriteFromName('bomb')
    this.animationSpeed = 0.05
    this.solid = false // FIXME

    this.x = Math.round(this.x / 32) * 32
    this.y = Math.round(this.y / 32) * 32

    this.ttl = 90
  }

  step () {
    if (this.ttl === 0) this.destroyInstance()

    this.ttl--
  }

  destroy () {
    let other

    other = this.createInstance('explosion', 0, 0, true)
    other.explosionType = 'initial'
    other.power = this.power
  }
}

module.exports = Bomb
