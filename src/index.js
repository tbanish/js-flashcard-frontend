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
    ol.remove()
    const newOl = document.createElement("ol")
    const cardContainer = document.getElementById(`${e.target.innerText} cards`)
    newOl.classList.add("card-list")
    cardContainer.appendChild(newOl)

    if (document.getElementById(`${e.target.innerText}-edit-form`) != null) {
      document.getElementById(`${e.target.innerText}-edit-form`).remove()
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

  editDeckButton.addEventListener("click", (e) => {
    const subject = e.target.id.split("-")[0]
    if (document.getElementById(`${subject}-edit-form`) === null) {
      renderEditDeckForm(e)
    } else {
      document.getElementById(`${subject}-edit-form`).remove()
    }
  })
}

function renderEditDeckForm(e) {
  const editForm = document.createElement("FORM")
  const subjectInput = document.createElement("INPUT")
  const subjectInputLabel = document.createElement("LABEL")
  const submitButton = document.createElement("button")
  const closeButton = document.createElement("button")
  const deckDiv = e.target.parentElement
  const subject = e.target.id.split("-")[0]
  const header = document.createElement("h3")

  editForm.id = `${subject}-edit-form`
  subjectInput.id = `${subject}-subject-input`
  subjectInput.value = `${subject}`
  subjectInputLabel.setAttribute("for", `${subject}-subject-input`)
  subjectInputLabel.innerText = "Subject: "
  submitButton.id = `${subject}-submit-button`
  submitButton.innerText = "submit"
  closeButton.id = `${subject}-close-button`
  closeButton.innerText = "close"
  header.innerText = "Edit Deck"

  deckDiv.appendChild(editForm)
  editForm.appendChild(header)
  editForm.appendChild(subjectInputLabel)
  editForm.appendChild(subjectInput)
  editForm.appendChild(submitButton)
  editForm.appendChild(closeButton)

  editForm.addEventListener("submit", (e) => editDeckFormHandler(e))
}

function removeDeckEditDeleteButtons(e) {
  const editDeckButton = document.getElementById(`${e.target.innerText}-edit-button`)
  const deleteDeckButton = document.getElementById(`${e.target.innerText}-delete-button`)

  editDeckButton.remove()
  deleteDeckButton.remove()
}

function renderOrRemoveAnswer(e) {
  const cardId = parseInt(e.target.id.split(" ")[1])
  const card = Card.all.find(card => card.id === cardId)

  if (e.target.children.length === 0 && e.target.tagName === "LI") {
    const answer = document.createElement("p")

    answer.innerText = `${card.answer}`
    answer.id = `answer ${cardId}`
    e.target.appendChild(answer)

    renderEditDeleteCardButtons(e)
  } else if (e.target.tagName === "P") {
    e.target.remove()
    document.getElementById(`Card ${e.target.id}-edit-button`).remove()
    document.getElementById(`Card ${e.target.id}-delete-button`).remove()
  } else if (e.target.children.length > 0 && e.target.tagName === "LI") {
    e.target.childNodes[1].remove()
    document.getElementById(`Card ${cardId}-edit-button`).remove()
    document.getElementById(`Card ${cardId}-delete-button`).remove()
  }
}

function renderEditDeleteCardButtons(e) {
  const editCardButton = document.createElement("button")
  const deleteCardButton = document.createElement("button")
  editCardButton.innerText = "edit card"
  deleteCardButton.innerText = "delete card"
  editCardButton.id = `${e.target.id}-edit-button`
  deleteCardButton.id = `${e.target.id}-delete-button`

  e.target.appendChild(editCardButton)
  e.target.appendChild(deleteCardButton)

  editCardButton.addEventListener("click", (e) => renderEditCardForm(e))
}

function renderEditCardForm(e) {
  e.preventDefault()

  const editCardForm = document.createElement("FORM")
  const questionInputLabel = document.createElement("LABEL")
  const questionInput = document.createElement("INPUT")
  const answerInputLabel = document.createElement("LABEL")
  const answerInput = document.createElement("INPUT")
  const submitButton = document.createElement("button")
  const header = document.createElement("h3")
  const closeButton = document.createElement("button")
  const cardIdLabel = e.target.id.split("-")[0]
  const cardId = parseInt(e.target.id.split("-")[0].split(" ")[1])
  const card = Card.all.find(card => card.id === cardId)

  editCardForm.id = `${cardIdLabel}-edit-form`
  questionInput.id = `${cardIdLabel}-question-input`
  questionInput.value = `${card.question}`
  questionInputLabel.setAttribute("for", `${cardIdLabel}-question-input`)
  questionInputLabel.innerText = "Question: "
  answerInput.id = `${cardIdLabel}-answer-input`
  answerInput.value = `${card.answer}`
  answerInputLabel.setAttribute("for", `${cardIdLabel}-answer-input`)
  answerInputLabel.innerText = "Answer: "
  submitButton.id = `${cardIdLabel}-submit-button`
  submitButton.innerText = "submit"
  closeButton.id = `${cardIdLabel}-close-button`
  closeButton.innerText = "close"
  header.innerText = "Edit Card"

  e.target.parentElement.appendChild(editCardForm)
  editCardForm.appendChild(header)
  editCardForm.appendChild(questionInputLabel)
  editCardForm.appendChild(questionInput)
  editCardForm.appendChild(answerInputLabel)
  editCardForm.appendChild(answerInput)
  editCardForm.appendChild(submitButton)
  editCardForm.appendChild(closeButton)
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

function editDeckFormHandler(e) {
  e.preventDefault()
  const subject = e.target.id.split("-")[0]
  const deck = Deck.all.find(deck => deck.subject === subject)
  const inputValue = document.getElementById(`${subject}-subject-input`).value
  patchDeck(deck, inputValue)
  document.getElementById(`${subject}-edit-form`).remove()
}

function patchDeck(deck, subject) {
  let bodyData = {subject}

  fetch(decksEndpoint+`/${deck.id}`, {
    method: "PATCH",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(bodyData)
  })
  .then(resp => resp.json())
  .then(updatedDeck => {
    const deck = Deck.all.find(deck => deck.id === updatedDeck.id)
    const cardContainer = document.getElementById(`${deck.subject} cards`)
    document.getElementById(`${deck.subject}-edit-button`).remove()
    document.getElementById(`${deck.subject}-delete-button`).remove()
    document.getElementById(`${deck.subject} card list`).remove()

    deck.subject = updatedDeck.subject
    cardContainer.id = `${deck.subject} cards`

    document.getElementById(deck.id).children[0].innerText = deck.subject
    document.querySelector(`option#opt-${deck.id}`).innerText = deck.subject
    const ol = document.createElement("ol")
    ol.classList.add("card-list")
    cardContainer.appendChild(ol)
  })
}
