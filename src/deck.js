class Deck {
  constructor(id, subject) {
    this.id = id
    this.subject = subject
    Deck.all.push(this)
  }
}

Deck.all= [];
