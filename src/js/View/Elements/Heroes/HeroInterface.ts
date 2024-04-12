import { AnimatedSprite } from 'pixi.js'

export interface HeroInterface {
  getSprite(x: number, y: number): AnimatedSprite

  attack(): void
}