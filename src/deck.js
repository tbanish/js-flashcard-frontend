class Deck {
  constructor(id, subject) {
    this.id = id
    this.subject = subject
    Deck.all.push(this)
  }

  renderDeck() {
    const deckList = document.getElementById("deck-list")
    const deckSelection = document.getElementById("deck-selection")
    const li = document.createElement("li")
    const subjectTag = document.createElement("p")
    const option = document.createElement("option")

    li.id = `deck-${this.id}`
    subjectTag.id = `deck-${this.id}-subject`
    subjectTag.innerText = `${this.subject}`
    option.id = `deck-${this.id}-option`
    option.innerText = `${this.subject}`

    deckList.appendChild(li)
    li.appendChild(subjectTag)
    deckSelection.appendChild(option)

    subjectTag.addEventListener("click", (e) => {
      renderCards(e)
    })
  }
}

Deck.all= [];
