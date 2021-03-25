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

function renderCards(deck) {
  const cards = deck.cards()
  cards.forEach(card => card.renderCard())
}

function renderEditDeckButton(deck) {
  const li = document.getElementById(`deck-${deck.id}`)
  const editDeckButton = document.createElement("button")

  editDeckButton.id = `edit-deck-${deck.id}`
  editDeckButton.classList.add("edit-deck-button")
  editDeckButton.innerText = "edit deck"
  li.appendChild(editDeckButton)

  editDeckButton.addEventListener("click", () => {
    if (document.getElementById("edit-form-container").childElementCount === 0) {
      renderEditDeckForm(deck)
    } else {
      removeEditDeckForm()
      renderEditDeckForm(deck)
    }
  })
}

function renderEditCardButton(card) {
  const li = document.getElementById(`card-${card.id}`)

  const editCardButton = document.createElement("button")

  editCardButton.id = `edit-card-${card.id}`
  editCardButton.classList.add("edit-card-button")
  editCardButton.innerText = "edit card"
  li.appendChild(editCardButton)
}

function renderDeleteCardButton(card) {
  const li = document.getElementById(`card-${card.id}`)

  const deleteCardButton = document.createElement("button")

  deleteCardButton.id = `delete-card-${card.id}`
  deleteCardButton.classList.add("delete-card-button")
  deleteCardButton.innerText = "delete card"
  li.appendChild(deleteCardButton)
}

function renderDeleteDeckButton(deck) {
  const li = document.getElementById(`deck-${deck.id}`)
  const deleteDeckButton = document.createElement("button")

  deleteDeckButton.id = `delete-deck-${deck.id}`
  deleteDeckButton.classList.add("delete-deck-button")
  deleteDeckButton.innerText = "delete deck"
  li.appendChild(deleteDeckButton)
}

function removeEditCardButton() {
  document.querySelector(".edit-card-button").remove()
}

function removeDeleteCardButton() {
  document.querySelector(".delete-card-button").remove()
}

function removeEditDeckButton() {
  document.querySelector(".edit-deck-button").remove()
}

function removeDeleteDeckButton() {
  document.querySelector(".delete-deck-button").remove()
}

function removeCards() {
  const cardList = document.getElementById("card-list")
  const cardListHeader = document.getElementById("card-list-header")
  cardListHeader.innerText = ""

  while (cardList.firstChild) {
    cardList.removeChild(cardList.firstChild)
  }
}

function renderAnswer(card) {
  if (document.querySelector(".card-answer") != null){
    removeAnswer()
  }

  const answerTag = document.createElement("p")
  const li = document.getElementById(`card-${card.id}`)
  answerTag.id = `card-${card.id}-answer`
  answerTag.classList.add("card-answer")
  answerTag.innerText = `${card.answer}`
  li.appendChild(answerTag)
}

function removeAnswer() {
  document.querySelector(".card-answer").remove()
}

function renderEditDeckForm(deck) {
  const editForm = document.createElement("FORM")
  const subjectInput = document.createElement("INPUT")
  const subjectInputLabel = document.createElement("LABEL")
  const submitButton = document.createElement("button")
  const closeButton = document.createElement("button")
  const editFormContainer = document.getElementById("edit-form-container")
  const header = document.createElement("h3")

  editForm.id = `deck-${deck.id}-edit`
  editForm.classList.add("edit-deck-form")
  subjectInput.id = `deck-${deck.id}-subject-input`
  subjectInput.value = `${deck.subject}`
  subjectInputLabel.setAttribute("for", `${deck.id}-subject-input`)
  subjectInputLabel.innerText = "Subject: "
  submitButton.id = `${deck.id}-submit-button`
  submitButton.innerText = "submit"
  closeButton.id = `${deck.id}-close-button`
  closeButton.innerText = "close"
  header.innerText = "Edit Deck"

  editFormContainer.appendChild(editForm)
  editForm.appendChild(header)
  editForm.appendChild(subjectInputLabel)
  editForm.appendChild(subjectInput)
  editForm.appendChild(submitButton)
  editForm.appendChild(closeButton)

  editForm.addEventListener("submit", (e) => editDeckFormHandler(e))
  closeButton.addEventListener("click", (e) => {
    e.preventDefault()
    removeEditDeckForm()
  })
}

function removeEditDeckForm() {
  document.querySelector(".edit-deck-form").remove()
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

  editCardForm.addEventListener("submit", (e) => {
    editCardFormHandler(e)
  })
}

function removeEditCardForm(cardId){
  document.getElementById(`Card ${cardId} question-edit-form`).remove()
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
    if (deck.errors === undefined) {
      const newDeck = new Deck(deck.id, deck.subject)
      newDeck.renderDeck()
    } else {
      deck.errors.forEach(error => {
        alert(error)
      })
    }
  })
}

function newCardFormHandler(e) {
  e.preventDefault()

  if (document.querySelector("select").value === "--select deck--") {
    const message = "Error: Must select a deck."
    alert(message)
  } else {
    const question = document.querySelector('[name="question"]').value
    const answer = document.querySelector('[name="answer"]').value
    const deckSubject = document.querySelector("select").value
    const deck = Deck.all.find(deck => deck.subject === deckSubject)
    postCard(question, answer, deck.id)
  }
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
    if (card.errors === undefined) {
      const id = card.id
      const question = card.question
      const answer = card.answer
      const deckId = card.deck_id
      const newCard = new Card(id, question, answer, deckId)

      document.querySelector('[name="question"]').value = ""
      document.querySelector('[name="answer"]').value = ""
      document.querySelector("select").value = "--select deck--"
    } else {
      card.errors.forEach(error => {
        alert(error)
      })
    }
  })
}

function editDeckFormHandler(e) {
  e.preventDefault()

  const deckId = parseInt(e.target.id.split("-")[1])
  const deck = Deck.all.find(deck => deck.id === deckId)
  const subject = document.getElementById(`deck-${deckId}-subject-input`).value

  patchDeck(deck, subject)
  removeEditDeckForm()
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
    if (updatedDeck.errors === undefined) {
      const deck = Deck.all.find(deck => deck.id === updatedDeck.id)
      const subjectTag = document.getElementById(`deck-${deck.id}-subject`)
      const cardListHeader = document.getElementById("card-list-header")
      const deckSelection = document.getElementById("deck-selection")

      for (option of deckSelection) {
        if (option.value === deck.subject) {
          option.innerText = `${updatedDeck.subject}`
        }
      }

      subjectTag.innerText = `${updatedDeck.subject}`
      cardListHeader.innerText = `${updatedDeck.subject}`
      deck.subject = updatedDeck.subject
    } else {
      updatedDeck.errors.forEach(error => {
        alert(error)
      })
    }
  })
}

function editCardFormHandler(e) {
  e.preventDefault()
  const cardId = parseInt(e.target.id.split("-")[0].split(" ")[1])
  const card = Card.all.find(card => card.id === cardId)
  const question = document.getElementById(`Card ${cardId} question-question-input`).value
  const answer = document.getElementById(`Card ${cardId} question-answer-input`).value
  patchCard(card, question, answer)
}

function patchCard(card, question, answer) {
  let bodyData = {question, answer}

  fetch(cardsEndpoint+`/${card.id}`, {
    method: "PATCH",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(bodyData)
  })
  .then(resp => resp.json())
  .then(updatedCard => {
    if (updatedCard.errors === undefined) {
      const oldCard = Card.all.find(card => card.id === updatedCard.id)
      oldCard.question = updatedCard.question
      oldCard.answer = updatedCard.answer
      document.getElementById(`Card ${updatedCard.id} question`).innerText = updatedCard.question
      document.getElementById(`answer ${updatedCard.id}`).innerText = updatedCard.answer
      document.getElementById(`Card ${updatedCard.id} question-edit-form`).remove()
    } else {
      updatedCard.errors.forEach(error => {
        alert(error)
      })
    }
  })
}

function deleteDeck(deck) {
  fetch(decksEndpoint+`/${deck.id}`, {
    method: "DELETE"
  })
  const deckId = deck.id
  const deleteDeck = Deck.all.find(deck => deck.id === deckId)
  const index = Deck.all.indexOf(deleteDeck)
  const selectTag = document.querySelector("select")

  Deck.all.splice(index, 1)
  document.getElementById(deckId).remove()

  for (const option of selectTag) {
    if (option.innerText === deck.subject) {
      option.remove()
    }
  }
}

function deleteCard(card) {
  fetch(cardsEndpoint+`/${card.id}`, {
    method: "DELETE"
  })
  const cardId = card.id
  const deleteCard = Card.all.find(card => card.id === cardId)
  const index = Card.all.indexOf(deleteCard)
  Card.all.splice(index, 1)
  document.getElementById(`Card ${card.id}`).remove()
}
