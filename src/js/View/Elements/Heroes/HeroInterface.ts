import { AnimatedSprite } from 'pixi.js'

export type HeroState = 'run' | 'run_left' | 'run_right'

export interface HeroInterface {
  getSprite(): AnimatedSprite

  setCoordinates(x: number, y: number): void

  attack(): void

  runLeft(): void

  runRight(): void

  run(): void
}