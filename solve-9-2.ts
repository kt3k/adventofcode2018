#!/usr/bin/env deno

import { readFileSync } from 'deno'

const PLAYERS = 430
// const PLAYERS = 10
const MAX = 7158800
// const MAX = 1618

const points = {}

class Node {
  num: number
  next: Node
  prev: Node
  constructor(num: number) {
    this.num = num
  }

  append(node: Node) {
    node.next = this.next
    node.next.prev = node
    node.prev = this
    this.next = node
  }

  remove() {
    const next = this.next
    next.prev = this.prev
    next.prev.next = next
  }
}

const play = (current: Node, next, player): Node => {
  if (next % 23 === 0) {
    const target = current.prev.prev.prev.prev.prev.prev.prev
    const targetNext = target.next

    // console.log(target)

    points[player] = points[player] || 0
    points[player] += next
    points[player] += target.num

    target.remove()

    return targetNext
  }

  const newNode = new Node(next)
  current.next.append(newNode)
  return newNode
}

const nextPlayer = player => (player + 1) % PLAYERS

const main = () => {
  const zero = new Node(0)
  zero.next = zero
  zero.prev = zero
  let next = 1
  let current = zero
  let player = 0

  while (next < MAX) {
    current = play(current, next, player)
    player = nextPlayer(player)
    // console.log(circle)
    next++
  }

  console.log(points)

  const array: number[] = Object.values(points)

  console.log(`The answer is: ${Math.max(...array)}`)
}

main()
