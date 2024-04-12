import { ElementsFactoryInterface } from './ElementsFactoryInterface'
import { Knight, KnightTextures } from '../Heroes/Knight'

export class KnightElementsFactory implements ElementsFactoryInterface {
  heroTextures: KnightTextures = {
    run: [],
    attack: [],
    run_left: [],
    run_right: []
  }

  createHero(): Knight {
    return new Knight(this.heroTextures)
  }

  async loadTextures() {
    this.heroTextures = await Knight.loadTextures()
  }
}