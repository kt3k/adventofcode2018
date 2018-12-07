let polymer = require('fs').readFileSync(0, 'utf-8').trim().split('')

const react = polymer => {
  const reacted = Array(polymer.length).fill(false);
  for (let i = 0; i < polymer.length; i++) {
    const prev = polymer[i - 1]
    const x = polymer[i]
    const next = polymer[i + 1]

    if (reacts(prev, x)) {
      if (reacts(x, next)) {
        reacted[i] = true
        reacted[i + 1] = true
        reacted[i - 1] = false
      } else {
        reacted[i - 1] = true
        reacted[i] = true
      }
    }

  }

  return polymer.filter((_, i) => !reacted[i])
}

const reacts = (a, b) => {
  if (a == null || b == null) {
    return false
  }
  return Math.abs(a.charCodeAt(0) - b.charCodeAt(0)) === 32
}

let length = polymer.length

console.log(length)

while (true) {
  //console.log(polymer.join(''))
  polymer = react(polymer)

  console.log(length)

  if (polymer.length === length) {
    //console.log(polymer.join(''))
    console.log(`The answer is: ${polymer.length}`)
    break;
  }

  length = polymer.length
}
