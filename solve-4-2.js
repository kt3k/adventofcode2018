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
  const slepts = sleptMinutes(day)
  guards[day.id] = guards[day.id] || []
  guards[day.id].push(slepts)
})

const avg = arr => total(arr) / arr.length
const total = arr => arr.reduce((x, y) => x + y)

const frequentMinutes = sleptRecords => {
  const minutes = Array(60).fill(0)
  sleptRecords.forEach(slepts => {
    slepts.forEach(min => minutes[min]++)
  })
  const max = Math.max(...minutes)

  const minute = minutes.findIndex(frequency => frequency === max)
  return { minute, max }
}

Object.keys(guards).forEach(id => {
  const s = frequentMinutes(guards[id])
  console.log(id, s.minute, s.max)
  if (s.max === 16) {
    console.log(`The answer is: ${id * s.minute}`)
  }
})
