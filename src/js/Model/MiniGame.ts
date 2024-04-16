import { GameModelInterface } from './GameInterface'
import { gameConfig } from '../../config/config'

export class MiniGameModel implements GameModelInterface {
  protected numHeroes: number = 0
  protected numEnemies: number = 0
  protected leftMultiValue: number = 0
  protected rightMultiValue: number = 0

  constructor() {
    this.setStartData()
  }

  getLeftMultiValue() {
    return this.leftMultiValue
  }

  getRightMultiValue() {
    return this.rightMultiValue
  }

  getNumHeroes() {
    return this.numHeroes
  }

  getNumEnemies() {
    return this.numEnemies
  }

  fight(): [number, number] {
    const heroes = Math.max(0, this.numHeroes - this.numEnemies)
    const enemies = Math.max(0, this.numEnemies - this.numHeroes)
    this.numHeroes = heroes
    this.numEnemies = enemies
    return [this.numHeroes, this.numEnemies]
  }

  setStartData() {
    this.numHeroes = gameConfig.startHeroesNumber
    this.numEnemies = gameConfig.startEnemiesNumber
    this.leftMultiValue = gameConfig.leftMultiValue
    this.rightMultiValue = gameConfig.rightMultiValue
  }

  enterLeftGate() {
    this.numHeroes *= this.leftMultiValue
  }

  enterRightGate() {
    this.numHeroes *= this.rightMultiValue
  }

  isWin() {
    return this.numHeroes > 0
  }
}