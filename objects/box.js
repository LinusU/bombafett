'use strict'

const Actor = require('gamox').Actor

class Box extends Actor {
  create () {
    this.setSpriteFromName('box')
    this.solid = true
  }
}

module.exports = Box
