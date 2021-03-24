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

  if (document.getElementById(`${deck.subject}-edit-button`) === null) {
    cards.forEach(card => card.renderCard())
    renderEditDeleteDeckButtons(e)

    const questionCollection = document.querySelectorAll(".card-questions")
    questionCollection.forEach(question => {

      question.addEventListener("click", (e) => {
        renderOrRemoveAnswer(e)
      })
    })
  } else if (ol === null) {
    document.getElementById(`${deck.subject}-edit-button`).remove()
    document.getElementById(`${deck.subject}-delete-button`).remove()
    if (document.getElementById(`${e.target.innerText}-edit-form`) != null) {
      document.getElementById(`${e.target.innerText}-edit-form`).remove()
    }
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

  deleteDeckButton.addEventListener("click", (e) => {
    const subject = e.target.id.split("-")[0]
    const deck = Deck.all.find(deck => deck.subject === subject)
    deleteDeck(deck)
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
  let cardDiv = document.createElement("div")
  cardDiv.id = `Card ${cardId} div`
  e.target.parentElement.appendChild(cardDiv)

  if (document.getElementById(`Card ${cardId} div`).childElementCount === 0 && e.target.id === `Card ${cardId} question` && document.getElementById(`Card ${cardId}-edit-form`) === null) {
    const answer = document.createElement("p")
    answer.innerText = `${card.answer}`
    answer.id = `answer ${cardId}`
    cardDiv.appendChild(answer)
    renderEditDeleteCardButtons(e, cardDiv)
  } else if (e.target.id === `answer ${cardId}`) {
    document.getElementById(`Card ${cardId} div`).remove()
    document.getElementById(`Card ${cardId} div`).remove()
  } else if (document.getElementById(`Card ${cardId} div`).childElementCount > 0 && e.target.id === `Card ${cardId} question`) {
    document.getElementById(`Card ${cardId} div`).remove()
    document.getElementById(`Card ${cardId} div`).remove()
  }
}

function renderEditDeleteCardButtons(e, cardDiv) {
  const editCardButton = document.createElement("button")
  const deleteCardButton = document.createElement("button")
  editCardButton.innerText = "edit card"
  deleteCardButton.innerText = "delete card"
  editCardButton.id = `${e.target.id}-edit-button`
  deleteCardButton.id = `${e.target.id}-delete-button`

  cardDiv.appendChild(editCardButton)
  cardDiv.appendChild(deleteCardButton)

  editCardButton.addEventListener("click", (e) => {
    if (document.getElementById(`${e.target.id.split("-")[0]}-edit-form`) === null) {
      renderEditCardForm(e)
    } else {
      const cardId = parseInt(e.target.id.split("-")[0].split(" ")[1])
      removeEditCardForm(cardId)
    }
  })

  deleteCardButton.addEventListener("click", (e) => {
    const cardId = parseInt(e.target.id.split(" ")[1])
    const card = Card.all.find(card => card.id === cardId)
    deleteCard(card)
  })
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
    if (card.errors === undefined) {
      const id = card.id
      const question = card.question
      const answer = card.answer
      const deckId = card.deck_id
      const newCard = new Card(id, question, answer, deckId)

      document.querySelector('[name="question"]').value = ""
      document.querySelector('[name="answer"]').value = ""
      document.querySelector("select").value = "default-option"
    } else {
      card.errors.forEach(error => {
        alert(error)
      })
    }
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
    debugger
    if (updatedDeck.errors === undefined) {
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
