import { AnimatedSprite, Texture } from 'pixi.js'
import { HeroInterface } from './HeroInterface'
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
const NUMBER_OF_RUN_RIGHT_IMAGES = 20
const RUN_LEFT_FIRST_IMAGE_PATH = 'run_left/horde_knight_run_left_45_v01_00000.png'
const NUMBER_OF_RUN_LEFT_IMAGES = 20

export class Knight implements HeroInterface {
  private sprite: AnimatedSprite | null = null
  private textures: KnightTextures

  constructor(textures: KnightTextures) {
    this.textures = textures
  }

  getSprite(x: number, y: number): AnimatedSprite {
    if (!this.sprite) {
      this.sprite = new AnimatedSprite(this.textures.run)
      this.sprite.x = x
      this.sprite.y = y
      this.sprite.anchor.set(0.5)
      this.sprite.scale.set(1)
      this.sprite.animationSpeed = 0.3
      this.sprite.play()
    }

    return this.sprite
  }

  attack() {
    if (this.sprite instanceof AnimatedSprite) {
      this.sprite.textures = this.textures.attack
      this.sprite.loop = false
      this.sprite.play()
    }
  }

  static async loadTextures(): Promise<KnightTextures> {
    return {
      run: await loadTexturesByPath(BASE_IMAGE_PATH + RUN_FIRST_IMAGE_PATH, NUMBER_OF_RUN_IMAGES),
      attack: await loadTexturesByPath(BASE_IMAGE_PATH + ATTACK_FIRST_IMAGE_PATH, NUMBER_OF_ATTACK_IMAGES),
      run_left: await loadTexturesByPath(BASE_IMAGE_PATH + RUN_LEFT_FIRST_IMAGE_PATH, NUMBER_OF_RUN_LEFT_IMAGES),
      run_right: await loadTexturesByPath(BASE_IMAGE_PATH + RUN_RIGHT_FIRST_IMAGE_PATH, NUMBER_OF_RUN_RIGHT_IMAGES),
    }
  }
}