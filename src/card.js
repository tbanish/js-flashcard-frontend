class Card {
  constructor(id, question, answer, deckId) {
    this.id = id
    this.question = question
    this.answer = answer
    this.deckId = deckId
    Card.all.push(this)
  }

  renderCard() {
    const li = document.createElement("li")
    const deck = Deck.all.find(deck => deck.id === this.deckId).subject
    const ol = document.getElementById(`${deck}`+" cards").children[0]
    
    li.id = `Card ${this.id}`
    li.innerText = this.question
    ol.id = `${deck} card list`
    ol.appendChild(li)
  }
}

Card.all = [];
