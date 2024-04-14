import { AnimatedSprite } from 'pixi.js'

export interface CharacterSpriteInterface {
  getSprite(): AnimatedSprite

  setCoordinates(x: number, y: number): void
}