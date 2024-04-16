import { Assets } from 'pixi.js'
import { AbstractButton, BASE_BUTTONS_PATH } from './AbstractButton'

export class RedButton extends AbstractButton {
  async loadUpTextures() {
    return Assets.load(BASE_BUTTONS_PATH + 'red_up.png')
  }

  async loadDownTextures() {
    return Assets.load(BASE_BUTTONS_PATH + 'red_down.png')
  }
}