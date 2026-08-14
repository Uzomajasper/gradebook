# Gradebook — Student Grade Calculator

An app for calculating a student's grade from their assessment scores: total, average, letter grade (A–F), and pass/fail status. Records are saved in the browser's Local Storage.

## What it does

- Input a student's name
- Input at least three assessment scores (with a button to add more)
- Calculate total score
- Calculate average score
- Assign a letter grade (A–F) based on the average
- Display pass/fail status
- Display all entered student records
- Delete a record
- Saves everything with Local Storage

## Requirements (planning)

1. A user can enter a student's name and at least three scores, then click "Calculate & save" to generate a record.
2. The form must reject submission if the name is missing, fewer than three scores are entered, or any score is outside 0–100.
3. Each saved record must show the total, average, letter grade, and a clear PASS/FAIL status.
4. A user can add more than three score fields if a student has extra assessments.
5. A user can delete a student's record permanently.

## Classes / functions used

- **`StudentRecord`** — data model that also does the grading math itself:
  - `calculateTotal()` — sums all scores with a loop
  - `calculateAverage()` — total ÷ number of scores
  - `calculateGrade()` — converts the average to a letter grade (A ≥ 70, B ≥ 60, C ≥ 50, D ≥ 45, E ≥ 40, else F)
  - `passed` — `true` if average ≥ 50
- **`GradeCalculatorApp`** — the controller class. Key methods:
  - `loadAndRebuild()` / `save()` — Local Storage read/write (rebuilds saved data back into `StudentRecord` instances)
  - `bindEvents()` — wires up the form and "add another score" button
  - `addScoreField()` — dynamically adds an extra score input
  - `handleSubmit()` — validates input and creates a new `StudentRecord`
  - `deleteRecord(id)` — removes a record
  - `render()` — draws each record as a card

## Expected input / output

| Action             | Input                                 | Output                                                           |
| ------------------ | ------------------------------------- | ---------------------------------------------------------------- |
| Valid record       | Name: `"Chidi"`, Scores: `70, 65, 80` | Card shows Total: 215, Average: 71.7, Grade: A, status: PASS     |
| Missing name       | Name blank, scores filled             | Error: _"Please enter the student's name."_ Nothing saved        |
| Too few scores     | Only 2 scores entered                 | Error: _"Enter at least three assessment scores."_ Nothing saved |
| Out-of-range score | Score: `150`                          | Error: _"Scores must be between 0 and 100."_ Nothing saved       |
| Failing average    | Scores: `30, 25, 40`                  | Card shows Grade: F, status: FAIL (styled in red)                |

## How to run

1. Download/clone this folder (`index.html`, `style.css`, `script.js`).
2. Open `index.html` directly in your browser.
3. No installation or server required.

## Files

```
4-grade-calculator/
├── index.html   — page structure
├── style.css    — styling
├── script.js    — app logic (StudentRecord, GradeCalculatorApp classes)
└── README.md    — this file
```
