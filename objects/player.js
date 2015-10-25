'use strict'

const Actor = require('gamox').Actor

const RIGHT = 0
const LEFT = 1
const DOWN = 2
const UP = 3

const COOLDOWN = 90
const SPRITES = ['grobb', 'gropp', 'groameesh', 'george']
const KEYS = [
  [ 262, 263, 264, 265, 46 ],
  [ 68, 65, 83, 87, 88 ]
]

const ANIM = {
  stand: [[0], [1], [2], [3]],
  walk: [[4, 5, 6], [7, 8, 9], [10, 11], [12, 13]],
  frameCount: 14
}

let playerCount = 0

class Player extends Actor {
  create () {
    this.solid = false

    this.playerId = playerCount++
    this.setSpriteFromName(SPRITES[this.playerId])
    this.animationSpeed = 0

    this.cooldown = 0
    this.animCounter = 0

    this.walkDirection = DOWN
  }

  step () {
    const keys = KEYS[this.playerId]

    if (this.cooldown > 0) {
      this.cooldown--
    }

    let isMoving = false

    if (this.checkKeyboard(keys[0])) {
      this.walkDirection = RIGHT
      if (this.checkEmpty(2, 0, true, true)) {
        this.x += 2
        isMoving = true
      }
    }

    if (this.checkKeyboard(keys[1])) {
      this.walkDirection = LEFT
      if (this.checkEmpty(-2, 0, true, true)) {
        this.x -= 2
        isMoving = true
      }
    }

    if (this.checkKeyboard(keys[2])) {
      this.walkDirection = DOWN
      if (this.checkEmpty(0, 2, true, true)) {
        this.y += 2
        isMoving = true
      }
    }

    if (this.checkKeyboard(keys[3])) {
      this.walkDirection = UP
      if (this.checkEmpty(0, -2, true, true)) {
        this.y -= 2
        isMoving = true
      }
    }

    if (this.checkKeyboard(keys[4])) {
      if (this.cooldown <= 0) {
        this.createInstance('bomb', 0, 0, true)
        this.cooldown = COOLDOWN
      }
    }

    const anim = ANIM[(isMoving ? 'walk' : 'stand')][this.walkDirection]

    this.frameIndex = anim[Math.floor(this.animCounter) % anim.length]
    this.animCounter += 0.05
  }
}

module.exports = Player
