import { HeroInterface } from '../Heroes/HeroInterface'

export interface ElementsFactoryInterface {
  createHero(): HeroInterface
  loadTextures(): void
}