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

const reactWithoutType = (polymer, type) => {
  type = type.toLowerCase()
  polymer = polymer.filter(c => c.toLowerCase() !== type)
  while (true) {
    // console.log(length)
    polymer = react(polymer)

    if (polymer.length === length) {
      console.log(`type: ${type}, length: ${polymer.length}`)
      break;
    }

    length = polymer.length
  }
}

;'abcdefghiklmnopqrstuvwxyz'.split('').forEach(type => {
  reactWithoutType(polymer, type)
})
