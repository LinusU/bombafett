'use strict'

const Actor = require('gamox').Actor

class Box extends Actor {
  create () {
    this.setSpriteFromName('box')
    this.solid = true
  }

  toString() { return '[Actor Box]' }

  destroy () {
    if (Math.random() < .2) {
      this.createInstance('powerup', 0, 0, true)
    }
  }
}

module.exports = Box
