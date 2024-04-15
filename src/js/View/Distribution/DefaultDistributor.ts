import { Coordinates } from '../../Common/Types'
import { DistributorInterface } from './DistributorInterface'

const ELEMENTS_DISTANCE_X = 25
const ELEMENTS_DISTANCE_Y = 15
const MIN_ELEMENTS_PER_LINE = 4

export class DefaultDistributor implements DistributorInterface {
  borderLeft: number | null = null
  borderRight: number | null = null

  setBorderLeft(borderLeft: number | null = null) {
    if (borderLeft !== null && borderLeft > 0) borderLeft = 0
    this.borderLeft = borderLeft
  }

  setBorderRight(borderRight: number | null = null) {
    if (borderRight !== null && borderRight < 0) borderRight = 0
    this.borderRight = borderRight
  }

  distributeByNumber(elementsNumber: number): Coordinates[] {
    const result = []

    let count = 0
    let numLine = 0
    let numLineElements = MIN_ELEMENTS_PER_LINE

    while (count < elementsNumber) {
      let lastCount = count
      let startX = - ELEMENTS_DISTANCE_X * (numLineElements - 1) / 2

      for (let i = 0; i < numLineElements; i++) {
        let randomShift = (Math.random() - 0.5) * ELEMENTS_DISTANCE_X / 10

        let x = startX + ELEMENTS_DISTANCE_X * i + randomShift

        if (this.checkBorders(x)) {
          continue
        }

        let y = ELEMENTS_DISTANCE_Y * numLine + randomShift
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

  checkBorders(x: number): boolean {
    if (this.borderLeft !== null && x < this.borderLeft) {
      return true
    }
    return this.borderRight !== null && x > this.borderRight;
  }
}