export interface GameModelInterface {
  getLeftMultiValue(): number

  getRightMultiValue(): number

  getNumHeroes(): number

  getNumEnemies(): number

  fight(): [number, number]

  setStartData(): void

  enterLeftGate(): void

  enterRightGate(): void

  isWin(): boolean
}