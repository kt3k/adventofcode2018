const list = require('./util').read().sort()

const re = /\[(\d\d\d\d)-(\d\d)-(\d\d) (\d\d):(\d\d)\] (Guard #(\d+) begins shift|wakes up|falls asleep)/

const parse = line => {
  const match = line.match(re)
  if (match[7]) {
    return { type: 'start', id: match[7] }
  }

  if (match[6] === 'falls asleep') {
    return { type: 'sleep', minutes: +match[5] }
  }

  if (match[6] === 'wakes up') {
    return { type: 'wake', minutes: +match[5] }
  }

  throw new Error(`Cannot parse line: ${line}`)
}

const records = list.map(parse)
const days = []

console.log(records)

records.forEach(record => {
  if (record.type === 'start') {
    days.unshift({ id: record.id, events: {} })
  } else {
    days[0].events[record.minutes] = record.type
  }
})

const STATE_UP = 'up'
const STATE_ASLEEP = 'asleep'

const sleptMinutes = ({ events })=> {
  const minutes = []
  let state = STATE_UP
  for (let i = 0; i < 60; i++) {
    if (events[i] === 'sleep') {
      state = STATE_ASLEEP
    } else if (events[i] === 'wake') {
      state = STATE_UP
    }

    if (state === STATE_ASLEEP) {
      minutes.push(i)
    }
  }

  return minutes
}

const guards = {}

days.forEach(day => {
  const slept = sleptMinutes(day).length
  guards[day.id] = guards[day.id] || []
  guards[day.id].push(slept)
})

const avg = arr => total(arr) / arr.length
const total = arr => arr.reduce((x, y) => x + y)

Object.keys(guards).forEach(id => {
  const s = total(guards[id])
  console.log(id, s)
})

const minutes = Array(60).fill(0)

const targetId = '1523'

days.filter(day => day.id === targetId).forEach(day => {
  sleptMinutes(day).forEach(i => minutes[i]++)
})

minutes.forEach((v, i) => console.log(i, v))

console.log(`The answer is: ${targetId * 43}`)
