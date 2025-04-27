// Select elements
const landingPage = document.getElementById('landing');
const gamePage = document.getElementById('game');
const bucketForm = document.getElementById('bucketForm');
const bucketList = document.getElementById('bucketList');
const polaroidString = document.getElementById('polaroidString');
const canvas = document.getElementById('zombieCanvas');
const ctx = canvas.getContext('2d');
const timerDisplay = document.getElementById('timer');
const minigameModal = document.getElementById('minigameModal');
const zombieTarget = document.getElementById('zombieTarget');

let zombies = [];
let completedItems = 0;
let bucketItems = [];
let timeLeft;
let timerInterval;
let minigameCallback;

// Start the game
bucketForm.addEventListener('submit', (e) => {
    e.preventDefault();
    startGame();
});

// Start the game function
function startGame() {
    landingPage.style.display = 'none';
    gamePage.style.display = 'block';

    // Get time limit
    const timeLimit = document.getElementById('timeLimit').value;
    timeLeft = parseInt(timeLimit) * 60; // convert minutes to seconds
    startTimer();

    // Setup bucket list
    const inputs = document.querySelectorAll('#inputs input');
    bucketItems = [];
    bucketList.innerHTML = '';
    polaroidString.innerHTML = '';
    inputs.forEach((input, index) => {
        const itemText = input.value;
        bucketItems.push({ text: itemText, completed: false });

        const itemDiv = document.createElement('div');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.dataset.index = index;

        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                handleCheck(itemDiv, itemText, index);
            }
        });

        itemDiv.appendChild(checkbox);
        itemDiv.appendChild(document.createTextNode(itemText));
        bucketList.appendChild(itemDiv);
    });

    // Setup zombies
    setupZombies();
    animateCanvas();
}

// Timer function
function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            alert('Time is up! The world ended...');
            window.location.reload();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Handle checklist item checked
function handleCheck(itemDiv, itemText, index) {
    openMinigame(() => {
        uploadPicture(itemDiv, itemText, index);
    });
}

// Upload picture after winning minigame
function uploadPicture(itemDiv, itemText, index) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.style.display = 'none';
    document.body.appendChild(input);

    input.addEventListener('change', (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = function(event) {
            const img = document.createElement('img');
            img.src = event.target.result;
            img.className = 'polaroid';
            polaroidString.appendChild(img);

            // Replace zombie with butterfly
            zombies[index].isButterfly = true;

            completedItems++;
            checkCompletion();
        };
        reader.readAsDataURL(file);
    });

    input.click();
    document.body.removeChild(input);
}

// Setup initial zombies
function setupZombies() {
    zombies = bucketItems.map((item, index) => {
        return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height * 0.5 + 50,
            speed: 0.5 + Math.random(),
            isButterfly: false
        };
    });
}

// Animate zombies and butterflies
function animateCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = 250;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    zombies.forEach(z => {
        z.x += z.speed;
        if (z.x > canvas.width) {
            z.x = -50; // Loop around
        }

        if (z.isButterfly) {
            const img = new Image();
            img.src = 'static/images/butterfly.png';
            ctx.drawImage(img, z.x, z.y, 50, 50);
        } else {
            const img = new Image();
            img.src = 'static/images/zombie.png';
            ctx.drawImage(img, z.x, z.y, 50, 50);
        }
    });

    requestAnimationFrame(animateCanvas);
}

// Check if all items are completed
function checkCompletion() {
    if (completedItems === bucketItems.length) {
        clearInterval(timerInterval);
        alert('You saved the world!! 🌎🎉');
        document.body.style.backgroundImage = 'url("static/images/greenery.jpg")';
    }
}

// === MINIGAME FUNCTIONS ===

// Open minigame popup
function openMinigame(callback) {
    minigameModal.style.display = 'block';
    minigameCallback = callback;

    zombieTarget.style.left = '0px';
    moveZombie();
}

// Move the zombie inside minigame
function moveZombie() {
    let position = 0;
    const interval = setInterval(() => {
        position += 5;
        zombieTarget.style.left = position + 'px';

        if (position > 300) {
            clearInterval(interval);
            closeMinigame(false); // missed!
        }
    }, 100);
}

// Clicking the zombie to win
zombieTarget.addEventListener('click', () => {
    closeMinigame(true);
});

// Close the minigame
function closeMinigame(success) {
    minigameModal.style.display = 'none';
    if (success && minigameCallback) {
        minigameCallback();
    } else {
        alert('You missed! Try checking the item again!');
    }
}
