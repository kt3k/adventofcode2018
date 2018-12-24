#!/usr/bin/env deno

import { readFileSync } from 'deno'

const LEFT = 0
const RIGHT = 1
const STRAIGHT = 2

class Car {
  x: number
  y: number
  dir: string
  nextTurn: number
  constructor(x, y, dir) {
    this.x = x
    this.y = y
    this.dir = dir
    this.nextTurn = LEFT
  }

  forwardCoord() {
    if (this.dir === '>') {
      return { x: this.x + 1, y: this.y }
    } else if (this.dir === '<') {
      return { x: this.x - 1, y: this.y }
    } else if (this.dir === 'v') {
      return { x: this.x, y: this.y + 1 }
    } else {
      return { x: this.x, y: this.y - 1 }
    }
  }

  turnRight () {
    if (this.dir === '>') {
      this.dir = 'v'
    } else if (this.dir === '<') {
      this.dir = '^'
    } else if (this.dir === '^') {
      this.dir = '>'
    } else if (this.dir === 'v') {
      this.dir = '<'
    } else {
      throw new Error('Something is broken')
    }
  }

  turnLeft () {
    if (this.dir === '>') {
      this.dir = '^'
    } else if (this.dir === '<') {
      this.dir = 'v'
    } else if (this.dir === '^') {
      this.dir = '<'
    } else if (this.dir === 'v') {
      this.dir = '>'
    } else {
      throw new Error('Something is broken')
    }
  }

  turn () {
    if (this.nextTurn === LEFT) {
      this.turnLeft()
      this.nextTurn = STRAIGHT
    } else if (this.nextTurn === STRAIGHT) {
      this.nextTurn = RIGHT
    } else if (this.nextTurn === RIGHT) {
      this.turnRight()
      this.nextTurn = LEFT
    }
  }

  step(routes) {
    const { x, y } = this.forwardCoord()
    console.log(y, x)
    const p = routes[y][x]
    this.x = x
    this.y = y
    if (p === '|' || p === '-') {
    } else if (p === '/') {
      if (this.dir === '>' || this.dir === '<') {
        this.turnLeft()
      } else if (this.dir === '^' || this.dir === 'v') {
        this.turnRight()
      } else {
        throw new Error('Something is broken')
      }
    } else if (p === '\\') {
      if (this.dir === '>' || this.dir === '<') {
        this.turnRight()
      } else if (this.dir === '^' || this.dir === 'v') {
        this.turnLeft()
      } else {
        console.log(this.dir)
        throw new Error('Something is broken')
      }
    } else if (p === '+') {
      this.turn()
    } else {
      throw new Error('Something is broken')
    }
  }
}

const collision = (cars) => {
  const map = {}
  cars.forEach(car => {
    const key = `${car.x},${car.y}`
    map[key] = map[key] || []
    map[key].push(car)
  })

  return Object.keys(map).some(key => {
    const collision = map[key].length > 1
    if (collision) {
      console.log(`The answer is: ${key}`)
    }

    return collision
  })
}

const main = () => {
  const inputs = new TextDecoder().decode(readFileSync('/dev/stdin')).trim().split('\n')
  const width = Math.max(...inputs.map(x => x.length))
  const height = inputs.length
  const routes = []
  const cars = []
  for (let i = 0; i < height; i++) {
    const row = inputs[i].split('')
    const routeRow = []
    for (let j = 0; j < width; j++) {
      const p = row[j] || ' '
      if ('><'.includes(p)) {
        cars.push(new Car(j, i, p))
        routeRow.push('-')
      } else if ('v^'.includes(p)) {
        cars.push(new Car(j, i, p))
        routeRow.push('|')
      } else {
        routeRow.push(p)
      }
    }
    routes.push(routeRow)
  }

  routes.forEach(r => console.log(r.join('')))
  while (!collision(cars)) {
    cars.forEach(car => car.step(routes))
  }
}

main()
