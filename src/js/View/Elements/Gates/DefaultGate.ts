import { Container, Graphics, Text } from 'pixi.js'
import { viewConfig } from '../../../../config/config'

const GATE_COLOR = 'rgba(57,212,250,0.3)'
const BORDER_WIDTH = 3
const BORDER_COLOR = 'rgba(40,126,147,0.7)'
const FONT_SIZE = 42
const FONT_COLOR = '#196b83'

export class DefaultGate {
  protected container: Container<any>
  protected leftText: Text
  protected rightText: Text
  protected activated: boolean = false
  protected rightBlock: Container<any>
  protected leftBlock: Container<any>

  constructor(width: number) {

    this.container = new Container()

    this.rightBlock = new Container()
    this.leftBlock = new Container()
    
    this.container.addChild(this.leftBlock)
    this.container.addChild(this.rightBlock)
    this.rightBlock.x = width / 2

    const gateHeight = width / 4
    const borderOffset = gateHeight / 8

    // Left Block
    const leftGraphic = new Graphics()
    leftGraphic.rect(0, 0, width / 2, gateHeight)
    leftGraphic.fill(GATE_COLOR)
    leftGraphic.moveTo(0, - borderOffset)
    leftGraphic.lineTo(0, gateHeight + borderOffset)
    leftGraphic.stroke({ width: BORDER_WIDTH, color: BORDER_COLOR })

    this.leftBlock.addChild(leftGraphic)
    this.leftText = this.createText()
    this.leftText.y = gateHeight / 2 - this.leftText.height / 2
    this.leftBlock.addChild(this.leftText)

    // Right Block
    const rightGraphic = new Graphics()
    rightGraphic.rect(0, 0, width / 2, gateHeight)
    rightGraphic.fill(GATE_COLOR)
    rightGraphic.moveTo(width / 2, -borderOffset)
    rightGraphic.lineTo(width / 2, gateHeight + borderOffset)
    rightGraphic.stroke({ width: BORDER_WIDTH, color: BORDER_COLOR })

    this.rightBlock.addChild(rightGraphic)
    this.rightText = this.createText()
    this.rightText.y = gateHeight / 2 - this.rightText.height / 2
    this.rightBlock.addChild(this.rightText)

    // Center
    const graphic = new Graphics()
    graphic.moveTo(width / 2, -borderOffset)
    graphic.lineTo(width / 2, gateHeight + borderOffset)
    graphic.stroke({ width: BORDER_WIDTH, color: BORDER_COLOR })
    this.container.addChild(graphic)
  }

  createText() {
    return new Text({
      text: '',
      style: {
        fontFamily: viewConfig.fontFamily,
        fontSize: FONT_SIZE,
        fill: FONT_COLOR,
        fontWeight: 'bold'
      }
    })
  }

  updateText(left: number, right: number) {
    this.leftText.text = 'x' + left
    this.leftText.x = this.leftBlock.width / 2 - this.leftText.width / 2
    this.rightText.text = 'x' + right
    this.rightText.x = this.rightBlock.width / 2 - this.rightText.width / 2
  }

  getContainer() {
    return this.container
  }
  
  reset() {
    this.leftBlock.visible = true
    this.rightBlock.visible = true
    this.activated = false
  }

  isActivated() {
    return this.activated
  }
  
  activateLeft() {
    this.activated = true
    this.leftBlock.visible = false
  }
  
  activateRight() {
    this.activated = true
    this.rightBlock.visible = false
  }
}