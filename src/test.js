class Test {
  constructor(id, duration, score, correctIds, incorrectIds, deckId, date) {
    this.id = id
    this.duration = duration
    this.score = score
    this.correctIds = correctIds
    this.incorrectIds = incorrectIds
    this.deckId = deckId
    this.date = date
    Test.all.push(this)
    this.correctAnswers = []
    this.incorrectAnswers = []
  }

  static findTestsByDeckId(deckId) {
    const tests = Test.all.filter(test => test.deckId === deckId)
    return tests
  }
}

Test.all = [];
