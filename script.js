async function startQuiz() {
  const gameMenu = document.getElementById('menu-screen');
  const quizContainer = document.getElementById('quiz-container');

  // Hide and disable menu screen
  gameMenu.style.opacity = "0";
  setTimeout(() => {
    gameMenu.style.display = "none";
    
    // Show quiz screen
    quizContainer.style.display = "flex";
    quizContainer.style.opacity = "1";
  }, 600);
}

// End the game, show score
function endGame() {
  console.log("Game has ended");
}

async function nextQuestion(e) {
  // Get the question container
  const currentQuestion = e.parentNode.parentNode;
  const nextQuestion = currentQuestion.nextElementSibling;

  // If there is no more question, activate end game
  if (nextQuestion === null) {
    return endGame();
  }

  // Add time if correct else deducted time
   
  // Show next question
  currentQuestion.classList.remove('active');
  currentQuestion.style.display = "flex";
  currentQuestion.style.flexDirection = "column";

  setTimeout(() => {
    currentQuestion.display = "none";
    nextQuestion.classList.add('active');
  }, 500);
}

// Delay/Sleep function
function sleep(ms) {
  return new Promise((res) => setTimeout(res, ms));
}