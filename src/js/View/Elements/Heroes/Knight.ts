import { AnimatedSprite, Texture } from 'pixi.js'
import { HeroInterface, HeroState } from './HeroInterface'
import { loadTexturesByPath } from '../../Helpers/TextureHelper'

export interface KnightTextures {
  run: Texture[]
  attack: Texture[]
  run_left: Texture[]
  run_right: Texture[]
}

const BASE_IMAGE_PATH = 'assets/images/knight/'
const RUN_FIRST_IMAGE_PATH = 'run/horde_knight_run_v01_00000.png'
const NUMBER_OF_RUN_IMAGES = 20
const ATTACK_FIRST_IMAGE_PATH = 'attack/horde_knight_attack_v01_00000.png'
const NUMBER_OF_ATTACK_IMAGES = 44
const RUN_RIGHT_FIRST_IMAGE_PATH = 'run_right/horde_knight_run_right_45_v01_00000.png'
const RUN_LEFT_FIRST_IMAGE_PATH = 'run_left/horde_knight_run_left_45_v01_00000.png'

export class Knight implements HeroInterface {
  protected sprite: AnimatedSprite
  protected textures: KnightTextures
  protected state: HeroState = 'run'

  constructor(textures: KnightTextures) {
    this.textures = textures
    this.sprite = new AnimatedSprite(this.textures.run)

    //this.sprite.loop = false
    this.sprite.anchor.set(0.5)
    this.sprite.scale.set(1)
    this.sprite.animationSpeed = 0.5
    this.sprite.play()
  }

  getSprite(): AnimatedSprite {
    return this.sprite
  }

  setCoordinates(x: number, y: number) {
    this.sprite.x = x
    this.sprite.y = y
  }

  static async loadTextures(): Promise<KnightTextures> {
    return {
      run: await loadTexturesByPath(BASE_IMAGE_PATH + RUN_FIRST_IMAGE_PATH, NUMBER_OF_RUN_IMAGES),
      attack: await loadTexturesByPath(BASE_IMAGE_PATH + ATTACK_FIRST_IMAGE_PATH, NUMBER_OF_ATTACK_IMAGES),
      run_left: await loadTexturesByPath(BASE_IMAGE_PATH + RUN_LEFT_FIRST_IMAGE_PATH, NUMBER_OF_RUN_IMAGES),
      run_right: await loadTexturesByPath(BASE_IMAGE_PATH + RUN_RIGHT_FIRST_IMAGE_PATH, NUMBER_OF_RUN_IMAGES)
    }
  }

  attack() {
    this.sprite.textures = this.textures.attack
    this.sprite.loop = false
    this.sprite.play()
  }

  run() {
    if (this.state === 'run') return
    this.state = 'run'
    this.sprite.textures = this.textures.run
    this.sprite.loop = true
    this.sprite.play()
  }

  runLeft() {
    if (this.state === 'run_left') return
    this.state = 'run_left'
    this.sprite.textures = this.textures.run_left
    this.sprite.loop = true
    this.sprite.play()
  }

  runRight() {
    if (this.state === 'run_right') return
    this.state = 'run_right'
    this.sprite.textures = this.textures.run_right
    this.sprite.loop = true
    this.sprite.play()
  }
}