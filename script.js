const gameBoard = document.getElementById('game-board');
const restartButton = document.getElementById('restart');
const movesDisplay = document.getElementById('moves');
const timerDisplay = document.getElementById('timer');

const cardSymbols = ['🍕', '🍕', '🍎', '🍎', '🐱', '🐱', '🌙', '🌙'];
let flippedCards = [];
let lockBoard = false;
let moves = 0;
let matchedPairs = 0;
let timer;
let secondsElapsed = 0;

// Shuffle function
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Initialize the game
function initializeGame() {
  const shuffledSymbols = shuffle([...cardSymbols]);
  gameBoard.innerHTML = ''; // Clear the board
  shuffledSymbols.forEach((symbol) => createCard(symbol));

  // Reset stats
  moves = 0;
  matchedPairs = 0;
  secondsElapsed = 0;
  movesDisplay.textContent = moves;
  timerDisplay.textContent = '0:00';

  clearInterval(timer); // Stop any previous timer
  startTimer(); // Start a new timer
}

// Create a card element
function createCard(symbol) {
  const card = document.createElement('div');
  card.classList.add('card');
  card.innerHTML = `
    <div class="card-inner">
      <div class="card-front">?</div>
      <div class="card-back">${symbol}</div>
    </div>
  `;

  card.addEventListener('click', () => flipCard(card));
  gameBoard.appendChild(card);
}

// Handle card flipping
function flipCard(card) {
  if (lockBoard || card.classList.contains('flip')) return;

  card.classList.add('flip');
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    moves++;
    movesDisplay.textContent = moves;
    checkForMatch();
  }
}

// Check if the two cards match
function checkForMatch() {
  const [card1, card2] = flippedCards;
  const isMatch =
    card1.querySelector('.card-back').textContent ===
    card2.querySelector('.card-back').textContent;

  if (isMatch) {
    matchedPairs++;
    flippedCards = [];
    if (matchedPairs === cardSymbols.length / 2) {
      clearInterval(timer);
      setTimeout(() => alert(`You won in ${moves} moves and ${formatTime(secondsElapsed)}!`), 500);
    }
  } else {
    lockBoard = true;
    setTimeout(() => {
      card1.classList.remove('flip');
      card2.classList.remove('flip');
      flippedCards = [];
      lockBoard = false;
    }, 1000);
  }
}

// Start the timer
function startTimer() {
  timer = setInterval(() => {
    secondsElapsed++;
    timerDisplay.textContent = formatTime(secondsElapsed);
  }, 1000);
}

// Format time as MM:SS
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

// Restart the game
restartButton.addEventListener('click', initializeGame);

// Start the game on page load
initializeGame();
