import { Application, Container } from 'pixi.js'
import { ElementsFactoryInterface } from '../Elements/Factory/ElementsFactoryInterface'
import { PresenterInterface } from '../../Presenter/PresenterInterface'
import { AbstractCharacter } from '../Elements/Heroes/AbstractCharacter'

export type MoveState = 'strait' | 'right' | 'left'

export class AbstractView {
  protected app: Application
  protected elementsFactory: ElementsFactoryInterface
  protected heroes: AbstractCharacter[]
  protected enemies: AbstractCharacter[]
  protected presenter: PresenterInterface | null = null
  protected heroesContainer: Container<any>
  protected enemiesContainer: Container<any>
  
  constructor(app: Application, elementsFactory: ElementsFactoryInterface) {
    this.app = app
    this.app.stage.eventMode = 'static'
    this.app.stage.hitArea = this.app.screen

    this.elementsFactory = elementsFactory

    this.heroes = []
    this.enemies = []

    this.heroesContainer = new Container()
    this.enemiesContainer = new Container()
  }

  async init(presenter: PresenterInterface): Promise<void> {
  }

  updateHeroes(num: number): void {
  }

  updateEnemies(num: number): void {
  }

  switchMoveAnimation(characters: AbstractCharacter[], state: MoveState) {
    characters.forEach((character) => {
      switch (state) {
        case 'strait':
          character.run()
          break
        case 'left':
          character.runLeft()
          break
        case 'right':
          character.runRight()
          break
      }
    })
  }
}