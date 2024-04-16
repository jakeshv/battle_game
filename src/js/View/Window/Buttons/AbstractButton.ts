import { Sprite, Text, Texture } from 'pixi.js'
import { AbstractContainerComponent } from '../../Common/AbstractContainerComponent'
import { viewConfig } from '../../../../config/config'

export const BASE_BUTTONS_PATH = 'assets/images/window/buttons/'

const FONT_SIZE = 18
const FONT_COLOR = '#fadca9'

export abstract class AbstractButton extends AbstractContainerComponent {
  protected width: number
  protected height: number
  protected text: Text

  protected upTexture: Texture = new Texture()
  protected downTexture: Texture = new Texture()
  protected clickCallback: () => void = () => {
  }

  constructor(text: string, width: number, height: number) {
    super()
    this.width = width
    this.height = height
    this.text = new Text({
      text: text,
      style: {
        fontFamily: viewConfig.fontFamily,
        fontSize: FONT_SIZE,
        fill: FONT_COLOR
      }
    })
  }

  onClick(callback: () => void) {
    this.clickCallback = callback
  }

  abstract loadUpTextures(): Promise<Texture>

  abstract loadDownTextures(): Promise<Texture>

  async init() {
    this.upTexture = await this.loadUpTextures()
    this.downTexture = await this.loadDownTextures()

    let button = Sprite.from(this.upTexture)
    button.width = this.width
    button.height = this.height

    // @ts-ignore
    this.container.eventMode = 'static'
    // @ts-ignore
    this.container.cursor = 'pointer'
    this.container.on('pointerdown', () => {
      button.texture = this.downTexture
    }).on('pointerup', () => {
      button.texture = this.upTexture
      this.clickCallback()
    })

    this.container.addChild(button)

    this.container.addChild(this.text)
    this.text.x = this.width / 2 - this.text.width / 2
    this.text.y = this.height / 2 - this.text.height / 2
  }
}