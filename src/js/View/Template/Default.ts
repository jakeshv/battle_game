import { Application, Assets, Sprite } from 'pixi.js'
import { ElementsFactoryInterface } from '../Elements/Factory/ElementsFactoryInterface'
import { HeroInterface } from '../Elements/Heroes/HeroInterface'

export class DefaultView {
  private app: Application
  private elementsFactory: ElementsFactoryInterface
  private heroes: HeroInterface[]

  constructor(app: Application, elementsFactory: ElementsFactoryInterface) {
    this.app = app
    //this.app.stage.eventMode = 'static'
    //this.app.stage.hitArea = this.app.screen

    this.elementsFactory = elementsFactory
    this.heroes = []
  }

  async init() {
    await this.createBackground()
    await this.elementsFactory.loadTextures()

    await this.createHeroes()

    this.app.stage
      .on('pointerdown', this.onViewClick.bind(this))
      //.on('pointerup', pointerUp)
      .on('pointermove', this.pointerMove.bind(this))
  }

  async createBackground() {
    const red_castle_back_texture = await Assets.load('assets/images/background/red_castle_back.png')
    const red_castle_back = new Sprite(red_castle_back_texture)
    red_castle_back.anchor.set(0.5, 0)
    red_castle_back.width = this.app.screen.width / 3
    red_castle_back.height = this.app.screen.height / 2
    red_castle_back.x = this.app.screen.width / 2
    red_castle_back.y = 0
    this.app.stage.addChild(red_castle_back)

    const castle_back_texture = await Assets.load('assets/images/background/simple_back.png')
    const castle_back = new Sprite(castle_back_texture)
    castle_back.anchor.set(0.5, 1)
    castle_back.width = this.app.screen.width / 3
    castle_back.height = this.app.screen.height / 2
    castle_back.x = this.app.screen.width / 2
    castle_back.y = this.app.screen.height
    this.app.stage.addChild(castle_back)
  }

  createHeroes() {
    for (let j = 0; j < 5; j++) {
      for (let i = 0; i <= 10; i++) {
        const hero = this.elementsFactory.createHero()
        this.heroes.push(hero)
        const sprite = hero.getSprite(600 + i * 50, 600 + j * 60)
        this.app.stage.addChild(sprite)
      }
    }
  }

  onViewClick() {
    this.heroes.forEach((hero) => {
      hero.attack()
    })
  }

  pointerMove() {
    this.heroes.forEach((hero) => {
      hero.attack()
    })
  }
}