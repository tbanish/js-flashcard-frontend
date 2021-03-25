class Card {
  constructor(id, question, answer, deckId) {
    this.id = id
    this.question = question
    this.answer = answer
    this.deckId = deckId
    Card.all.push(this)
  }

  deck() {
    const deck = Deck.all.find(deck => deck.id === this.deckId)
    return deck
  }

  renderCard() {
    const cardList = document.getElementById("card-list")
    const li = document.createElement("li")
    const questionTag = document.createElement("p")
    const cardListHeader = document.getElementById("card-list-header")

    li.id = `card-${this.id}`
    questionTag.id = `card-${this.id}-question`
    questionTag.innerText = `${this.question}`
    cardListHeader.innerText = `${this.deck().subject}`
    cardList.appendChild(li)
    li.appendChild(questionTag)

    questionTag.addEventListener("click", (e) => {
      if (li.childElementCount === 1) {
        renderAnswer(this)
      } else {
        removeAnswer()
      }
    })
  }
}

Card.all = [];
