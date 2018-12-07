#!/usr/bin/env deno

import { readFileSync } from 'deno'

const parse = line => line.split(', ').map(Number)

const dist = (x0, y0, x1, y1) => {
  return Math.abs(x0 - x1) + Math.abs(y0 - y1)
}

const MAX = 600

const main = () => {
  const area = Array(MAX).fill(0).map(() => Array(MAX).fill(null))
  const points = new TextDecoder().decode(readFileSync('/dev/stdin')).trim().split('\n').map(parse)

  for (let i = 0; i < area.length; i++) {
    const line = area[i]

    for (let j = 0; j < line.length; j++) {
      let nearest = null
      let nearestDist = Infinity
      let duplicate = false

      for (let k = 0; k < points.length; k++) {
        const point = points[k]
        const d = dist(i, j, ...point)
        if (d < nearestDist) {
          nearest = k
          nearestDist = d
          duplicate = false
        } else if (d === nearestDist) {
          nearest = null
          duplicate = true
        }
      }

      if (nearest) {
        area[i][j] = nearest
      }
    }
  }

  const edges = {}

  console.log(area)

  area[0].forEach(id => { edges[id] = true })
  area[area.length - 1].forEach(id => { edges[id] = true })
  area.forEach(line => { edges[line[0]] = true })
  area.forEach(line => { edges[line[line.length - 1]] = true })

  console.log(edges)

  const counts = {}

  area.forEach(line => {
    line.forEach(id => {
      if (!edges[id]) {
        counts[id] = counts[id] || 0
        counts[id]++
      }
    })
  })

  let highest = 0

  Object.keys(counts).forEach(id => {
    if (highest < counts[id]) {
      highest = counts[id]
    }
    console.log(id, counts[id])
  })

  console.log(`The answer is: ${highest}`)
}

main()
