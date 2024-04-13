import { Coordinates } from '../../Common/Types'

const ELEMENTS_DISTANCE_X = 35
const ELEMENTS_DISTANCE_Y = 25
const MIN_ELEMENTS_PER_LINE = 2

export class DefaultDistributionModel {
  protected borderLeft: number
  protected borderRight: number

  constructor(borderLeft: number, borderRight: number) {
    this.borderLeft = borderLeft
    this.borderRight = borderRight
  }

  distributeByCenter(elementsNumber: number, centerX: number, startY: number): Coordinates[] {
    const result = []

    if (centerX < this.borderLeft) {
      centerX = this.borderLeft
    }
    if (centerX > this.borderRight) {
      centerX = this.borderRight
    }

    let count = 0
    let numLine = 0
    let numLineElements = MIN_ELEMENTS_PER_LINE

    let defence = 0

    while (count < elementsNumber) {
      defence++
      if (defence > 1000) throw new Error()
      debugger

      let lastCount = count
      let startX = centerX - (ELEMENTS_DISTANCE_X * (numLineElements - 1)) / 2

      for (let i = 0; i < numLineElements; i++) {
        let x = startX + ELEMENTS_DISTANCE_X * i

        if (x > this.borderRight || x < this.borderLeft) {
          continue
        }

        let y = startY + ELEMENTS_DISTANCE_Y * numLine
        result.push({ x, y })
        count++
      }

      let rest = elementsNumber - count
      if (rest > lastCount) {
        if (rest > count) {
          numLineElements++
        }
      } else {
        if (numLineElements > MIN_ELEMENTS_PER_LINE) numLineElements--
      }
      numLineElements = Math.min(numLineElements, rest)

      numLine++
    }

    return result
  }
}