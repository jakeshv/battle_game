import { Application } from 'pixi.js'
import { DefaultView } from './View/Template/Default'
import { KnightElementsFactory } from './View/Elements/Factory/KnightElementsFactory'
import { DefaultPresenter } from './Presenter/Default'
import { MiniGameModel } from './Model/MiniGame'

export class App {
  protected app: Application

  constructor() {
    this.app = new Application()
  }

  async init() {
    await this.app.init({
      resizeTo: window,
      view: document.querySelector('#game') as HTMLCanvasElement
    })

    const view = new DefaultView(this.app, new KnightElementsFactory())
    const model = new MiniGameModel()

    const presenter = new DefaultPresenter(view, model)
    await presenter.start()

    //await this.testStart()
  }

  async testStart() {

    /**
     * await Assets.load('https://pixijs.com/assets/spritesheet/fighter.json')
     *
     *   const frames = []
     *
     *   for (let i = 0; i < 30; i++) {
     * const val = i < 10 ? `0${i}` : i
     *
     * frames.push(Texture.from(`rollSequence00${val}.png`))
     *   }
     *
     *   const anim = new AnimatedSprite(frames)
     *
     *   anim.x = app.screen.width / 2
     *   anim.y = app.screen.height / 2
     *   anim.anchor.set(0.5)
     *   anim.animationSpeed = 0.5
     *   anim.play()
     *
     *   app.stage.addChild(anim)
     */
  }
}