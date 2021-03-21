const decksEndpoint = "http://localhost:3000/api/v1/decks"
const cardsEndpoint = "http://localhost:3000/api/v1/cards"

document.addEventListener('DOMContentLoaded', () => {
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
