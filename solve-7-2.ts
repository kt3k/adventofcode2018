#!/usr/bin/env deno

import { readFileSync } from 'deno'

const re = /^Step (.) must be finished before step (.) can begin.$/

const parse = (line: string) => {
  const match = line.match(re)

  return {
    to: match[2],
    from: match[1]
  }
}

class Node {
  name: string
  next: Node[]
  parents: Node[]
  spent: number

  constructor(name: string) {
    this.name = name
    this.next = []
    this.parents = []
    this.spent = 0
  }

  addNext(node: Node) {
    node.parents.push(this)
    this.next.push(node)
  }

  done() {
    return this.spent >= this.name.charCodeAt(0) - 4
  }
}

const exec = (nextNodes: Node[]) => {
  let steps = 0
  let doing: Node[] = []

  while (nextNodes.length > 0 || doing.length > 0) {
    const candidates = []

    for (let i = 0; i < nextNodes.length; i++) {
      const node = nextNodes[i]
      if (node.parents.every(parent => parent.done())) {
        candidates.push(node)
      }
    }

    while (doing.length < 5 && candidates.length > 0) {
      let candidate

      candidates.forEach(node => {
        if (!candidate || node.name < candidate.name) {
          candidate = node
        }
      })

      candidates.splice(candidates.indexOf(candidate), 1)
      nextNodes.splice(nextNodes.indexOf(candidate), 1)
      doing.push(candidate)
    }

    doing.forEach(node => {
      node.spent++
    })

    doing.forEach(node => {
      if (node.done()) {
        node.next.forEach(n => {
          if (!nextNodes.includes(n)) {
            nextNodes.push(n)
          }
        })
      }
    })

    doing = doing.filter(node => !node.done())
    console.log(doing.map(node => node.name).join(''))

    steps++
  }

  return steps
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
