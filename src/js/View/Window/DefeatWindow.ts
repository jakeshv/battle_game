import { Assets } from 'pixi.js'
import { AbstractWindow, BASE_WINDOW_PATH } from './AbstractWindow'
import { GreenButton } from './Buttons/GreenButton'
import { RedButton } from './Buttons/RedButton'
import { Spine } from '@pixi/spine-pixi'

export class DefeatWindow extends AbstractWindow {
  // TODO нужно высчитывать
  protected spineScale = 0.8

  constructor(width: number, height: number) {
    super(width, height, 'Defeat')

    let buttonWidth = width / 3
    let buttonHeight = buttonWidth / 4

    this.leftButton = new GreenButton('Play now', buttonWidth, buttonHeight)
    this.leftButton.getContainer().x = width / 2 - buttonWidth - buttonWidth / 8
    this.leftButton.getContainer().y = height / 2
    this.rightButton = new RedButton('Retry', buttonWidth, buttonHeight)
    this.rightButton.getContainer().x = width / 2 + buttonWidth / 8
    this.rightButton.getContainer().y = height / 2
  }

  async init() {
    await super.init()

    if (this.spine) {
      this.spine.y = this.spine.height / 2 - this.text.height
    }
  }

  async loadSpine() {
    await Assets.load([
      {
        alias: 'DefeatWindowSpineSkeleton',
        src: BASE_WINDOW_PATH + 'defeat/minigame_defeat.json'
      },
      {
        alias: 'DefeatWindowSpineAtlas',
        src: BASE_WINDOW_PATH + 'defeat/minigame_defeat.atlas'
      }
    ])

    return Spine.from({
      skeleton: 'DefeatWindowSpineSkeleton',
      atlas: 'DefeatWindowSpineAtlas'
    })
  }


  show() {
    super.show()
    if (this.spine) {
      this.spine.state.setAnimation(0, 'appear')
      this.spine.state.addAnimation(0, 'idle', true)
    }
  }
}