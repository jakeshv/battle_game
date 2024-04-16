import { Application, Assets, Container, Text } from 'pixi.js'
import { AbstractCharacter } from './AbstractCharacter'
import { DistributorInterface } from '../../Distribution/DistributorInterface'
import { MoveState } from '../../Template/AbstractView'
import { ElementsFactoryInterface } from '../Factory/ElementsFactoryInterface'
import { Sound } from '@pixi/sound'

const ADD_DELAY_TIME = 2
const REMOVE_DELAY_TIME = 3
const STEPS_SOUND_SRC = 'assets/sounds/steps.mp3'

export abstract class AbstractCharacterContainer {
  protected app: Application
  protected characters: AbstractCharacter[]
  protected container: Container<any>
  protected distributor: DistributorInterface
  protected containerText?: Text
  protected targetNumCharacters: number = 0
  protected borderLeft?: number
  protected borderRight?: number
  protected elementsFactory: ElementsFactoryInterface
  protected movable: boolean = true
  protected charactersToDeath: number = 0
  protected isNeedUpdate: boolean = true
  protected stepsSound?: Sound

  constructor(app: Application, distributor: DistributorInterface, elementsFactory: ElementsFactoryInterface) {
    this.app = app
    this.container = new Container()
    this.distributor = distributor
    this.characters = []
    this.elementsFactory = elementsFactory

    let time = 0
    this.app.ticker.add((ticker) => {
      if (this.isNeedUpdate) {
        const delay = this.targetNumCharacters > this.characters.length ? ADD_DELAY_TIME : REMOVE_DELAY_TIME
        time += ticker.deltaTime
        if (time > delay) {
          this.updateCharacters()
          time = 0
        }
      }
      this.updateCharacterText()
    })
  }

  async init() {
    Sound.from(STEPS_SOUND_SRC)
    this.stepsSound = await Assets.load(STEPS_SOUND_SRC)
  }

  setTargetNumCharacters(num: number) {
    this.targetNumCharacters = num
    if (num < this.characters.length) {
      this.charactersToDeath = this.characters.length - num
    }
  }

  setBorderLeft(borderLeft: number) {
    this.borderLeft = borderLeft
  }

  setBorderRight(borderRight: number) {
    this.borderRight = borderRight
  }

  getContainer() {
    return this.container
  }

  createCharacterText(text: Text) {
    this.containerText = text
    this.app.stage.addChild(text)
  }

  checkNumCharactersToUpdate(): number {
    const target = this.targetNumCharacters
    const current = this.characters.length
    if (current === 0) {
      return target
    }
    const change = 1
    if (target > current) {
      return current + Math.max(change, Math.floor(Math.abs(target - current) / 2))
    } else if (target < current) {
      return current - change
    } else return current
  }

  abstract createCharacter(): AbstractCharacter

  updateCharacters() {
    let num = this.checkNumCharactersToUpdate()

    if (num > this.characters.length) {
      const neededHeroes = num - this.characters.length
      for (let i = 0; i < neededHeroes; i++) {
        const hero = this.createCharacter()
        this.characters.push(hero)
        this.getContainer().addChild(hero.getSprite())
      }
    }
    if (num < this.characters.length) {
      const excessHeroes = this.characters.length - num
      for (let i = 0; i < excessHeroes; i++) {
        let index = Math.floor(Math.random() * this.characters.length)
        let character = this.characters[index]
        this.characters.splice(index, 1)
        if (character) {
          character.death(() => {
            this.charactersToDeath--
          })
        }
      }
    }

    this.distributeCharacters()
  }

  distributeCharacters() {
    if (this.borderRight) {
      this.distributor.setBorderRight(this.borderRight - this.getContainer().x)
    }
    if (this.borderLeft) {
      this.distributor.setBorderLeft(this.borderLeft - this.getContainer().x)
    }

    const coordinates = this.distributor.distributeByNumber(this.characters.length)

    this.characters.forEach((character, index) => {
      character.setCoordinates(coordinates[index].x, coordinates[index].y)
    })
  }

  updateCharacterText() {
    if (this.containerText) {
      this.containerText.text = this.characters.length || ''
      this.containerText.y = this.getCharacterTextY()
      this.containerText.x = this.getContainer().x - this.containerText.width / 2
    }
  }

  protected abstract getCharacterTextY(): number

  switchMoveAnimation(state: MoveState) {
    if (this.stepsSound) {
      if (!this.stepsSound.isPlaying) {
        this.stepsSound.play()
      }
    }
    this.characters.forEach((character) => {
      switch (state) {
        case 'strait':
          character.run()
          break
        case 'left':
          character.runLeft()
          break
        case 'right':
          character.runRight()
          break
      }
    })
  }

  hasCharactersToDeath(): boolean {
    return this.charactersToDeath > 0
  }

  startFight() {
    if (this.stepsSound) {
      this.stepsSound.stop()
    }
    this.movable = false
    this.characters.forEach((character) => {
      character.attack()
    })
  }

  isMovable() {
    return this.movable
  }

  reset() {
    this.movable = true
    this.isNeedUpdate = true
    this.characters.forEach((character) => {
      character.getSprite().destroy()
    })
    this.characters = []
  }

  abstract stopFight(): void

  stop() {
    if (this.stepsSound) {
      this.stepsSound.stop()
    }
    this.characters.forEach((character) => {
      character.idle()
    })
    this.movable = false
    this.isNeedUpdate = false
  }
}