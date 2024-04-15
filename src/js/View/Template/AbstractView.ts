import { Application } from 'pixi.js'
import { ElementsFactoryInterface } from '../Elements/Factory/ElementsFactoryInterface'
import { PresenterInterface } from '../../Presenter/PresenterInterface'
import { AbstractCharacterContainer } from '../Elements/Heroes/AbstractCharacterContainer'

export type MoveState = 'strait' | 'right' | 'left'

export abstract class AbstractView {
  protected app: Application
  protected elementsFactory: ElementsFactoryInterface
  protected presenter: PresenterInterface | null = null
  protected abstract heroesContainer: AbstractCharacterContainer
  protected abstract enemiesContainer: AbstractCharacterContainer
  
  protected constructor(app: Application, elementsFactory: ElementsFactoryInterface) {
    this.app = app
    //@ts-ignore
    this.app.stage.eventMode = 'static'
    //@ts-ignore
    this.app.stage.hitArea = this.app.screen

    this.elementsFactory = elementsFactory
  }

  async init(presenter: PresenterInterface): Promise<void> {
  }

  updateHeroes(num: number): void {
    this.heroesContainer.setTargetNumCharacters(num)
  }

  updateEnemies(num: number): void {
    this.enemiesContainer.setTargetNumCharacters(num)
  }

  abstract updateGate(left: number, right: number) : void

  abstract start(): void
}