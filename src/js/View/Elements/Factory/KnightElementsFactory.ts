import { ElementsFactoryInterface } from './ElementsFactoryInterface'
import { Knight } from '../Heroes/Knight'
import { CharacterTextures } from '../Heroes/AbstractCharacter'
import { EnemyKnight } from '../Heroes/EnemyKnight'

export class KnightElementsFactory implements ElementsFactoryInterface {
  heroTextures: CharacterTextures = {
    run: [],
    attack: [],
    idle: [],
    death: [],
    run_left: [],
    run_right: []
  }

  enemyTextures: CharacterTextures = {
    run: [],
    attack: [],
    idle: [],
    death: [],
    run_left: [],
    run_right: []
  }

  createHero(): Knight {
    return new Knight(this.heroTextures)
  }

  createEnemy(): EnemyKnight {
    return new EnemyKnight(this.enemyTextures)
  }

  async loadTextures() {
    this.heroTextures = await Knight.loadTextures()
    this.enemyTextures = await EnemyKnight.loadTextures()
  }
}