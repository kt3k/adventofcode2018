#!/usr/bin/env deno

import { readFileSync } from 'deno'

const re = /position=< ?(-?\d+),  ?(-?\d+)> velocity=< ?(-?\d+),  ?(-?\d+)>/

const parse = (line: string) => {
  const match = line.match(re)

  return {
    x: +match[1],
    y: +match[2],
    u: +match[3],
    v: +match[4]
  }
}

const stepOne = point => {
  point.x += point.u
  point.y += point.v
}

const step = points => {
  points.forEach(stepOne)
}

const main = () => {
  const points = new TextDecoder().decode(readFileSync('/dev/stdin')).trim().split('\n').map(parse)

  console.log(points)

  let i = 0
  const MAX = 20000
  const TARGET = 10659 - 0

  while (i < TARGET) {
    step(points)
    const r = Math.max(...points.map(p => p.x))
    const l = Math.min(...points.map(p => p.x))
    const b = Math.max(...points.map(p => p.y))
    const t = Math.min(...points.map(p => p.y))
    console.log(`${i}: ${Math.abs(r-l)}x${Math.abs(b-t)}`)
    i++
  }

  draw(points)
}

const draw = (points) => {

  const r = Math.max(...points.map(p => p.x))
  const l = Math.min(...points.map(p => p.x))
  const b = Math.max(...points.map(p => p.y))
  const t = Math.min(...points.map(p => p.y))

  for (let i = t; i <= b; i++) {
    const buf = []

    for (let j = l; j <= r; j++) {
      if (points.some(p => p.x === j && p.y === i)) {
        buf.push('#')
      } else {
        buf.push('.')
      }
    }

    console.log(buf.join(''))
  }
}

main()
