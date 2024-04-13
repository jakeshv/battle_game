import { Application } from 'pixi.js'
import { DefaultView } from './View/Template/Default'
import { KnightElementsFactory } from './View/Elements/Factory/KnightElementsFactory'

export class App {
  protected app: Application
  private view: DefaultView | null = null

  constructor() {
    this.app = new Application()
  }

  async init() {
    await this.app.init({
      resizeTo: window,
      view: document.querySelector('#game') as HTMLCanvasElement
    })

    this.view = new DefaultView(this.app, new KnightElementsFactory())
    await this.view.init()

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