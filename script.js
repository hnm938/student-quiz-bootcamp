// Timer time
var time = 0;
// Fuction that runs every tick
var timerTick = () => {
  var timerOutput = document.getElementById("timer-output");
  // Format seconds to a readable timer (00:00:00)
  var seconds = time % 60;
  var minutes = Math.floor(time / 60);

  // Check if the timer ran out
  if (time <= 0) {
    // If there is no time left end the quiz
    return endQuiz();
  }

  timerOutput.innerHTML = `00:${minutes < 10 ? "0" : ""}${minutes}:${
    seconds < 10 ? "0" : ""
  }${seconds}`;

  time--;
};
// Timer error function
var timerError = () => {
  console.log("The drift exceeded the interval.");
};
// Create a new timer with a tick of 1 second
var timer = new Timer(time, timerTick, 1000, timerError);

// The current score of the current quiz running
var quizScore = 0;

const MAX_SCORE_COUNT = 7;
const HIGH_SCORES = "high-scores";

const highScoreString = localStorage.getItem(HIGH_SCORES);
const highScores = JSON.parse(highScoreString) ?? [];

function showHighScores() {
  const highScores = JSON.parse(localStorage.getItem(HIGH_SCORES)) ?? [];
  const highScoreList = document.getElementById(HIGH_SCORES);

  highScoreList.innerHTML = highScores
    .map(
      (score) =>
        `<li>${score.score} points - ${score.name}  <br/><span style="margin: 0; padding: 0; font-size: 0.5em">${score.savedDate}</span>`
    )
    .join("");
}
function saveHighScore(score, savedDate, name) {
  const newScore = { score, savedDate, name };
  // 1. Add to list
  highScores.push(newScore);
  // 2. Sort the list
  highScores.sort((a, b) => b.score - a.score);
  // 3. Select new list
  highScores.splice(MAX_SCORE_COUNT);
  // 4. Save to local storage
  localStorage.setItem(HIGH_SCORES, JSON.stringify(highScores));
}
function checkHighScore(score) {
  const highScores = JSON.parse(localStorage.getItem(HIGH_SCORES)) ?? [];
  const lowestScore = highScores[MAX_SCORE_COUNT - 1]?.score ?? 0;
  if (score > lowestScore) {
    saveHighScore(score, highScores);
    showHighScores();
  }

  console.log(highScores);
}

// on window load
function init() {
  // Show high scores and Reset current game score score
  showHighScores();
  quizScore = 0;
}
window.onload = () => {
  init();
};

// Start the quiz
async function startQuiz() {
  const quizMenu = document.getElementById("menu-screen");
  const quizContainer = document.getElementById("quiz-container");
  const quizOverOverlay = document.getElementById("quiz-over-overlay");

  const timerContainer = document.getElementById("counters-container");
  const scoreCounter = document.getElementById("score-counter");

  // Hide quiz over overlay
  quizOverOverlay.classList.remove("active");

  // Set score display
  scoreCounter.innerHTML = `Score: ${quizScore}`;

  // Show timer and Add default time
  timerContainer.classList.add("active");
  time += 60;
  timer.start();

  // Hide and disable menu screen
  quizMenu.style.opacity = "0";
  setTimeout(() => {
    quizMenu.style.display = "none";

    // Show quiz screen
    quizContainer.style.display = "flex";
    quizContainer.style.opacity = "1";
  }, 600);

  // Show first question
  setTimeout(() => {
    document.querySelector(".quiz-question").classList.add("active");
  }, 650);
}

// If time runs out, you lose and end the quiz.
function endQuiz() {
  const quizOverOverlay = document.getElementById("quiz-over-overlay");
  quizOverOverlay.classList.add("active");
  timer.stop();
}
// If time has not run out, and all the questions are done show the end score.
async function quizCompleted() {
  // Alert the user they have completed the quiz
  alert(`
    QUIZ COMPLETE
    SCORE ADDED TO LEADERBOARD
    ----
    Score: ${quizScore}
    Seconds Left: ${time}
  `);

  // Save the current score and date the score was saved
  const newDate = new Date();
  const formattedDate = newDate.toLocaleString("en-US", { dataStyle: "short" });
  const userName = prompt("Please enter your name or initals");
  saveHighScore(quizScore, formattedDate, userName);

  // Refresh the window to restart
  window.location.reload();
}

async function nextQuestion(e) {
  const scoreCounter = document.getElementById("score-counter");

  // Check if the score is in the negatives
  if (quizScore <= -1) {
    return endQuiz();
  }

  // Check if answer was correct
  if (!e.classList.contains("correct")) {
    // If the answer was incorrect, decrease time
    quizScore -= 3;
    time -= 5;

    // Set score display
    scoreCounter.innerHTML = `Score: ${quizScore}`;

    alert(`
    ${" ".repeat(40)}---------------------
    ${" ".repeat(40)}|❌INCORRECT❌|
    ${" ".repeat(40)}|     -5 seconds      |
    ${" ".repeat(40)}---------------------
    `);
  } else {
    time += 10;
    quizScore += 10;

    // Set score display
    scoreCounter.innerHTML = `Score: ${quizScore}`;

    alert(`
    ${" ".repeat(40)}---------------------
    ${" ".repeat(40)}|✅  CORRECT  ✅|
    ${" ".repeat(40)}|    +10 seconds     |
    ${" ".repeat(40)}---------------------
    `);
  }

  // Get the question container
  const currentQuestion = e.parentNode.parentNode;
  const nextQuestion = currentQuestion.nextElementSibling;

  currentQuestion.classList.remove("active");
  currentQuestion.style.display = "flex";
  currentQuestion.style.flexDirection = "column";

  // If there is no more question, active show end screen
  if (nextQuestion === null) {
    return quizCompleted();
  }

  // Show next question
  setTimeout(() => {
    currentQuestion.display = "none";
    nextQuestion.classList.add("active");
  }, 500);
}

// Delay/Sleep function
function sleep(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

// Simple programmable timer
function Timer(time, workerFunc, interval, errorFunc) {
  var that = this;
  var expected, timeout;
  this.interval = interval;

  this.start = () => {
    expected = Date.now() + this.interval;
    timeout = setTimeout(step, this.interval);
  };

  this.stop = () => {
    clearTimeout(timeout);
  };

  function step() {
    var drift = Date.now() - expected;
    if (drift > that.interval) {
      if (errorFunc) errorFunc();
    }
    workerFunc();
    expected += that.interval;
    timeout = setTimeout(step, Math.max(0, that.interval - drift));
  }
}
