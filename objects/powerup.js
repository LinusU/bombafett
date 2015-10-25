'use strict'

const Actor = require('gamox').Actor

class Powerup extends Actor {
  create () {
    this.setSpriteFromName('powerup')
    this.animationSpeed = 0
    this.solid = false

    this.frameIndex = Math.floor(Math.random() * 3)
  }
}

module.exports = Powerup
