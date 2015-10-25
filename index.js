'use strict'

const path = require('path')
const gamox = require('gamox')

const Box = require('./objects/box')
const Wall = require('./objects/wall')
const Bomb = require('./objects/bomb')
const Player = require('./objects/player')
const Explosion = require('./objects/explosion')
const Controller = require('./objects/controller')

const ASSETS = path.join(__dirname, 'assets.json')
const ROOM_MAIN = path.join(__dirname, 'room.json')

const VK_ESCAPE = 256

const GAME = {
  name: 'Bombafett',
  assets: ASSETS,
  rooms: [
    { id: 'main', path: ROOM_MAIN }
  ],
  objects: [
    { id: 'box', class: Box },
    { id: 'wall', class: Wall },
    { id: 'bomb', class: Bomb },
    { id: 'player', class: Player },
    { id: 'explosion', class: Explosion },
    { id: 'controller', class: Controller }
  ]
}

gamox.createGame(GAME, function (err, game) {
  if (err) throw err

  game.on('key', ({ key }) => {
    if (key === VK_ESCAPE) process.exit(0)
  })

  game.runRoom('main')
})
