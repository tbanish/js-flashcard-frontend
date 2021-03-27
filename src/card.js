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
    questionTag.classList.add("card-question")
    questionTag.innerText = `${this.question}`
    cardListHeader.innerText = `${this.deck().subject}`
    cardList.appendChild(li)
    li.appendChild(questionTag)

    questionTag.addEventListener("click", (e) => {
      if (document.querySelector(".card-answer") === null) {
        renderAnswer(this)
        renderEditCardButton(this)
        renderDeleteCardButton(this)
      } else if (this.id === parseInt(document.querySelector(".card-answer").id.split("-")[1])){
        removeAnswer()
        removeEditCardButton()
        removeDeleteCardButton()
      } else {
        removeAnswer()
        removeEditCardButton()
        removeDeleteCardButton()
        renderAnswer(this)
        renderEditCardButton(this)
        renderDeleteCardButton(this)
      }
    })
  }
}

Card.all = [];
