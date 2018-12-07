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
      let total = 0

      for (let k = 0; k < points.length; k++) {
        const point = points[k]
        total += dist(i, j, ...point)
      }

      area[i][j] = total
    }
  }

  let count = 0

  area.forEach(line => {
    line.forEach(total => {
      if (total < 10000) {
        count++
      }
    })
  })

  console.log(`The answer is: ${count}`)
}

main()
