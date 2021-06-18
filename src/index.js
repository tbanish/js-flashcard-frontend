const decksEndpoint = "http://localhost:3000/api/v1/decks"
const cardsEndpoint = "http://localhost:3000/api/v1/cards"
const testsEndpoint = "http://localhost:3000/api/v1/tests"

document.addEventListener('DOMContentLoaded', () => {
  const newDeckForm = document.getElementById("new-deck-form")
  const newCardForm = document.getElementById("new-card-form")
  const startTest = document.querySelector(".start-test")
  const testCard = document.querySelector(".test-card")

  newCardForm.addEventListener("submit", (e) => newCardFormHandler(e))
  newDeckForm.addEventListener("submit", (e) => newDeckFormHandler(e))
  startTest.addEventListener("click", () => Test.startTest())
  testCard.addEventListener("click", () => flipCard())
  document.querySelector(".pause").disabled = true
  document.querySelector(".resume").disabled = true

  loadDecks();
  loadTests();
})

window.onmousemove = function(e) {mousePosition(e)}
window.onscroll = function() {dropDownMenu()}

function dropDownMenu() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    document.querySelector(".menu").style.top = "0";
    setTimeout(function() {document.querySelector(".menu").style.top = "-50px"}, 5000)
  } else {
    document.querySelector(".menu").style.top = "-50px";
  }
}

function mousePosition(e) {
  if (e.clientX > 900 && e.clientY < 200) {
    document.querySelector(".nav-bar").style.top = "0";
    document.querySelector(".menu").style.top = "-50px";
  } else if (e.clientX < 900) {
    document.querySelector(".nav-bar").style.top = "-200px";
  }
}

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

function loadTests() {
  fetch(testsEndpoint)
  .then(resp => resp.json())
  .then(tests => {
    for (const test of tests.data) {
      const score = test.attributes.score
      const duration = test.attributes.duration
      const correctIds = test.attributes.correct_ids
      const incorrectIds = test.attributes.incorrect_ids
      const deckId = test.attributes.deck_id
      const testId = parseInt(test.id)
      const date = new Date(test.attributes.created_at)
      const newTest = new Test(testId, duration, score, correctIds, incorrectIds, deckId, date.toLocaleDateString())
    }
  })

  const testDeckSelection = document.querySelector('.test-deck-selection')
  testDeckSelection.addEventListener("change", (e) => handleTestSelection(e))

  const statDeckSelection = document.querySelector('.stat-deck-selection')
  statDeckSelection.addEventListener("change", (e) => handleStatSelection(e))
}

function handleTestSelection(e) {
  let subject = e.target.value
  Test.renderTestHeader(subject)
}

function handleStatSelection(e) {
  let subject = e.target.value
  Test.clearStats()
  Test.removeDetails()

  if (subject !== "--select a deck to review test stats--") {
    Test.clearStats()
    Test.renderTestStats(subject)
  }
}

function shuffleCards(cards) {
  let currentIndex = cards.length
  let randomIndex

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--

    [cards[currentIndex], cards[randomIndex]] = [cards[randomIndex], cards[currentIndex]]
  }

  return cards
}

function clearTestBox() {
  document.querySelector(".test-card-question").innerText = "Ready to test your knowledge? (If your answer is yes, click here.)"
  document.querySelector(".test-card-answer").innerText = "Select a deck from the menu above and then click start to begin. Once the test is over you will be given the chance to save or discard your results."
  document.querySelector(".test-header").innerText = "Test Box"

  document.querySelector(".test-deck-selection").options[0].selected = 'selected'
  document.querySelector(".correct-answers.score").innerText = 0
  document.querySelector(".incorrect-answers.score").innerText = 0

  if (document.querySelector(".clear.btn")) {
    document.querySelector(".clear.btn").remove()
    document.querySelector(".save.btn").remove()
  }
}

function removeAnswerButtons() {
  if (document.querySelector(".right")) {
    document.querySelector(".right").remove()
    document.querySelector(".wrong").remove()
  }
}

function flipCard() {
  if (document.querySelector(".test-card.is-flipped")) {
    document.querySelector(".test-card.is-flipped").className = "test-card"
  } else {
    document.querySelector(".test-card").className = "test-card is-flipped"
  }
}

function flipCardBack() {
  if (document.querySelector(".test-card.is-flipped")) {
    document.querySelector(".test-card.is-flipped").className = "test-card"
  }
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
  const cards = deck.cards
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

  editCardButton.addEventListener("click", () => {
    if (document.querySelector(".edit-card-form") === null) {
      renderEditCardForm(card)
    } else {
      removeEditCardForm()
    }
  })
}

function renderDeleteCardButton(card) {
  const li = document.getElementById(`card-${card.id}`)

  const deleteCardButton = document.createElement("button")

  deleteCardButton.id = `delete-card-${card.id}`
  deleteCardButton.classList.add("delete-card-button")
  deleteCardButton.innerText = "delete card"
  li.appendChild(deleteCardButton)

  deleteCardButton.addEventListener("click", () => deleteCard(card))
}

function renderDeleteDeckButton(deck) {
  const li = document.getElementById(`deck-${deck.id}`)
  const deleteDeckButton = document.createElement("button")

  deleteDeckButton.id = `delete-deck-${deck.id}`
  deleteDeckButton.classList.add("delete-deck-button")
  deleteDeckButton.innerText = "delete deck"
  li.appendChild(deleteDeckButton)

  deleteDeckButton.addEventListener("click", () => deleteDeck(deck))
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
  const buttonLineBreak = document.createElement("br")

  editForm.id = `deck-${deck.id}-edit`
  editForm.classList.add("edit-deck-form")
  subjectInput.id = `deck-${deck.id}-subject-input`
  subjectInput.value = `${deck.subject}`
  subjectInputLabel.setAttribute("for", `${deck.id}-subject-input`)
  subjectInputLabel.innerText = "Subject: "
  submitButton.id = `${deck.id}-submit-button`
  submitButton.innerText = "submit"
  submitButton.classList.add("btn")
  closeButton.id = `${deck.id}-close-button`
  closeButton.innerText = "close"
  closeButton.classList.add("btn")
  header.innerText = "Edit Deck"

  editFormContainer.appendChild(editForm)
  editForm.appendChild(header)
  editForm.appendChild(subjectInputLabel)
  editForm.appendChild(subjectInput)
  editForm.appendChild(buttonLineBreak)
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

function renderEditCardForm(card) {
  const editCardForm = document.createElement("FORM")
  const questionInputLabel = document.createElement("LABEL")
  const questionInput = document.createElement("textarea")
  const answerInputLabel = document.createElement("LABEL")
  const answerInput = document.createElement("textarea")
  const submitButton = document.createElement("button")
  const header = document.createElement("h3")
  const closeButton = document.createElement("button")
  const editFormContainer = document.getElementById("edit-form-container")
  const questionLineBreak1 = document.createElement("br")
  const questionLineBreak2 = document.createElement("br")
  const answerLineBreak1 = document.createElement("br")
  const answerLineBreak2 = document.createElement("br")

  editCardForm.id = `Card-${card.id}-edit`
  editCardForm.classList.add("edit-card-form")
  questionInput.id = `Card-${card.id}-question-input`
  questionInput.value = `${card.question}`
  questionInputLabel.setAttribute("for", `Card-${card.id}-question-input`)
  questionInputLabel.innerText = "Question: "
  answerInput.id = `Card-${card.id}-answer-input`
  answerInput.value = `${card.answer}`
  answerInputLabel.setAttribute("for", `Card-${card.id}-answer-input`)
  answerInputLabel.innerText = "Answer: "
  submitButton.innerText = "edit card"
  submitButton.classList.add("btn")
  closeButton.id = `Card-${card.id}-close-button`
  closeButton.innerText = "close"
  closeButton.classList.add("btn")
  header.innerText = "Edit Card"

  editFormContainer.appendChild(editCardForm)
  editCardForm.appendChild(header)
  editCardForm.appendChild(questionInputLabel)
  editCardForm.appendChild(questionInput)
  editCardForm.appendChild(questionLineBreak1)
  editCardForm.appendChild(questionLineBreak2)
  editCardForm.appendChild(answerInputLabel)
  editCardForm.appendChild(answerInput)
  editCardForm.appendChild(answerLineBreak1)
  editCardForm.appendChild(answerLineBreak2)
  editCardForm.appendChild(submitButton)
  editCardForm.appendChild(closeButton)

  editCardForm.addEventListener("submit", (e) => {
    editCardFormHandler(e)
  })

  closeButton.addEventListener("click", (e) => {
    e.preventDefault()
    removeEditCardForm()})
}

function removeEditCardForm(){
  document.querySelector(".edit-card-form").remove()
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
    const deck = Deck.findDeckBySubject(deckSubject)
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
  const deck = Deck.findById(deckId)
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
      const deck = Deck.findById(updatedDeck.id)
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
  const cardId = parseInt(e.target.id.split("-")[1])
  const card = Card.findById(cardId)
  const question = document.getElementById(`Card-${cardId}-question-input`).value
  const answer = document.getElementById(`Card-${cardId}-answer-input`).value
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
      const oldCard = Card.findById(updatedCard.id)
      oldCard.question = updatedCard.question
      oldCard.answer = updatedCard.answer
      document.getElementById(`card-${updatedCard.id}-question`).innerText = updatedCard.question
      document.getElementById(`card-${updatedCard.id}-answer`).innerText = updatedCard.answer
      document.querySelector(".edit-card-form").remove()
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
  const selectTag = document.querySelector("select")
  Deck.delete(deck)
  document.getElementById(`deck-${deck.id}`).remove()

  for (const option of selectTag) {
    if (option.innerText === deck.subject) {
      option.remove()
    }
  }
  removeCards()
}

function deleteCard(card) {
  fetch(cardsEndpoint+`/${card.id}`, {
    method: "DELETE"
  })
  Card.delete(card)
  document.getElementById(`card-${card.id}`).remove()
  document.getElementById("card-list-header").innerText = ""
}

function postTest(newTest) {
  let bodyData = {
    score: newTest.score,
    correct_ids: newTest.correctIds.join(", "),
    incorrect_ids: newTest.incorrectIds.join(", "),
    deck_id: newTest.deckId,
    duration: newTest.duration
  }
  fetch(testsEndpoint, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(bodyData)
  })
  .then(resp => resp.json())
  .then(test => {
    const score = test.score
    const correctIds = test.correct_ids
    const incorrectIds = test.incorrect_ids
    const deckId = test.deck_id
    const testId = parseInt(test.id)
    const date = new Date(test.created_at)
    const duration = test.duration
    const newTest = new Test(testId, duration, score, correctIds, incorrectIds, deckId, date.toLocaleDateString())
  })
}
