import { Application, Assets, Container, FederatedPointerEvent, Sprite, Text } from 'pixi.js'
import { ElementsFactoryInterface } from '../Elements/Factory/ElementsFactoryInterface'
import { DefaultDistributor } from '../Distribution/DefaultDistributor'
import { AbstractView, MoveState } from './AbstractView'
import { PresenterInterface } from '../../Presenter/PresenterInterface'
import { DistributorInterface } from '../Distribution/DistributorInterface'
import { AbstractCharacter } from '../Elements/Heroes/AbstractCharacter'
import { Coordinates } from '../../Common/Types'

const BASE_IMAGE_PATH = 'assets/images/background/'
const FONT_SRC = 'assets/fonts/Marvin.otf'

const HEROES_SPEED = 2
const FONT_NAME = 'DefaultFont'
const FONT_SIZE = 32
const FONT_COLOR = '#12de90'

export class DefaultView extends AbstractView {
  protected heroText: Text
  protected enemyText: Text

  protected readonly width: number
  protected readonly borderLeft: number
  protected readonly borderRight: number
  protected readonly centerX: number

  protected heroDistributor: DistributorInterface
  protected enemyDistributor: DistributorInterface

  protected directionX: number
  protected startHeroesY: number
  protected startEnemiesY: number

  protected fightDirection: Coordinates | null = null

  constructor(app: Application, elementsFactory: ElementsFactoryInterface) {
    super(app, elementsFactory)

    this.heroDistributor = new DefaultDistributor()
    this.enemyDistributor = new DefaultDistributor()

    this.width = this.app.screen.width / 3
    this.borderLeft = this.app.screen.width / 2 - 150
    this.borderRight = this.app.screen.width / 2 + 150
    this.centerX = this.app.screen.width / 2
    this.directionX = this.centerX

    this.startHeroesY = this.app.screen.height - 200
    this.startEnemiesY = 300

    this.heroText = new Text()
    this.enemyText = new Text()
  }

  async init(presenter: PresenterInterface): Promise<void> {
    this.presenter = presenter

    await this.createBackground()
    await this.loadTextures()
    await this.loadFonts()

    this.app.stage.addChild(this.heroesContainer)
    this.app.stage.addChild(this.enemiesContainer)

    this.createHeroText()
    this.createEnemyText()

    this.start()

    this.app.stage
      .on('pointerdown', this.onViewClick.bind(this))
      //.on('pointerup', pointerUp)
      .on('pointermove', this.pointerMove.bind(this))

    let time = 0

    this.app.ticker.add((ticker) => {
      this.moveHeroes()
      this.moveEnemies()

      this.updateHeroesText()
      this.updateEnemyText()

      time += ticker.deltaTime

      if (time > 10) {
        this.updateHeroes(this.heroes.length)
        time = 0
      }
    })
  }

  start() {
    this.heroesContainer.x = this.centerX
    this.heroesContainer.y = this.startHeroesY

    this.enemiesContainer.x = this.centerX
    this.enemiesContainer.y = this.startEnemiesY
  }

  async loadTextures() {
    await this.elementsFactory.loadTextures()
  }

  async loadFonts() {
    Assets.addBundle('fonts', [
      { alias: FONT_NAME, src: FONT_SRC }
    ])
    await Assets.loadBundle('fonts')
  }

  createHeroText() {
    this.heroText = this.createCharacterText(this.heroes.length.toString())
    this.app.stage.addChild(this.heroText)
  }

  createEnemyText() {
    this.enemyText = this.createCharacterText(this.enemies.length.toString())
    this.app.stage.addChild(this.enemyText)
  }

  createCharacterText(text: string): Text {
    return new Text({
      text: text,
      style: {
        fontFamily: FONT_NAME,
        fontSize: FONT_SIZE,
        fill: FONT_COLOR,
        fontWeight: 'bold'
      }
    })
  }

  async createBackground() {
    const red_castle_back_texture = await Assets.load(BASE_IMAGE_PATH + 'red_castle_back.png')
    const castle_back_texture = await Assets.load(BASE_IMAGE_PATH + 'simple_back.png')
    const centerX = this.app.screen.width / 2

    const red_castle_back = new Sprite(red_castle_back_texture)
    red_castle_back.anchor.set(0.5, 0)
    red_castle_back.width = this.width
    red_castle_back.height = this.app.screen.height / 2
    red_castle_back.x = centerX
    red_castle_back.y = 0
    this.app.stage.addChild(red_castle_back)

    const castle_back = new Sprite(castle_back_texture)
    castle_back.anchor.set(0.5, 1)
    castle_back.width = this.width
    castle_back.height = this.app.screen.height / 2
    castle_back.x = centerX
    castle_back.y = this.app.screen.height
    this.app.stage.addChild(castle_back)
  }

  updateHeroes(num: number): void {
    this.updateCharacters(num, this.heroes, this.heroesContainer, this.heroDistributor, 'createHero')
  }

  updateEnemies(num: number): void {
    this.updateCharacters(num, this.enemies, this.enemiesContainer, this.enemyDistributor, 'createEnemy')
  }

  updateCharacters(
    num: number,
    container: AbstractCharacter[],
    spritesContainer: Container<any>,
    distributor: DistributorInterface,
    createMethod: 'createHero' | 'createEnemy'
  ) {
    if (num > container.length) {
      const neededHeroes = num - container.length
      for (let i = 0; i < neededHeroes; i++) {
        const hero = this.elementsFactory[createMethod]()
        container.push(hero)
        spritesContainer.addChild(hero.getSprite())
      }
    }

    distributor.setBorderRight(this.borderRight - spritesContainer.x)
    distributor.setBorderLeft(this.borderLeft - spritesContainer.x)

    const coordinates = distributor.distributeByNumber(num)

    container.forEach((character, index) => {
      character.setCoordinates(coordinates[index].x, coordinates[index].y)
    })
  }

  onViewClick() {
    //this.updateHeroes(this.heroes.length + 3)
    this.startFight()
    this.heroes.forEach((hero) => {
      hero.death()
    })
  }

  pointerMove(event: FederatedPointerEvent) {
    this.directionX = event.globalX
  }

  moveHeroes() {
    let state: MoveState = 'strait'
    if (this.directionX > this.heroesContainer.x + this.heroesContainer.width / 2) {
      this.heroesContainer.x += HEROES_SPEED
      state = 'right'
    } else if (this.directionX < this.heroesContainer.x - this.heroesContainer.width / 2) {
      this.heroesContainer.x -= HEROES_SPEED
      state = 'left'
    }
    this.switchMoveAnimation(this.heroes, state)

    if (this.heroesContainer.x > this.borderRight) {
      this.heroesContainer.x = this.borderRight
    } else if (this.heroesContainer.x < this.borderLeft) {
      this.heroesContainer.x = this.borderLeft
    }
  }

  moveEnemies() {
    let state: MoveState = 'strait'
    if (this.directionX > this.heroesContainer.x + this.heroesContainer.width / 2) {
      this.enemiesContainer.x += HEROES_SPEED
      state = 'right'
    } else if (this.directionX < this.heroesContainer.x - this.heroesContainer.width / 2) {
      this.enemiesContainer.x -= HEROES_SPEED
      state = 'left'
    }
    this.switchMoveAnimation(this.enemies, state)
  }

  updateHeroesText() {
    this.heroText.text = this.heroes.length
    this.heroText.y = this.heroesContainer.y + this.heroesContainer.height / 2 - this.heroText.height
    this.heroText.x = this.heroesContainer.x - this.heroText.width / 2
  }

  updateEnemyText() {
    this.enemyText.text = this.enemies.length
    this.enemyText.y = this.enemiesContainer.y - this.enemyText.height
    this.enemyText.x = this.enemiesContainer.x - this.enemyText.width / 2
  }

  startFight() {
    this.fightDirection = {
      x: this.heroesContainer.x,
      y: this.heroesContainer.y,
    }
  }
}