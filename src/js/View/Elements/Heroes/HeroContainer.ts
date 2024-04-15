import { AbstractCharacterContainer } from './AbstractCharacterContainer'
import { AbstractCharacter } from './AbstractCharacter'

export class HeroContainer extends AbstractCharacterContainer{
  getCharacterTextY() {
    return this.containerText ? this.getContainer().y + this.getContainer().height / 2 - this.containerText.height : 0
  }

  createCharacter(): AbstractCharacter {
    return this.elementsFactory.createHero()
  }

  stopFight() {
    if (this.characters.length) {
      this.movable = true
    } else {
      this.isNeedUpdate = false
    }
  }
}