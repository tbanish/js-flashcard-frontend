class Timer {
  constructor(test) {
    this.test = test
  }

  static clearTimer() {
    document.querySelector(".timer-header").innerText = "00:00:00"
  }

  activatePauseButton() {
    document.querySelector(".pause").addEventListener("click", () => this.stopTimer())
  }

  activateResumeButton() {
    document.querySelector(".resume").addEventListener("click", () => this.resumeTimer())
  }

  startTimer() {
    const timer = this
    const interval = setInterval(function() {
      timer.timeConverter()
    }, 1000)
    this.test.interval = interval
  }

  clearTimer() {
    clearInterval(this.test.interval)
  }

  stopTimer() {
    this.activateResumeButton()
    clearInterval(this.test.interval)
  }

  resumeTimer() {
    clearInterval(this.test.interval)
    this.startTimer()
  }

  timeConverter() {
      this.test.duration += 1000
      let ms = this.test.duration

      let seconds = ms / 1000
      let hours = parseInt( seconds / 3600 )
      seconds = seconds % 3600
      let minutes = parseInt( seconds / 60 )
      seconds = seconds % 60;

      if (minutes < 10) {
        minutes = `0${minutes}`
      }

      if (seconds < 10) {
        seconds = `0${seconds}`
      }

      if (hours < 10) {
       hours = `0${hours}`
      }
      document.querySelector(".timer-header").innerText = `${hours}:${minutes}:${seconds}`
  }
}
