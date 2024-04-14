import { AnimatedSprite, Texture } from 'pixi.js'
import { CharacterInterface } from './CharacterInterface'
import { CharacterSpriteInterface } from './CharacterSpriteInterface'

export type HeroState = 'run' | 'run_left' | 'run_right' | 'attack' | 'idle' | 'death'

export interface CharacterTextures {
  run: Texture[]
  attack: Texture[]
  idle: Texture[]
  death: Texture[]
  run_left: Texture[]
  run_right: Texture[]
}

export class AbstractCharacter implements CharacterInterface, CharacterSpriteInterface {
  protected sprite: AnimatedSprite
  protected textures: CharacterTextures
  protected state: HeroState = 'run'

  constructor(textures: CharacterTextures) {
    this.textures = textures
    this.sprite = new AnimatedSprite(this.getStartTexture())

    this.sprite.anchor.set(0.5)
    this.sprite.scale.set(1)
    this.sprite.animationSpeed = 0.5
    this.sprite.play()
    this.sprite.onComplete = this.checkState.bind(this)
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
    this.sprite.textures = this.textures.attack
    this.sprite.loop = true
    this.sprite.play()
  }

  idle() {
    this.sprite.textures = this.textures.idle
    this.sprite.loop = true
    this.sprite.play()
  }

  death() {
    this.sprite.textures = this.textures.death
    this.sprite.loop = false
    this.sprite.play()
  }

  run() {
    this.sprite.loop = false
    this.state = 'run'
  }

  runLeft() {
    this.sprite.loop = false
    this.state = 'run_left'
  }

  runRight() {
    this.sprite.loop = false
    this.state = 'run_right'
  }

  checkState() {
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
    }
    this.sprite.play()
  }
}