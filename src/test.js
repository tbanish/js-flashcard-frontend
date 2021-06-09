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

  static renderTest(subject) {
    if (document.querySelector(".test-header")) {
      document.querySelector(".test-header").remove()
      document.querySelector(".btn.start").remove()
      document.querySelector(".btn.clear").remove()
    }

    if (subject === "--select a deck to test your knowledge--") {
      return
    }

    const testBox = document.querySelector(".test-box")
    const header = document.createElement("h3")
    const startButton = document.createElement("button")
    const clearButton = document.createElement("button")

    startButton.innerText = "Start Test"
    startButton.className = "btn start"
    clearButton.innerText = "Clear Test"
    clearButton.className = "btn clear"
    header.innerText = subject
    header.className = "test-header"
    testBox.appendChild(header)
    testBox.appendChild(startButton)
    testBox.appendChild(clearButton)
  }
}

Test.all = [];
