import { Assets } from 'pixi.js'
import { AbstractWindow, BASE_WINDOW_PATH } from './AbstractWindow'
import { GreenButton } from './Buttons/GreenButton'
import { Spine } from '@pixi/spine-pixi'

export class VictoryWindow extends AbstractWindow {
  // TODO нужно высчитывать
  protected spineScale = 0.8

  constructor(width: number, height: number) {
    super(width, height, 'Victory')

    let buttonWidth = width / 3
    let buttonHeight = buttonWidth / 4

    this.leftButton = new GreenButton('Play now', buttonWidth, buttonHeight)
    this.leftButton.getContainer().x = width / 2 - buttonWidth / 2
    this.leftButton.getContainer().y = height / 2
  }

  async loadSpine() {
    await Assets.load([
      {
        alias: 'VictoryWindowSpineSkeleton',
        src: BASE_WINDOW_PATH + 'victory/minigame_victory.json'
      },
      {
        alias: 'VictoryWindowSpineAtlas',
        src: BASE_WINDOW_PATH + 'victory/minigame_victory.atlas'
      }
    ])

    return Spine.from({
      skeleton: 'VictoryWindowSpineSkeleton',
      atlas: 'VictoryWindowSpineAtlas'
    })
  }
  show() {
    super.show()
    if (this.spine) {
      this.spine.state.setAnimation(0, 'appear' )
      this.spine.state.addAnimation(0, 'idle', true)
    }
  }
}