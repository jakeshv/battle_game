export interface CharacterInterface {
  attack(): void

  idle(): void

  death(deathCallback: () => void): void

  runLeft(): void

  runRight(): void

  run(): void
}