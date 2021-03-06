'use strict'

const Actor = require('gamox').Actor

class Wall extends Actor {
  create () {
    this.setSpriteFromName('wall')
    this.solid = true
  }

  toString() { return '[Actor Wall]' }
}

module.exports = Wall
