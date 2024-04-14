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

    this.view.updateHeroes(this.model.getNumHeroes())
    this.view.updateEnemies(this.model.getNumEnemies())
  }
}