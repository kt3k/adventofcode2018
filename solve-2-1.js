const input = require('fs').readFileSync(0, 'utf-8')

const array = input.trim().split('\n')

const re = {}
;'abcdefghijklmnopqrstuvwxyz'.split('').forEach(c => {
  re[c] = new RegExp(c, 'g')
})

const count = (c, str) => str.match(new RegExp(c, 'g')).length
const have = n => id => id.split('').some(c => {
  const b = count(c, id) === n
  //if (b) { console.log(n, c, id) }
  return b
})
const haveTwo = have(2)
const haveThree = have(3)

console.log(array[0])
console.log(haveTwo(array[0]))
console.log(array.length)
console.log(array.filter(haveTwo).length)
console.log(array.filter(haveThree).length)


console.log(array.filter(haveTwo).length * array.filter(haveThree).length)
