const input = require('fs').readFileSync(0, 'utf-8').trim().split('\n')

const re = /^#(\d+) @ (\d+),(\d+): (\d+)x(\d+)$/
const parse = line => {
  const match = line.match(re)
  return {
    id: +match[1],
    x: +match[2],
    y: +match[3],
    w: +match[4],
    h: +match[5]
  }
}

const claims = input.map(parse)

const fabric = []

;[...Array(1000)].forEach(() => {
  fabric.push(Array(1000).fill(0))
})

claims.forEach(({x, y, w, h}) => {
  for (let i = 0; i < w; i++) {
    for (let j = 0; j < h; j++) {
      fabric[x + i][y + j]++
    }
  }
})

claims.forEach(({id, x, y, w, h}) => {
  for (let i = 0; i < w; i++) {
    for (let j = 0; j < h; j++) {
      if (fabric[x + i][y + j] > 1) {
        return
      }
    }
  }

  console.log(id)
})

console.log(claims.length)
