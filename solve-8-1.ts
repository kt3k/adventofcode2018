#!/usr/bin/env deno

import { readFileSync } from 'deno'

let total = 0

const main = () => {
  const numbers = new TextDecoder().decode(readFileSync('/dev/stdin')).trim().split(' ').map(Number)

  consumeNode(numbers)
  console.log(numbers.length)

  console.log(`The answer is: ${total}`)
}

const consumeNode = (numbers) => {
  let nodes = numbers.shift()
  let metas = numbers.shift()

  while (nodes) {
    consumeNode(numbers)
    nodes--
  }

  while (metas) {
    const meta = numbers.shift()
    total += meta
    metas--
  }
}

main()
