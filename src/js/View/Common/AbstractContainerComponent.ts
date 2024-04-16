import { Container } from 'pixi.js'

export abstract class AbstractContainerComponent {
  protected container: Container<any> = new Container()

  getContainer() {
    return this.container
  }
}