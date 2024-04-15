import { AnimatedSprite, Texture } from 'pixi.js'
import { CharacterInterface } from './CharacterInterface'
import { CharacterSpriteInterface } from './CharacterSpriteInterface'

export type HeroState = 'run' | 'run_left' | 'run_right' | 'attack' | 'idle' | 'death'

const BASE_ANIMATION_SPEED = 0.5
const DEATH_ANIMATION_SPEED = 1

export interface CharacterTextures {
  run: Texture[]
  attack: Texture[]
  idle: Texture[]
  death: Texture[]
  run_left: Texture[]
  run_right: Texture[]
}

export abstract class AbstractCharacter implements CharacterInterface, CharacterSpriteInterface {
  protected sprite: AnimatedSprite
  protected textures: CharacterTextures
  protected state: HeroState = 'run'

  constructor(textures: CharacterTextures) {
    this.textures = textures
    this.sprite = new AnimatedSprite(this.getStartTexture())
    this.sprite.roundPixels = true

    this.sprite.anchor.set(0.5)
    this.sprite.scale.set(1)
    this.sprite.animationSpeed = BASE_ANIMATION_SPEED
    this.sprite.loop = false
    this.sprite.onComplete = this.checkState.bind(this)
    this.sprite.play()
  }

  getStartTexture(): Texture[] {
    return this.textures.run
  }

  getSprite() {
    return this.sprite
  }

  setCoordinates(x: number, y: number) {
    this.sprite.x = x
    this.sprite.y = y
  }

  attack() {
    this.state = 'attack'
    this.sprite.textures = this.textures.attack
    this.sprite.animationSpeed = Math.random() / 3
    this.sprite.play()
  }

  idle() {
    this.state = 'idle'
    this.sprite.animationSpeed = BASE_ANIMATION_SPEED
    this.sprite.textures = this.textures.idle
    this.sprite.play()
  }

  death(deathCallback?: () => void) {
    this.state = 'death'
    this.sprite.textures = this.textures.death
    this.sprite.animationSpeed = DEATH_ANIMATION_SPEED
    this.sprite.onComplete = () => {
      if (deathCallback) {
        deathCallback()
      }
      this.sprite.destroy()
    }
    this.sprite.play()
  }

  run() {
    if (this.state === 'run') return
    this.state = 'run'
    this.sprite.textures = this.textures.run
    this.sprite.play()
  }

  runLeft() {
    if (this.state === 'run_left') return
    this.state = 'run_left'
    this.sprite.textures = this.textures.run_left
    this.sprite.play()
  }

  runRight() {
    if (this.state === 'run_right') return
    this.state = 'run_right'
    this.sprite.textures = this.textures.run_right
    this.sprite.play()
  }

  checkState() {
    this.sprite.animationSpeed = BASE_ANIMATION_SPEED
    switch (this.state) {
      case 'run':
        this.sprite.textures = this.textures.run
        break
      case 'run_left':
        this.sprite.textures = this.textures.run_left
        break
      case 'run_right':
        this.sprite.textures = this.textures.run_right
        break
      case 'attack':
        this.attack()
        break
      case 'idle':
        this.sprite.textures = this.textures.idle
        break
      default:
        throw new Error('state doesn\'t exist')
    }
    this.sprite.play()
  }
}