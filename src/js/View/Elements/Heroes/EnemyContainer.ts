import { AbstractCharacterContainer } from './AbstractCharacterContainer'
import { AbstractCharacter } from './AbstractCharacter'
import { MoveState } from '../../Template/AbstractView'

export class EnemyContainer extends AbstractCharacterContainer {
  getCharacterTextY() {
    return this.containerText ? this.getContainer().y - this.containerText.height : 0
  }

  createCharacter(): AbstractCharacter {
    return this.elementsFactory.createEnemy()
  }

  stopFight() {
    this.characters.forEach((character) => {
      character.idle()
    })
    this.isNeedUpdate = false
  }

  reset() {
    super.reset()
    this.updateCharacters()
    this.isNeedUpdate = false
  }

  switchMoveAnimation(state: MoveState) {
    this.isNeedUpdate = true
    super.switchMoveAnimation(state)
  }

  startFight() {
    super.startFight()
    this.isNeedUpdate = true
  }
}