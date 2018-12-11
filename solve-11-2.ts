#!/usr/bin/env deno

const SERIAL = 5177
// const SERIAL = 8

const MAX = 300;

const main = () => {
  const rows = []

  for (let i = 1; i <= MAX; i++) {
    const row = []

    for (let j = 1; j <= MAX;  j++) {
      const rackId = j + 10
      const power = Math.floor((rackId * i + SERIAL) * rackId % 1000 / 100) - 5
      row.push(power)
    }

    rows.push(row)
  }

  console.log(rows[0])

  let max = 0

  for (let m = 1; m <= MAX; m++) {
    for (let i = 0; i <= MAX - m; i++) {
      for (let j = 0; j <= MAX - m; j++) {
        let v = 0
        for (let x = 0; x < m; x++) {
          for (let y = 0; y < m; y++) {
            v += rows[j+x][i+y]
          }
        }
        if (v >= max) {
          max = v
          console.log(`${i+1},${j+1},${m}=${v}`)
        }
      }
    }
  }
}

main()
