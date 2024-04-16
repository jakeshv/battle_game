import { Spine } from '@pixi/spine-pixi'
import { AbstractContainerComponent } from '../Common/AbstractContainerComponent'
import { Graphics, Text } from 'pixi.js'
import { viewConfig } from '../../../config/config'
import { AbstractButton } from './Buttons/AbstractButton'

export const BASE_WINDOW_PATH = 'assets/images/window/'

const FONT_SIZE = 24
const FONT_COLOR = '#fadca9'

export abstract class AbstractWindow extends AbstractContainerComponent {
  protected leftButton?: AbstractButton
  protected rightButton?: AbstractButton
  protected width: number
  protected height: number
  protected spine?: Spine
  protected spineScale: number = 1
  protected backgroundColor: string = 'rgba(0,0,0,0.4)'
  protected text: Text

  protected constructor(width: number, height: number, text: string) {
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

    this.container.visible = false
  }

  async init() {
    const backGround = new Graphics()
    backGround.rect(0, 0, this.width, this.height)
    backGround.fill(this.backgroundColor)
    this.container.addChild(backGround)

    this.spine = await this.loadSpine()

    this.container.width = this.width
    this.container.height = this.height

    this.container.addChild(this.spine)
    this.spine.scale.set(this.spineScale)
    this.spine.x = this.width / 2
    this.spine.y = this.height / 3

    this.container.addChild(this.text)
    this.text.x = this.width / 2 - this.text.width / 2
    this.text.y = this.spine.y - this.text.height / 2

    if (this.leftButton) {
      await this.leftButton.init()
      this.container.addChild(this.leftButton.getContainer())
    }
    if (this.rightButton) {
      await this.rightButton.init()
      this.container.addChild(this.rightButton.getContainer())
    }
  }

  hide() {
    this.container.visible = false
  }

  show() {
    this.container.visible = true
  }

  onLeftButtonClick(callback: () => void) {
    if (this.leftButton) {
      this.leftButton.onClick(() => {
        this.hide()
        callback()
      })
    }
  }

  onRightButtonClick(callback: () => void) {
    if (this.rightButton) {
      this.rightButton.onClick(() => {
        this.hide()
        callback()
      })
    }
  }

  abstract loadSpine(): Promise<Spine>
}