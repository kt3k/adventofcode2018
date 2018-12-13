#!/usr/bin/env deno

import { readFileSync } from 'deno'

// const MAX = 20
const MAX = 20
const PREPEND = 10
const APPEND = 100
let ruleMap
const nodeMap = {}
const nextNodeMap = {}

const parseState = line => {
  const cache = nodeMap[line]
  if (cache) {
    return cache
  }

  if (line.length === 1) {
    return nodeMap[line] = new Leaf(line)
  }

  let n = 1
  let level = 0
  while (line.length > n) {
    n *= 2
    level += 1
  }

  line += '.'.repeat(n - line.length)

  const left = line.slice(0, n / 2)
  const right = line.slice(n / 2, n)

  const node = new Branch(level)
  node.l = parseState(left)
  node.r = parseState(right)

  return nodeMap[line] = node
}

let i = 0
const getId = () => i++

class Node {
  length: number
  level: number
  id: number
  constructor(level) {
    this.level = level
    this.id = getId()
  }
  nextState(): Node {
    return this
  }
  join(): string {
    return ''
  }
}

const emptyNodeMap = {}

const createEmptyNode = level => {
  if (level === 0) {
    return nodeMap['.']
  }

  return
}

class Branch extends Node {
  l: Node
  r: Node

  nextState() {
    return this
  }

  join() {
    return '.#'
  }
}

class Leaf extends Node {
  s: string
  constructor(s) {
    super(0)
    this.s = s
  }
  occupied() {
    this.s === '#'
  }
}

const parseRule = line => {
  const [cond, result] = line.split(' => ')
  return {
    cond,
    result
  }
}

const parseRules = rules => {
  const map = {}
  rules.forEach(rule => {
    map[rule.cond] = rule.result
  })

  return map
}

const main = () => {
  const [init, _, ...rules] = new TextDecoder().decode(readFileSync('/dev/stdin')).trim().split('\n')
  const match = init.match(/initial state: ([#.]+)$/)
  let initStr = match[1]

  ruleMap = parseRules(rules.map(parseRule))

  let state = parseState(initStr)

  let i = 0
  console.log(`${i}: ${state.length}`)
  console.log(`${i}: ${state.join()}`)
  while (i < MAX) {
    i++
    state = state.nextState()
    if (i % 1000 === 0) {
      console.log(`${i}: ${state.length}`)
      console.log(`${i}: ${state.join()}`)
    }
  }

  console.log(JSON.stringify(nodeMap, null, 2))

  let total = 0

  console.log(total)
}

main()
