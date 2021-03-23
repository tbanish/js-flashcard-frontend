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
    const question = document.createElement("p")

    li.id = `Card ${this.id}`
    question.innerText = this.question
    question.id = `Card ${this.id} question`
    question.classList.add("card-questions")
    ol.id = `${deck} card list`
    ol.appendChild(li)
    li.appendChild(question)
  }
}

Card.all = [];
