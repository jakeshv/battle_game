import { PresenterInterface } from './PresenterInterface'
import { AbstractView } from '../View/Template/AbstractView'
import { GameModelInterface } from '../Model/GameInterface'

export class DefaultPresenter implements PresenterInterface {
  private view: AbstractView
  private model: GameModelInterface

  constructor(view: AbstractView, model: GameModelInterface) {
    this.view = view
    this.model = model
  }

  async start() {
    await this.view.init(this)

    this.startNewGame()
  }

  fight() {
    const [numHeroes, numEnemies] = this.model.getFightResult()
    this.view.updateHeroes(numHeroes)
    this.view.updateEnemies(numEnemies)
  }

  endFight() {
    this.startNewGame()
  }

  startNewGame() {
    this.model.setStartData()
    this.view.updateGate(this.model.getLeftMultiValue(),this.model.getRightMultiValue())
    this.view.updateHeroes(this.model.getNumHeroes())
    this.view.updateEnemies(this.model.getNumEnemies())
    this.view.start()
  }

  enterLeftGate() {
    this.model.enterLeftGate()
    this.view.updateHeroes(this.model.getNumHeroes())
  }

  enterRightGate() {
    this.model.enterRightGate()
    this.view.updateHeroes(this.model.getNumHeroes())
  }
}