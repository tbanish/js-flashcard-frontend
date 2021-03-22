class Deck {
  constructor(id, subject) {
    this.id = id
    this.subject = subject
    Deck.all.push(this)
  }

  renderDeck() {
    const deckContainer = document.querySelector(".deck-container")
    const select = document.querySelector("select")
    const div = document.createElement("div")
    const subjectPTag = document.createElement("p")
    const cardContainer = document.createElement("div")
    const cardList = document.createElement("ol")
    const option = document.createElement("option")

    option.value = `${this.subject}`
    option.innerText = `${this.subject}`
    option.id = `opt-${this.id}`
    div.id = `${this.id}`
    div.classList.add("deck-div")
    subjectPTag.innerHTML = `${this.subject}`
    subjectPTag.classList.add("deck-subject")
    cardContainer.classList.add("card-container")
    cardContainer.id = `${this.subject} cards`
    cardList.classList.add("card-list")

    div.appendChild(subjectPTag)
    deckContainer.appendChild(div)
    div.appendChild(cardContainer)
    cardContainer.appendChild(cardList)
    select.appendChild(option)
  }
}

Deck.all= [];
