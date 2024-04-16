import { Application, Assets, FederatedPointerEvent, Sprite, Text } from 'pixi.js'
import { ElementsFactoryInterface } from '../Elements/Factory/ElementsFactoryInterface'
import { DefaultDistributor } from '../Distribution/DefaultDistributor'
import { AbstractView, MoveState } from './AbstractView'
import { PresenterInterface } from '../../Presenter/PresenterInterface'
import { Coordinates } from '../../Common/Types'
import { HeroContainer } from '../Elements/Heroes/HeroContainer'
import { EnemyContainer } from '../Elements/Heroes/EnemyContainer'
import { AbstractCharacterContainer } from '../Elements/Heroes/AbstractCharacterContainer'
import { DefaultGate } from '../Elements/Gates/DefaultGate'
import { ANCHOR_CENTER } from '../../Common/Constants'
import { AbstractWindow } from '../Window/AbstractWindow'
import { VictoryWindow } from '../Window/VictoryWindow'
import { viewConfig } from '../../../config/config'
import { DefeatWindow } from '../Window/DefeatWindow'

const BASE_IMAGE_PATH = 'assets/images/background/'

const HEROES_SPEED = 3
const FONT_SIZE = 42
const FONT_COLOR = '#36eacf'

export class DefaultView extends AbstractView {
  protected readonly width: number
  protected readonly borderLeft: number
  protected readonly borderRight: number
  protected readonly centerX: number

  protected enemiesContainer: AbstractCharacterContainer
  protected heroesContainer: AbstractCharacterContainer
  protected victoryWindow: AbstractWindow
  protected defeatWindow: AbstractWindow

  protected directionX: number
  protected startHeroesY: number
  protected startEnemiesY: number
  protected gateY: number
  protected castleY: number = 0

  protected fightDirection: Coordinates | null = null
  protected isFight: boolean = false
  protected isGameOver: boolean = false
  protected gate: DefaultGate

  constructor(app: Application, elementsFactory: ElementsFactoryInterface) {
    super(app, elementsFactory)

    this.heroesContainer = new HeroContainer(app, new DefaultDistributor(), elementsFactory)
    this.enemiesContainer = new EnemyContainer(app, new DefaultDistributor(), elementsFactory)

    this.width = this.app.screen.width / 3
    this.borderLeft = this.app.screen.width / 2 - this.width / 4
    this.borderRight = this.app.screen.width / 2 + this.width / 4
    this.centerX = this.app.screen.width / 2
    this.directionX = this.centerX
    this.gateY = this.app.screen.height * 0.6

    this.heroesContainer.setBorderRight(this.borderRight)
    this.heroesContainer.setBorderLeft(this.borderLeft)

    this.startHeroesY = this.app.screen.height * 0.9
    this.startEnemiesY = this.app.screen.height / 4

    this.gate = new DefaultGate(this.borderRight - this.borderLeft)
    this.victoryWindow = new VictoryWindow(this.width, this.app.screen.height)
    this.defeatWindow = new DefeatWindow(this.width, this.app.screen.height)
  }

  async init(presenter: PresenterInterface): Promise<void> {
    this.presenter = presenter

    await this.createBackground()
    await this.loadTextures()
    await this.loadFonts()
    await this.victoryWindow.init()
    await this.defeatWindow.init()
    await this.heroesContainer.init()

    this.app.stage.addChild(this.enemiesContainer.getContainer())
    this.app.stage.addChild(this.heroesContainer.getContainer())

    this.heroesContainer.createCharacterText(this.createCharacterText())
    this.enemiesContainer.createCharacterText(this.createCharacterText())

    this.app.stage.addChild(this.gate.getContainer())
    this.gate.getContainer().x = this.borderLeft
    this.gate.getContainer().y = this.gateY

    this.app.stage.addChild(this.victoryWindow.getContainer())
    this.victoryWindow.getContainer().x = this.centerX - this.width / 2
    this.victoryWindow.onLeftButtonClick(() => {
      this.presenter?.startNewGame()
    })

    this.app.stage.addChild(this.defeatWindow.getContainer())
    this.defeatWindow.getContainer().x = this.centerX - this.width / 2
    this.defeatWindow.onLeftButtonClick(() => {
      this.presenter?.startNewGame()
    })
    this.defeatWindow.onRightButtonClick(() => {
      this.presenter?.startNewGame()
    })

    this.start()

    this.app.stage.on('pointermove', this.pointerMove.bind(this))

    this.app.ticker.add(() => {
      this.moveHeroes()
      this.moveEnemies()
      this.checkStatusHeroes()
    })
  }

  updateGate(left: number, right: number) {
    if (this.gate) {
      this.gate.updateText(left, right)
    }
  }

  start() {
    this.isGameOver = false

    this.heroesContainer.reset()
    this.heroesContainer.getContainer().x = this.centerX
    this.heroesContainer.getContainer().y = this.startHeroesY

    this.enemiesContainer.reset()
    this.enemiesContainer.getContainer().x = this.centerX
    this.enemiesContainer.getContainer().y = this.startEnemiesY

    this.gate.reset()
  }

  async loadTextures() {
    await this.elementsFactory.loadTextures()
  }

  async loadFonts() {
    Assets.addBundle('fonts', [
      { alias: viewConfig.fontFamily, src: viewConfig.fontSrc }
    ])
    await Assets.loadBundle('fonts')
  }

  createCharacterText(): Text {
    return new Text({
      text: '',
      style: {
        fontFamily: viewConfig.fontFamily,
        fontSize: FONT_SIZE,
        fill: FONT_COLOR,
        fontWeight: 'bold'
      }
    })
  }

  async createBackground() {
    const red_castle_back_texture = await Assets.load(BASE_IMAGE_PATH + 'red_castle_back.png')
    const castle_back_texture = await Assets.load(BASE_IMAGE_PATH + 'simple_back.png')

    const red_castle_back = new Sprite(red_castle_back_texture)
    red_castle_back.anchor.set(ANCHOR_CENTER, 0.3)
    red_castle_back.width = this.width
    red_castle_back.height = this.app.screen.height
    red_castle_back.x = this.centerX
    red_castle_back.y = 0
    this.app.stage.addChild(red_castle_back)

    const castle_back = new Sprite(castle_back_texture)
    castle_back.anchor.set(ANCHOR_CENTER, 0)
    castle_back.width = this.width
    castle_back.height = this.app.screen.height
    castle_back.x = this.centerX
    castle_back.y = this.app.screen.height * 0.7
    this.app.stage.addChild(castle_back)

    this.castleY = this.app.screen.height * 0.2
  }

  pointerMove(event: FederatedPointerEvent) {
    this.directionX = event.globalX
  }

  moveHeroes() {
    if (!this.heroesContainer.isMovable()) return
    if (this.fightDirection) {
      this.moveToFight(this.heroesContainer)
    } else {
      let state: MoveState = 'strait'
      const straitZone = this.heroesContainer.getContainer().width / 2
      if (this.directionX > this.heroesContainer.getContainer().x + straitZone / 2) {
        this.heroesContainer.getContainer().x += HEROES_SPEED
        state = 'right'
      } else if (this.directionX < this.heroesContainer.getContainer().x - straitZone / 2) {
        this.heroesContainer.getContainer().x -= HEROES_SPEED
        state = 'left'
      }
      this.heroesContainer.switchMoveAnimation(state)

      if (this.heroesContainer.getContainer().x > this.borderRight) {
        this.heroesContainer.getContainer().x = this.borderRight
      } else if (this.heroesContainer.getContainer().x < this.borderLeft) {
        this.heroesContainer.getContainer().x = this.borderLeft
      }
      this.heroesContainer.getContainer().y -= HEROES_SPEED
    }
  }

  moveEnemies() {
    if (!this.enemiesContainer.isMovable()) return
    if (this.fightDirection) {
      this.moveToFight(this.enemiesContainer)
    }
  }

  moveToFight(charactersContainer: AbstractCharacterContainer) {
    if (this.fightDirection) {
      let state: MoveState = 'strait'
      if (this.fightDirection.x > charactersContainer.getContainer().x + HEROES_SPEED) {
        charactersContainer.getContainer().x += HEROES_SPEED
        state = 'right'
      } else if (this.fightDirection.x < charactersContainer.getContainer().x - HEROES_SPEED) {
        charactersContainer.getContainer().x -= HEROES_SPEED
        state = 'left'
      }
      if (this.fightDirection.y > charactersContainer.getContainer().y + HEROES_SPEED) {
        charactersContainer.getContainer().y += HEROES_SPEED
      } else if (this.fightDirection.y < charactersContainer.getContainer().y - HEROES_SPEED) {
        charactersContainer.getContainer().y -= HEROES_SPEED
      }
      if (!this.isFight) {
        charactersContainer.switchMoveAnimation(state)
      }
    }
  }

  setFightDirection() {
    this.fightDirection = {
      x: (this.heroesContainer.getContainer().x + this.enemiesContainer.getContainer().x) / 2,
      y: (this.heroesContainer.getContainer().y + this.enemiesContainer.getContainer().y) / 2
    }
  }

  checkFightConditions() {
    if (this.heroesContainer.isMovable() && this.enemiesContainer.isMovable()) {
      if (this.fightDirection) {
        const diffX = Math.abs(this.heroesContainer.getContainer().x - this.enemiesContainer.getContainer().x)
        const diffY = Math.abs(this.heroesContainer.getContainer().y - this.enemiesContainer.getContainer().y)
        const errorFactor = 3 // определяется логикой сближения
        if (diffX < HEROES_SPEED * errorFactor && diffY < HEROES_SPEED * errorFactor) {
          this.startFight()
        }
      } else if (this.heroesContainer.getContainer().y < this.enemiesContainer.getContainer().y + this.enemiesContainer.getContainer().height) {
        this.setFightDirection()
      }
    }
    if (this.isFight) {
      if (!this.heroesContainer.hasCharactersToDeath() && !this.enemiesContainer.hasCharactersToDeath()) {
        this.stopFight()
      }
    }
  }

  checkStatusHeroes() {
    if (this.isGameOver) return
    this.checkFightConditions()
    if (this.heroesContainer.isMovable() && this.presenter && !this.gate.isActivated()) {
      if (this.heroesContainer.getContainer().y < this.gate.getContainer().y) {
        if (this.heroesContainer.getContainer().x < this.centerX) {
          this.gate.activateLeft()
          this.presenter.enterLeftGate()
        } else {
          this.gate.activateRight()
          this.presenter.enterRightGate()
        }
      }
    }
    if (this.heroesContainer.getContainer().y < this.castleY) {
      this.endGame()
    }
  }

  endGame() {
    this.isGameOver = true
    this.heroesContainer.stop()
    if (this.presenter) {
      this.presenter.endGame()
    }
  }

  startFight() {
    this.isFight = true

    this.heroesContainer.startFight()
    this.enemiesContainer.startFight()

    if (this.presenter) {
      this.presenter.fight()
    }
  }

  stopFight() {
    this.isFight = false
    this.fightDirection = null

    this.heroesContainer.stopFight()
    this.enemiesContainer.stopFight()

    if (this.presenter) {
      this.presenter.endFight()
    }
  }

  showVictoryWindow() {
    this.victoryWindow.show()
  }

  showDefeatWindow() {
    this.defeatWindow.show()
  }
}