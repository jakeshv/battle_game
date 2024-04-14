import { loadTexturesByPath } from '../../Helpers/TextureHelper'
import { AbstractCharacter, CharacterTextures, HeroState } from './AbstractCharacter'
import { Texture } from 'pixi.js'

const BASE_IMAGE_PATH = 'assets/images/enemy_knight/'
const RUN_FIRST_IMAGE_PATH = 'run/horde_enemy_run_v01_00000.png'
const NUMBER_OF_RUN_IMAGES = 21
const ATTACK_FIRST_IMAGE_PATH = 'attack/horde_enemy_attack_v01_00000.png'
const NUMBER_OF_ATTACK_IMAGES = 45
const RUN_RIGHT_FIRST_IMAGE_PATH = 'run_right/horde_enemy_run_right_45_v01_00000.png'
const RUN_LEFT_FIRST_IMAGE_PATH = 'run_left/horde_enemy_run_left_45_v01_00000.png'
const IDLE_FIRST_IMAGE_PATH = 'idle/horde_enemy_idle_v01_00000.png'
const NUMBER_OF_IDLE_IMAGES = 55
const DEATH_FIRST_IMAGE_PATH = 'death/horde_enemy_death_v01_00000.png'
const NUMBER_OF_DEATH_IMAGES = 65

export class EnemyKnight extends AbstractCharacter {
  protected state: HeroState = 'idle'

  getStartTexture(): Texture[] {
    return this.textures.idle
  }

  static async loadTextures(): Promise<CharacterTextures> {
    return {
      run: await loadTexturesByPath(BASE_IMAGE_PATH + RUN_FIRST_IMAGE_PATH, NUMBER_OF_RUN_IMAGES),
      attack: await loadTexturesByPath(BASE_IMAGE_PATH + ATTACK_FIRST_IMAGE_PATH, NUMBER_OF_ATTACK_IMAGES),
      idle: await loadTexturesByPath(BASE_IMAGE_PATH + IDLE_FIRST_IMAGE_PATH, NUMBER_OF_IDLE_IMAGES),
      death: await loadTexturesByPath(BASE_IMAGE_PATH + DEATH_FIRST_IMAGE_PATH, NUMBER_OF_DEATH_IMAGES),
      run_left: await loadTexturesByPath(BASE_IMAGE_PATH + RUN_LEFT_FIRST_IMAGE_PATH, NUMBER_OF_RUN_IMAGES),
      run_right: await loadTexturesByPath(BASE_IMAGE_PATH + RUN_RIGHT_FIRST_IMAGE_PATH, NUMBER_OF_RUN_IMAGES)
    }
  }
}