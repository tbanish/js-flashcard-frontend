class Card {
  constructor(id, question, answer, deckId) {
    this.id = id
    this.question = question
    this.answer = answer
    this.deckId = deckId
    Card.all.push(this)
  }

  renderCard() {
    const cardList = document.getElementById("card-list")
    const li = document.createElement("li")
    const questionTag = document.createElement("p")

    li.id = `card-${this.id}`
    questionTag.id = `card-${this.id}-question`
    questionTag.innerText = `${this.question}`
    cardList.appendChild(li)
    li.appendChild(questionTag)
  }
}

Card.all = [];
