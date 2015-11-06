'use strict'

const { Actor, Gamepad } = require('gamox')

const Powerup = require('./powerup')
const Explosion = require('./explosion')

const NES_X = 3
const NES_Y = 4

const NES_A = 1
const NES_B = 2

const RIGHT = 0
const LEFT = 1
const DOWN = 2
const UP = 3
const IDLE = 4

const COOLDOWN = 90
const SPRITES = ['grobb', 'gropp', 'groameesh', 'george']
const ANIM = {
  stand: [[0], [1], [2], [3]],
  walk: [[4, 5, 6], [7, 8, 9], [10, 11], [12, 13]],
  dead: 14
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

    this.bombPower = 1
    this.walkSpeed = 2

    this.maxMana = COOLDOWN
    this.curMana = COOLDOWN

    this.alive = true
    this.action = IDLE
    this.walkDirection = DOWN

    this.target = [this.x, this.y]
  }

  toString() { return '[Actor Player]' }

  step () {
    if (!this.alive) return

    let other

    let { action } = this
    const { axes, buttons } = this.gamepad.update()

    if (this.curMana < this.maxMana) {
      this.curMana += 1
    }

    if (action === IDLE) {
      let delta

      if (axes[NES_X] > .5) action = RIGHT, delta = [32, 0]
      if (axes[NES_X] < -.5) action = LEFT, delta = [-32, 0]
      if (axes[NES_Y] > .5) action = DOWN, delta = [0, 32]
      if (axes[NES_Y] < -.5) action = UP, delta = [0, -32]

      if (action !== IDLE) {
        if (!this.checkEmpty(delta[0], delta[1], true, true)) {
          action = IDLE
        } else {
          this.target = [this.x + delta[0], this.y + delta[1]]
        }
      }
    }

    if (Math.abs(this.x - this.target[0]) + Math.abs(this.y - this.target[1]) < this.walkSpeed) {
      this.x = this.target[0]
      this.y = this.target[1]
      action = IDLE
    } else {
      switch (action) {
        case RIGHT: this.x += this.walkSpeed; break
        case LEFT: this.x -= this.walkSpeed; break
        case DOWN: this.y += this.walkSpeed; break
        case UP: this.y -= this.walkSpeed; break
      }
    }

    let isMoving = (action !== IDLE)
    if (isMoving) this.walkDirection = action
    this.action = action

    if (buttons[NES_A]) {
      if (this.curMana >= COOLDOWN) {
        if (this.checkEmpty(0, 0, true, false)) {
          this.curMana -= COOLDOWN
          other = this.createInstance('bomb', 0, 0, true)
          other.power = this.bombPower
        }
      }
    }

    const anim = ANIM[(isMoving ? 'walk' : 'stand')][this.walkDirection]

    this.frameIndex = anim[Math.floor(this.animCounter) % anim.length]
    this.animCounter += 0.05
  }

  collisionWith (other) {
    if (other instanceof Powerup) {
      switch (other.frameIndex) {
        case 0: this.bombPower += 1; break
        case 1: this.maxMana += COOLDOWN; this.curMana += COOLDOWN; break
        case 2: this.walkSpeed *= 1.5; break
      }

      other.destroyInstance()
    }

    if (other instanceof Explosion) {
      this.alive = false
      this.frameIndex = ANIM.dead
    }
  }
}

module.exports = Player
