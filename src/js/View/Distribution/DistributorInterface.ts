import { Coordinates } from '../../Common/Types'

export interface DistributorInterface {
  borderLeft: number | null
  borderRight: number | null

  setBorderLeft(borderLeft: number | null): void

  setBorderRight(borderRight: number | null): void

  distributeByNumber(elementsNumber: number): Coordinates[]
}