#!/usr/bin/env deno

import { readFileSync } from 'deno'

const PLAYERS = 430
// const PLAYERS = 10
const MAX = 71588
// const MAX = 1618

const points = {}

const play = (circle: number[], current, next, player) => {
  let target
  if (next % 23 === 0) {
    points[player] = points[player] || 0
    points[player] += next
    target = (current + circle.length - 7) % circle.length
    const removed = circle.splice(target, 1)
    points[player] += removed[0]
  } else {
    target = (current + 2) % circle.length
    circle.splice(target, 0, next)
  }

  return target
}

const nextPlayer = player => (player + 1) % PLAYERS

const main = () => {
  const circle = [0]
  let next = 1
  let current = 0
  let player = 0

  while (next < MAX) {
    current = play(circle, current, next, player)
    player = nextPlayer(player)
    // console.log(circle)
    next++
  }

  console.log(points)

  const array: number[] = Object.values(points)

  console.log(`The answer is: ${Math.max(...array)}`)
}

main()
