class Test {
  constructor(id, duration, score, correctIds, incorrectIds, deckId) {
    this.id = id
    this.duration = duration
    this.score = score
    this.correctIds = correctIds
    this.incorrectIds = incorrectIds
    this.deckId = deckId
    Test.all.push(this)
  }
}

Test.all = [];
