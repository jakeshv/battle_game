import { GameModelInterface } from './GameInterface'
import { gameConfig } from '../../config/config'

export class MiniGameModel implements GameModelInterface {
  protected numHeroes: number = 0
  protected numEnemies: number = 0

  constructor() {
    this.numHeroes = gameConfig.startHeroesNumber
    this.numEnemies = gameConfig.startEnemiesNumber
  }

  getNumHeroes() {
    return this.numHeroes
  }
  getNumEnemies() {
    return this.numEnemies
  }
}