class Deck {
  constructor(id, subject) {
    this.id = id
    this.subject = subject
    Deck.all.push(this)
  }

  renderDeck() {
    const deckContainer = document.querySelector(".deck-container")
    const div = document.createElement("div")
    const subjectPTag = document.createElement("p")

    div.id = `${this.id}`
    subjectPTag.innerHTML = `${this.subject}`
    subjectPTag.classList.add("deck-subject")
    div.appendChild(subjectPTag)
    deckContainer.appendChild(div)
  }
}

Deck.all= [];
