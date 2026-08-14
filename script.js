// ---- StudentRecord class: encapsulates the grading logic ----
// Given a name and a list of scores, this class works out the total,
// average, letter grade, and pass/fail status itself — so the rest of
// the app never has to duplicate that math.
class StudentRecord {
  constructor(id, name, scores) {
    this.id = id
    this.name = name
    this.scores = scores // array of numbers
    this.total = this.calculateTotal()
    this.average = this.calculateAverage()
    this.grade = this.calculateGrade()
    this.passed = this.average >= 50
  }

  // Adds up every score using a loop.
  calculateTotal() {
    let sum = 0
    for (let i = 0; i < this.scores.length; i++) {
      sum += this.scores[i]
    }
    return sum
  }

  // Divides the total by how many scores were entered. Guards against
  // dividing by zero if somehow no scores exist.
  calculateAverage() {
    return this.scores.length ? this.total / this.scores.length : 0
  }

  // Converts the average into a letter grade using a simple threshold
  // ladder (A down to F), checked from highest to lowest.
  calculateGrade() {
    const avg = this.average
    if (avg >= 70) return 'A'
    else if (avg >= 60) return 'B'
    else if (avg >= 50) return 'C'
    else if (avg >= 45) return 'D'
    else if (avg >= 40) return 'E'
    else return 'F'
  }
}

// Controller class: manages the list of student records, the form
// (including dynamically adding more score fields), storage, and
// rendering the record cards.
class GradeCalculatorApp {
  // Loads and rebuilds saved records, grabs DOM references, wires
  // events, renders the initial list.
  constructor() {
    this.storageKey = 'gradebook-records-v1'
    this.records = this.loadAndRebuild()

    this.form = document.getElementById('grade-form')
    this.nameInput = document.getElementById('name-input')
    this.scoresRow = document.getElementById('scores-row')
    this.errorMsg = document.getElementById('error-msg')
    this.recordsList = document.getElementById('records-list')
    this.emptyState = document.getElementById('empty-state')

    this.bindEvents()
    this.render()
  }

  // Reads raw saved data from localStorage (plain objects, since
  // JSON can't store class instances) and rebuilds each one as a real
  // StudentRecord so its calculation methods work again.
  loadAndRebuild() {
    try {
      const raw = localStorage.getItem(this.storageKey)
      const data = raw ? JSON.parse(raw) : []
      // rebuild as StudentRecord instances so methods are available
      return data.map((d) => new StudentRecord(d.id, d.name, d.scores))
    } catch (e) {
      return []
    }
  }

  // Persists the current records array to localStorage.
  save() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.records))
  }

  // Wires up the form submit and the "+ Add another score" button.
  bindEvents() {
    this.form.addEventListener('submit', (e) => {
      e.preventDefault()
      this.handleSubmit()
    })
    document.getElementById('add-score-btn').addEventListener('click', () => this.addScoreField())
  }

  // Dynamically adds one more empty score input box to the form, so a
  // student can have more than three assessment scores if needed.
  addScoreField() {
    const input = document.createElement('input')
    input.type = 'number'
    input.className = 'score-input'
    input.min = '0'
    input.max = '100'
    input.placeholder = 'Score ' + (this.scoresRow.children.length + 1)
    this.scoresRow.appendChild(input)
  }

  // Runs when the form is submitted. Collects every non-empty score
  // field, validates that a name was entered, at least 3 scores exist,
  // and all scores are within 0–100 — then creates a new StudentRecord
  // (which does the grading math itself), saves it, and resets the form.
  handleSubmit() {
    const name = this.nameInput.value.trim()
    const scoreInputs = document.querySelectorAll('.score-input')
    const scores = []

    // loop to collect and validate scores
    for (let i = 0; i < scoreInputs.length; i++) {
      const raw = scoreInputs[i].value.trim()
      if (raw !== '') {
        const num = Number(raw)
        if (!isNaN(num)) scores.push(num)
      }
    }

    if (!name) {
      this.errorMsg.textContent = "Please enter the student's name."
      return
    }
    if (scores.length < 3) {
      this.errorMsg.textContent = 'Enter at least three assessment scores.'
      return
    }
    const outOfRange = scores.some((s) => s < 0 || s > 100)
    if (outOfRange) {
      this.errorMsg.textContent = 'Scores must be between 0 and 100.'
      return
    }

    this.errorMsg.textContent = ''
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
    this.records.unshift(new StudentRecord(id, name, scores))
    this.save()
    this.form.reset()
    // reset dynamic score fields back to 3
    this.scoresRow.innerHTML = `
        <input type="number" class="score-input" min="0" max="100" placeholder="Score 1">
        <input type="number" class="score-input" min="0" max="100" placeholder="Score 2">
        <input type="number" class="score-input" min="0" max="100" placeholder="Score 3">
      `
    this.render()
  }

  // Removes a student's record by id.
  deleteRecord(id) {
    this.records = this.records.filter((r) => r.id !== id)
    this.save()
    this.render()
  }

  // Draws a card for every saved record, showing the scores, total,
  // average, grade pill, and a pass/fail badge (styled red if failed).
  render() {
    this.recordsList.innerHTML = ''
    if (this.records.length === 0) {
      this.emptyState.style.display = 'block'
      return
    }
    this.emptyState.style.display = 'none'

    this.records.forEach((r) => {
      const div = document.createElement('div')
      div.className = 'record' + (r.passed ? '' : ' fail')
      div.innerHTML = `
          <div class="record-top">
            <h3>${this.escape(r.name)}</h3>
            <span class="grade-pill">${r.grade}</span>
          </div>
          <div class="record-stats">
            <span>Scores: <b>${r.scores.join(', ')}</b></span>
            <span>Total: <b>${r.total}</b></span>
            <span>Average: <b>${r.average.toFixed(1)}</b></span>
          </div>
          <div class="status ${r.passed ? 'pass' : 'fail'}">${r.passed ? 'PASS' : 'FAIL'}</div>
        `
      const delBtn = document.createElement('button')
      delBtn.className = 'del-btn'
      delBtn.textContent = 'Delete record'
      delBtn.addEventListener('click', () => this.deleteRecord(r.id))
      div.appendChild(delBtn)
      this.recordsList.appendChild(div)
    })
  }

  escape(str) {
    const div = document.createElement('div')
    div.textContent = str
    return div.innerHTML
  }
}

document.addEventListener('DOMContentLoaded', () => new GradeCalculatorApp())
