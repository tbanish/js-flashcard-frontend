class Deck {
  constructor(id, subject) {
    this.id = id
    this.subject = subject
    Deck.all.push(this)
  }

  cards() {
    const cards = Card.all.filter(card => card.deckId === this.id)
    return cards;
  }

  renderDeck() {
    const deckList = document.getElementById("deck-list")
    const deckSelection = document.getElementById("deck-selection")
    const li = document.createElement("li")
    const subjectTag = document.createElement("p")
    const option = document.createElement("option")
    const cardList = document.getElementById("card-list")

    li.id = `deck-${this.id}`
    subjectTag.id = `deck-${this.id}-subject`
    subjectTag.innerText = `${this.subject}`
    option.id = `deck-${this.id}-option`
    option.innerText = `${this.subject}`

    deckList.appendChild(li)
    li.appendChild(subjectTag)
    deckSelection.appendChild(option)

    subjectTag.addEventListener("click", (e) => {
      if (cardList.childElementCount === 0) {
        renderCards(this)
      } else if (this.subject === document.getElementById("card-list-header").innerText){
        removeCards()
      } else {
        removeCards()
        renderCards(this)
      }
    })
  }
}

Deck.all= [];
