class Deck {
  constructor(id, subject) {
    this.id = id
    this.subject = subject
    Deck.all.push(this)
  }

  get cards() {
    const cards = Card.all.filter(card => card.deckId === this.id)
    return cards;
  }

  static findById(id) {
    const deck = Deck.all.find(deck => deck.id === id)
    return deck
  }

  static delete(deck) {
    const deleteDeck = Deck.findById(deck.id)
    const index = Deck.all.indexOf(deleteDeck)
    deleteDeck.destroyAllCards()
    Deck.all.splice(index, 1)
  }

  static findDeckBySubject(subject) {
    const deck = Deck.all.find(deck => deck.subject === subject)
    return deck
  }

  destroyAllCards() {
    Card.all.forEach(card => {
      if (card.deckId === this.id) {
        let ind = Card.all.indexOf(card)
        Card.all.splice(ind, 1)
      }
    })
  }

  renderDeck() {
    const deckList = document.getElementById("deck-list")
    const deckSelection = document.getElementById("deck-selection")
    const li = document.createElement("li")
    const subjectTag = document.createElement("p")
    const option = document.createElement("option")
    const testOption = document.createElement("option")
    const cardList = document.getElementById("card-list")
    const testDeckSelection = document.querySelector('.test-deck-selection')

    li.id = `deck-${this.id}`
    subjectTag.id = `deck-${this.id}-subject`
    subjectTag.innerText = `${this.subject}`
    option.id = `deck-${this.id}-option`
    option.innerText = `${this.subject}`
    testOption.id = `test-deck-${this.id}-option`
    testOption.innerText = `${this.subject}`

    deckList.appendChild(li)
    li.appendChild(subjectTag)
    deckSelection.appendChild(option)
    testDeckSelection.appendChild(testOption)

    subjectTag.addEventListener("click", (e) => {
      if (document.querySelector(".edit-deck-button") === null) {
          renderCards(this)
          renderEditDeckButton(this)
          renderDeleteDeckButton(this)
      } else if (document.querySelector(".edit-deck-button") !== null) {
          removeCards(this)
          removeEditDeckButton(this)
          removeDeleteDeckButton(this)
      }
    })
  }
}

Deck.all= [];
