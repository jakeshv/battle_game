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
  }
}