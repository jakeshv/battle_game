import { AbstractCharacter } from '../Heroes/AbstractCharacter'

export interface ElementsFactoryInterface {
  createHero(): AbstractCharacter

  createEnemy(): AbstractCharacter

  loadTextures(): void
}