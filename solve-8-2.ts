#!/usr/bin/env deno

import { readFileSync } from 'deno'

let total = 0

const main = () => {
  const numbers = new TextDecoder().decode(readFileSync('/dev/stdin')).trim().split(' ').map(Number)

  const value = consumeNode(numbers)
  console.log(numbers.length)

  console.log(`The answer is: ${value}`)
}

const consumeNode = (numbers) => {
  let nodes = numbers.shift()
  let metas = numbers.shift()
  let isLeaf = nodes === 0

  let value = 0
  const nodeList = []

  while (nodes) {
    nodeList.push(consumeNode(numbers))
    nodes--
  }

  while (metas) {
    const meta = numbers.shift()
    if (isLeaf) {
      value += meta
      console.log(value)
    } else {
      value += nodeList[meta - 1] || 0
      console.log(value)
    }
    metas--
  }

  return value
}

main()
