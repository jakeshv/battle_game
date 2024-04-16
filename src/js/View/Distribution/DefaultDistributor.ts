import { Coordinates } from '../../Common/Types'
import { DistributorInterface } from './DistributorInterface'
import { viewConfig } from '../../../config/config'

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
      let startX = - viewConfig.charactersDistanceX * (numLineElements - 1) / 2

      for (let i = 0; i < numLineElements; i++) {
        let x = startX + viewConfig.charactersDistanceX * i

        if (this.checkBorders(x)) {
          continue
        }

        let y = viewConfig.charactersDistanceY * numLine
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