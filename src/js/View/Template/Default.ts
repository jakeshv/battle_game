import { Application, Assets, FederatedPointerEvent, Sprite, Text } from 'pixi.js'
import { ElementsFactoryInterface } from '../Elements/Factory/ElementsFactoryInterface'
import { HeroInterface } from '../Elements/Heroes/HeroInterface'
import { DefaultDistributionModel } from '../../Model/Distribution/DefaultDistribution'

const BASE_IMAGE_PATH = 'assets/images/background/'

export class DefaultView {
  protected app: Application
  protected elementsFactory: ElementsFactoryInterface
  protected heroes: HeroInterface[]
  protected heroText: Text

  protected readonly width: number
  protected readonly borderLeft: number
  protected readonly borderRight: number

  public directionX: number = 0
  public centerX: number
  public centerY: number

  constructor(app: Application, elementsFactory: ElementsFactoryInterface) {
    this.app = app
    //this.app.stage.eventMode = 'static'
    //this.app.stage.hitArea = this.app.screen

    this.width = this.app.screen.width / 3
    this.borderLeft = this.app.screen.width / 2 - 150
    this.borderRight = this.app.screen.width / 2 + 150
    this.centerX = this.app.screen.width / 2
    this.centerY = this.app.screen.height - 500

    this.elementsFactory = elementsFactory
    this.heroes = []
    this.heroText = new Text()
  }

  async init() {
    await this.createBackground()
    await this.loadTextures()
    await this.loadFonts()

    await this.createHeroes()

    this.app.stage
      .on('pointerdown', this.onViewClick.bind(this))
      //.on('pointerup', pointerUp)
      .on('pointermove', this.pointerMove.bind(this))

    const speedX = 2

    this.app.ticker.add(() => {
      if (this.directionX > this.centerX + 50) {
        this.centerX += speedX
        this.heroes.forEach((hero) => {
            hero.runRight()
        })
      } else if (this.directionX < this.centerX - 50) {
        this.centerX -= speedX
        this.heroes.forEach((hero) => {
          hero.runLeft()
        })
      } else {
        this.heroes.forEach((hero) => {
          hero.run()
        })
      }
      this.updateHeroes()
    })
  }

  async loadTextures() {
    await this.elementsFactory.loadTextures()
  }

  async loadFonts() {
    Assets.addBundle('fonts', [
      { alias: 'DefaultFont', src: 'assets/fonts/Marvin.otf' }
    ])
    await Assets.loadBundle('fonts')
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

  createHeroes() {
    const distribution = new DefaultDistributionModel(this.borderLeft, this.borderRight)

    const coordinates = distribution.distributeByCenter(10, this.centerX, this.centerY)

    coordinates.forEach((coordinate) => {
      const hero = this.elementsFactory.createHero()
      this.heroes.push(hero)

      hero.setCoordinates(coordinate.x, coordinate.y)
      this.app.stage.addChild(hero.getSprite())
    })

    this.heroText = new Text({
      text: this.heroes.length,
      style: {
        fontFamily: 'Default',
        fontSize: 30,
        fill: '#ffffff',
        fontWeight: 'bold'
      }
    })
    this.heroText.x = this.heroes[this.heroes.length - 1].getSprite().x
    this.heroText.y = this.heroes[this.heroes.length - 1].getSprite().y
    this.app.stage.addChild(this.heroText)
  }

  updateHeroes() {
    const distribution = new DefaultDistributionModel(this.borderLeft, this.borderRight)

    const coordinates = distribution.distributeByCenter(this.heroes.length, this.centerX, this.centerY)

    this.heroes.forEach((hero, index) => {
      hero.setCoordinates(coordinates[index].x, coordinates[index].y)
    })

    this.heroText.text = coordinates.length
    this.heroText.x = this.heroes[this.heroes.length - 1].getSprite().x
    this.heroText.y = this.heroes[this.heroes.length - 1].getSprite().y + 50
  }

  onViewClick() {
    const distribution = new DefaultDistributionModel(this.borderLeft, this.borderRight)

    const hero = this.elementsFactory.createHero()
    this.heroes.push(hero)
    this.app.stage.addChild(hero.getSprite())

    const coordinates = distribution.distributeByCenter(this.heroes.length, this.centerX, this.centerY)

    this.heroes.forEach((hero, index) => {
      hero.setCoordinates(coordinates[index].x, coordinates[index].y)
      //hero.attack()
    })
  }

  pointerMove(event: FederatedPointerEvent) {
    let x = event.globalX
    this.directionX = x
    this.heroes.forEach((hero) => {
      if (x < this.app.screen.width / 2 - 100) {
        hero.runLeft()
      } else if (x > this.app.screen.width / 2 + 100) {
        hero.runRight()
      } else {
        hero.run()
      }
    })
  }
}