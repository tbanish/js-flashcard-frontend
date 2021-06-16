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

  static startTest() {
    if (document.querySelector(".test-header").innerText === "Test Box") {
      alert("select a deck first")
      return
    }

    const deck = Deck.findDeckBySubject(document.querySelector(".test-header").innerText)
    const cards = deck.cards

    const newTest = new Test
    newTest.deckId = deck.id
    newTest.cardQueue = cards
    newTest.duration = 0
    let currentCard = newTest.cardQueue.shift()

    const newTimer = new Timer(newTest)
    newTimer.startTimer()
    newTimer.activatePauseButton()
    newTest.timer = newTimer
    newTest.renderNextCard(currentCard)
  }

  renderNextCard(currentCard) {
    const question = currentCard.question
    const answer = currentCard.answer

    document.querySelector(".test-card-question").innerText = question
    document.querySelector(".test-card-answer").innerText = answer

    let right = document.createElement("button")
    right.className = "right answer btn"
    right.innerHTML = '&#10003;'
    document.querySelector(".test-buttons").appendChild(right)

    let wrong = document.createElement("button")
    wrong.className = "wrong answer btn"
    wrong.innerHTML = "X"
    document.querySelector(".test-buttons").appendChild(wrong)

    right.addEventListener("click", (e) => {
      this.logAnswer(e, currentCard)
    })

    wrong.addEventListener("click", (e) => {
      this.logAnswer(e, currentCard)
    })
  }

  logAnswer(e, currentCard) {
    if (e.target.className === "right answer btn") {
      this.correctAnswers.push(currentCard)
      document.querySelector(".correct-answers.score").innerText = this.correctAnswers.length
      flipCardBack()
      removeAnswerButtons()
      this.cardsLeftInQueue()
    } else {
      this.incorrectAnswers.push(currentCard)
      document.querySelector(".incorrect-answers.score").innerText = this.incorrectAnswers.length
      flipCardBack()
      removeAnswerButtons()
      this.cardsLeftInQueue()
    }
  }

  cardsLeftInQueue() {
    if (this.cardQueue.length > 0) {
      let nextCard = this.cardQueue.shift()
      this.renderNextCard(nextCard)
    } else {
      this.endTest()
    }
  }

   endTest() {
    this.timer.stopTimer(this.interval)
    const correct = this.correctAnswers.length
    const incorrect = this.incorrectAnswers.length
    const total = correct + incorrect
    const score = Math.ceil((correct/total) * 100)

    document.querySelector(".test-header").innerText += ": Test is Over"
    document.querySelector(".percentage").innerText = ` ${score}%`
    const clearTest = document.createElement("button")
    clearTest.innerText = "clear"
    clearTest.className = "clear btn"
    document.querySelector(".test-buttons").appendChild(clearTest)

    const saveTest = document.createElement("button")
    saveTest.innerText = "save"
    saveTest.className = "save btn"
    document.querySelector(".test-buttons").appendChild(saveTest)

    clearTest.addEventListener("click", () => this.handleClearTestClick())
    saveTest.addEventListener("click", () => this.handleSaveTestClick())
  }

  handleClearTestClick() {
    Test.all.splice(Test.all.indexOf(this))
    clearTestBox()
    Test.clearStats()
    Timer.clearTimer()
  }

  handleSaveTestClick() {
    const correct = this.correctAnswers.length
    const incorrect = this.incorrectAnswers.length
    const total =  correct + incorrect
    const score = Math.ceil((correct/total) * 100)
    this.score = score
    this.correctIds = []
    this.incorrectIds = []

    for(const answer of this.correctAnswers) {
      this.correctIds.push(answer.id)
    }

    for(const answer of this.incorrectAnswers) {
      this.incorrectIds.push(answer.id)
    }

    Timer.clearTimer()
    Test.all.splice(Test.all.indexOf(this))
    postTest(this)
    clearTestBox()
    Test.clearStats()
  }

  static findTestsByDeckId(deckId) {
    const tests = Test.all.filter(test => test.deckId === deckId)
    return tests
  }

  static clearStats() {
    document.querySelector(".stat-list").remove()
    document.querySelector(".stats-header").innerText = "Stats"
    const statList = document.createElement("div")
    statList.className = "stat-list"
    document.querySelector(".stats").appendChild(statList)
    document.querySelector(".percentage").innerText = ""
  }

  static renderTestHeader(subject) {
    let deck = Deck.findDeckBySubject(subject)

    if (document.querySelector(".test-header").innerText !== "Test Box") {
      document.querySelector(".test-header").innerText = "Test Box"
    }

    if (subject === "--select a deck to test your knowledge--") {
      return
    }

    const header = document.querySelector(".test-header")
    header.innerText = subject

    document.querySelector(".test-card-question").innerText = ""
    document.querySelector(".test-card-answer").innerText = ""
    document.querySelector(".test-card").className = "test-card"
    document.querySelector(".incorrect-answers.score").innerText = 0
    document.querySelector(".correct-answers.score").innerText = 0
  }

  static renderTestStats(subject) {
    let deck = Deck.findDeckBySubject(subject)
    const tests = this.findTestsByDeckId(deck.id)

    document.querySelector(".stats-header").innerText = `Stats: ${subject}`

    for (const test of tests) {
      this.renderStats(test)
    }
  }

  static renderStats(test) {
    const statList = document.querySelector(".stat-list")
    const date = test.date
    const duration = test.duration
    const score = test.score

    const statDiv = document.createElement("div")
    const dateTag = document.createElement("p")
    const durationTag = document.createElement("p")
    const scoreTag = document.createElement("p")

    dateTag.innerText = date
    dateTag.className = "stat-date"
    scoreTag.innerText = `${score}%`
    scoreTag.className = "stat-score"
    statDiv.className = "stat"

    if (duration !== null) {
      durationTag.innerText = `${duration} mins`
    } else {
      durationTag.innerText = `--`
    }

    durationTag.className = "stat-duration"

    statList.appendChild(statDiv)
    statDiv.appendChild(dateTag)
    statDiv.appendChild(durationTag)
    statDiv.appendChild(scoreTag)
  }
}

Test.all = [];
