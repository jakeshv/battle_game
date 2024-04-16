export interface PresenterInterface {
  start(): void

  fight(): void

  endFight(): void

  startNewGame(): void

  enterLeftGate(): void

  enterRightGate(): void

  endGame(): void
}