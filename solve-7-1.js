#!/usr/bin/env deno

import { readFileSync } from 'deno'

const re = /^Step (.) must be finished before step (.) can begin.$/

const parse = line => {
  const match = line.match(re)

  return {
    to: match[2],
    from: match[1]
  }
}

class Node {
  constructor(name) {
    this.name = name
    this.next = []
    this.parents = []
    this.done = false
  }

  addNext(node) {
    node.parents.push(this)
    this.next.push(node)
  }
}

const exec = (nextNodes) => {
  let result = ''

  while (nextNodes.length > 0) {
    let candidate
    for (let i = 0; i < nextNodes.length; i++) {
      const node = nextNodes[i]
      if (node.parents.every(parent => parent.done)) {
        if (!candidate || node.name < candidate.name) {
          candidate = node
        }
      }
    }
    result += candidate.name
    candidate.done = true
    nextNodes.splice(nextNodes.indexOf(candidate), 1)
    candidate.next.forEach(node => {
      if (!nextNodes.includes(node)) {
        nextNodes.push(node)
      }
    })
    console.log(candidate)
  }

  return result
}

const main = () => {
  const instructions = new TextDecoder().decode(readFileSync('/dev/stdin')).trim().split('\n').map(parse)

  const map = {}

  instructions.forEach(({ from, to }) => {
    map[from] = map[from] || new Node(from)
    map[to] = map[to] || new Node(to)
    map[from].addNext(map[to])
  })

  const nodes = Object.keys(map).map(key => map[key]).filter(node => node.parents.length === 0)
  console.log(`The answer is: ${exec(nodes)}`)
}

main()
