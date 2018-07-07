'use strict'

global.approot = require('app-root-path')
const Seats = require(global.approot + '/app/seats.js')

let currentSeats = new Seats([[3,2],[4,3],[2,3],[3,4]]);
currentSeats.displaySeatMap(10)
currentSeats.displaySeatMap(30)

currentSeats = new Seats([[2,2],[2,6], [4,4]]);
currentSeats.displaySeatMap(15)
currentSeats.displaySeatMap(25)

