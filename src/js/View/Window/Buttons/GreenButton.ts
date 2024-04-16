import { Assets } from 'pixi.js'
import { AbstractButton, BASE_BUTTONS_PATH } from './AbstractButton'

export class GreenButton extends AbstractButton {
  async loadUpTextures() {
    return Assets.load(BASE_BUTTONS_PATH + 'green_up.png')
  }

  async loadDownTextures() {
    return Assets.load(BASE_BUTTONS_PATH + 'green_down.png')
  }
}