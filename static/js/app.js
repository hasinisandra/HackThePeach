// Existing variables...
let timerInterval;
let timeLeft;
let zombies = [];
let butterflies = [];
let completedItems = 0;

const landingPage = document.getElementById('landing');
const gamePage = document.getElementById('game');
const bucketForm = document.getElementById('bucketForm');
const bucketList = document.getElementById('bucketList');
const polaroidString = document.getElementById('polaroidString');
const canvas = document.getElementById('zombieCanvas');
const ctx = canvas.getContext('2d');

// New Minigame Variables
const minigameModal = document.getElementById('minigameModal');
const zombieTarget = document.getElementById('zombieTarget');
let minigameCallback;

// Start Game (already there)
bucketForm.addEventListener('submit', (e) => {
  e.preventDefault();
  startGame();
});

// Update handleCheck function
function handleCheck(itemDiv, itemText, index) {
  // Show the minigame first
  openMinigame(() => {
    // After minigame is completed
    uploadPicture(itemDiv, itemText, index);
  });
}

// Open Minigame
function openMinigame(callback) {
  minigameModal.style.display = 'block';
  minigameCallback = callback;

  zombieTarget.style.left = '0px';
  moveZombie();
}

// Move the zombie across screen
function moveZombie() {
  let position = 0;
  const interval = setInterval(() => {
    position += 5;
    zombieTarget.style.left = position + 'px';

    if (position > 300) {
      clearInterval(interval);
      closeMinigame(false); // you missed!
    }
  }, 100);
}

// Clicking the zombie
zombieTarget.addEventListener('click', () => {
  closeMinigame(true);
});

// Close Minigame
function closeMinigame(success) {
  minigameModal.style.display = 'none';
  if (success && minigameCallback) {
    minigameCallback();
  } else {
    alert('You missed! Try checking the item again!');
  }
}
