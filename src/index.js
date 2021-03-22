const decksEndpoint = "http://localhost:3000/api/v1/decks"
const cardsEndpoint = "http://localhost:3000/api/v1/cards"

document.addEventListener('DOMContentLoaded', () => {
  const newDeckForm = document.getElementById("new-deck-form")
  const newCardForm = document.getElementById("new-card-form")
  newCardForm.addEventListener("submit", (e) => newCardFormHandler(e))
  newDeckForm.addEventListener("submit", (e) => newDeckFormHandler(e))
  loadDecks();
})

function loadDecks() {
  fetch(decksEndpoint)
  .then(resp => resp.json())
  .then(decks => {
    for (const deck of decks.data) {
      const subject = deck.attributes.subject
      const deckId = parseInt(deck.id)
      const newDeck = new Deck(deckId, subject)
      const newDeckCards = deck.attributes.cards
      newDeck.renderDeck()
      createCards(newDeckCards)
    }
  })
}

function createCards(newDeckCards) {
  for (const card of newDeckCards) {
    const id = card.id
    const question = card.question
    const answer = card.answer
    const deckId = card.deck_id
    const newCard = new Card(id, question, answer, deckId)
  }
}

function renderOrRemoveCards(e) {
  const deck = Deck.all.find(deck => deck.subject === e.target.innerText)
  const cards = Card.all.filter(card => card.deckId === deck.id)
  const ol = document.getElementById(`${deck.subject} card list`)

  if (ol === null || ol.children.length === 0) {
    cards.forEach(card => card.renderCard())
    renderEditDeleteDeckButtons(e)

    const liCollection = document.querySelectorAll("li")
    liCollection.forEach(li => {
      li.addEventListener("click", (e) => renderOrRemoveAnswer(e))
    })
  } else {
    const olCollection = document.getElementById(`${deck.subject} card list`).children
    for (const li of olCollection) {
      li.remove()
    }
    if (olCollection.length > 0) {
      olCollection[0].remove()
    }
    removeDeckEditDeleteButtons(e)
  }
}

function renderEditDeleteDeckButtons(e) {
  const editDeckButton = document.createElement("button")
  const deleteDeckButton = document.createElement("button")
  editDeckButton.innerText = "edit deck"
  deleteDeckButton.innerText = "delete deck"
  editDeckButton.id = `${e.target.innerText}-edit-button`
  deleteDeckButton.id = `${e.target.innerText}-delete-button`

  e.target.parentElement.appendChild(editDeckButton)
  e.target.parentElement.appendChild(deleteDeckButton)
}

function removeDeckEditDeleteButtons(e) {
  const editDeckButton = document.getElementById(`${e.target.innerText}-edit-button`)
  const deleteDeckButton = document.getElementById(`${e.target.innerText}-delete-button`)
  editDeckButton.remove()
  deleteDeckButton.remove()
}

function renderOrRemoveAnswer(e) {
  if (e.target.children.length === 0) {
    const cardId = parseInt(e.target.id.split(" ")[1])
    const card = Card.all.find(card => card.id === cardId)
    const answer = document.createElement("p")
    answer.innerText = `${card.answer}`
    e.target.appendChild(answer)
  } else {
    e.target.childNodes[1].remove()
  }
}

// FORM HANDLERS AND POST & PATCH REQUESTS
function newDeckFormHandler(e) {
  e.preventDefault()
  const subject = document.querySelector('[name="subject"]').value
  postDeck(subject)
  document.querySelector('[name="subject"]').value = ""
}

function postDeck(subject) {
  let bodyData = {subject}
  fetch(decksEndpoint, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(bodyData)
  })
  .then(resp => resp.json())
  .then(deck => {
    const newDeck = new Deck(deck.id, deck.subject)
    newDeck.renderDeck()
  })
}

function newCardFormHandler(e) {
  e.preventDefault()
  const question = document.querySelector('[name="question"]').value
  const answer = document.querySelector('[name="answer"]').value
  const deckSubject = document.querySelector("select").value
  const deck = Deck.all.find(deck => deck.subject === deckSubject)
  postCard(question, answer, deck.id)
}

function postCard(question, answer, deck_id) {
  let bodyData = {question, answer, deck_id}
  fetch(cardsEndpoint, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(bodyData)
  })
  .then(resp => resp.json())
  .then(card => {
    const id = card.id
    const question = card.question
    const answer = card.answer
    const deckId = card.deck_id
    const newCard = new Card(id, question, answer, deckId)
    newCard.renderCard()

    document.querySelector('[name="question"]').value = ""
    document.querySelector('[name="answer"]').value = ""
    document.querySelector("select").value = "default-option"
  })
}
