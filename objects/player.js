'use strict'

const { Actor, Gamepad } = require('gamox')

const NES_X = 3
const NES_Y = 4

const NES_A = 1
const NES_B = 2

const RIGHT = 0
const LEFT = 1
const DOWN = 2
const UP = 3

const COOLDOWN = 90
const SPRITES = ['grobb', 'gropp', 'groameesh', 'george']
const ANIM = {
  stand: [[0], [1], [2], [3]],
  walk: [[4, 5, 6], [7, 8, 9], [10, 11], [12, 13]]
}

let playerCount = 0

class Player extends Actor {
  create () {
    this.solid = false

    const playerId = playerCount++

    this.gamepad = new Gamepad(playerId)
    this.setSpriteFromName(SPRITES[playerId])
    this.animationSpeed = 0

    this.animCounter = 0

    this.bombPower = 2
    this.walkSpeed = 2

    this.maxMana = COOLDOWN
    this.curMana = COOLDOWN

    this.walkDirection = DOWN
  }

  step () {
    let other
    const { axes, buttons } = this.gamepad.update()

    if (this.curMana < this.maxMana) {
      this.curMana += 1
    }

    let isMoving = false

    if (axes[NES_X] > .5) {
      this.walkDirection = RIGHT
      if (this.checkEmpty(this.walkSpeed, 0, true, true)) {
        this.x += this.walkSpeed
        isMoving = true
      }
    }

    if (axes[NES_X] < -.5) {
      this.walkDirection = LEFT
      if (this.checkEmpty(-this.walkSpeed, 0, true, true)) {
        this.x -= this.walkSpeed
        isMoving = true
      }
    }

    if (axes[NES_Y] > .5) {
      this.walkDirection = DOWN
      if (this.checkEmpty(0, this.walkSpeed, true, true)) {
        this.y += this.walkSpeed
        isMoving = true
      }
    }

    if (axes[NES_Y] < -.5) {
      this.walkDirection = UP
      if (this.checkEmpty(0, -this.walkSpeed, true, true)) {
        this.y -= this.walkSpeed
        isMoving = true
      }
    }

    if (buttons[NES_A]) {
      if (this.curMana >= COOLDOWN) {
        if (this.checkEmpty(0, 0, true, false)) {
          this.curMana -= COOLDOWN
          other = this.createInstance('bomb', 0, 0, true)
          other.power = this.bombPower
        }
      }
    }

    if (isMoving) {
      let pu = this.collisionRectangle(this.x, this.y, this.x + 32, this.y + 32, 'powerup', false, true)
      if (pu) {
        switch (pu.frameIndex) {
          case 0: this.bombPower += 1; break
          case 1: this.maxMana += COOLDOWN; this.curMana += COOLDOWN; break
          // case 2: this.walkSpeed += 2; break
        }
        pu.destroyInstance()
      }
    }

    const anim = ANIM[(isMoving ? 'walk' : 'stand')][this.walkDirection]

    this.frameIndex = anim[Math.floor(this.animCounter) % anim.length]
    this.animCounter += 0.05
  }
}

module.exports = Player
