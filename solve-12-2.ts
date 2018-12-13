#!/usr/bin/env deno

import { readFileSync } from 'deno'

// const MAX = 20
const MAX = 2000
const PREPEND = 10
const APPEND = 100
let ruleMap

const parseState = line => {
  const match = line.match(/initial state: ([#.]+)$/)
  const state = match[1]
  return state.split('')
}

const nextState = (state, index) => {
  const next = []

  for (let i = 0; i < state.length; i++) {
    const l0 = state[i - 2] || '.'
    const l1 = state[i - 1] || '.'
    const c = state[i]
    const r0 = state[i + 1] || '.'
    const r1 = state[i + 2] || '.'
    next.push(ruleMap[l0 + l1 + c + r0 + r1] || '.')
  }

  if (next[next.length - 2] === '#' || next[next.length - 1] === '#') {
    next.push('.', '.')
  }

  while (next[0] === '.' && next[1] === '.') {
    next.shift()
    index++
  }

  while (next[0] === '#') {
    next.unshift('.')
    index--
  }

  return [next, index]
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

const calc = (state, index) => {
  let total = 0

  state.forEach((v, i) => {
    if (v === '#') {
      total += i + index
    }
  })

  return total
}

const main = () => {
  const [init, _, ...rules] = new TextDecoder().decode(readFileSync('/dev/stdin')).trim().split('\n')

  ruleMap = parseRules(rules.map(parseRule))
  console.log(ruleMap)


  let state = [].concat(Array(PREPEND).fill('.'), parseState(init), Array(APPEND).fill('.'))

  let i = 0
  let index = -PREPEND
  console.log(`${i}: ${state.join('')}`)
  let currentPoint = 0
  while (i++ < MAX) {
    [state, index]  = nextState(state, index)
    const p = calc(state, index)
    console.log(`${i}: ${p}(${p-currentPoint})`)
    currentPoint = p
    // console.log(`${i}: ${state.join('')}`)
    /*
    if (i % 1000 === 0) {
      console.log(`${i}: ${index} ${state.length}`)
      console.log(`${i}: ${state.join('')}`)
    }
    */
  }
}

main()
