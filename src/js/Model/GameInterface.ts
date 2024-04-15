export interface GameModelInterface {
  getLeftMultiValue(): number

  getRightMultiValue(): number

  getNumHeroes(): number

  getNumEnemies(): number

  getFightResult(): [number, number]

  setStartData(): void

  enterLeftGate(): void

  enterRightGate(): void
}