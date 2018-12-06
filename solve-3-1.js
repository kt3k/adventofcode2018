const input = require('fs').readFileSync(0, 'utf-8').trim().split('\n')

const re = /^#(\d+) @ (\d+),(\d+): (\d+)x(\d+)$/
const parse = line => {
  console.log(line)
  const match = line.match(re)
  return {
    id: +match[1],
    x: +match[2],
    y: +match[3],
    w: +match[4],
    h: +match[5]
  }
}

const array = input.map(parse)

const fabric = []

;[...Array(1000)].forEach(() => {
  fabric.push(Array(1000).fill(0))
})

console.log(fabric.length)
console.log(fabric[0].length)

array.forEach(({x, y, w, h}) => {
  console.log(x, y, w, h)
  for (let i = 0; i < w; i++) {
    for (let j = 0; j < h; j++) {
      fabric[x + i][y + j]++
    }
  }
})

let m = 0

fabric.forEach(line => {
  line.forEach(p => {
    if (p > 1) {
      m++
    }
  })
})

console.log(m)
