const input = require('fs').readFileSync(0, 'utf-8')

const array = input.trim().split('\n')

const dist = (a, b) => {
  let dist = 0
  for (let i = 0; i < a.length; i++) {
    if (a.charAt(i) !== b.charAt(i)) {
      dist++
    }
  }
  return dist
}

const distOne = (a, b) => dist(a, b) === 1

const pairs = []

array.forEach(a => {
  array.forEach(b => {
    if (a === b) {
      return
    }

    if (dist(a, b) === 1) {
      pairs.push([a, b])
    }
  })
})

console.log(pairs)
