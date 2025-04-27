const form = document.getElementById('bucketForm');
const landing = document.getElementById('landing');
const game = document.getElementById('game');
const bucketListDiv = document.getElementById('bucketList');
const canvas = document.getElementById('zombieCanvas');
const ctx = canvas.getContext('2d');
const polaroidString = document.getElementById('polaroidString');
let zombies = [];
let timerInterval;
let completedItems = 0;
let totalItems = 0;

document.getElementById('addItem').addEventListener('click', () => {
  const input = document.createElement('input');
  input.type = "text";
  input.placeholder = `Bucket List Item ${document.querySelectorAll('#inputs input').length + 1}`;
  input.required = true;
  document.getElementById('inputs').appendChild(input);
});

form.addEventListener('submit', function(event) {
  event.preventDefault();
  
  landing.style.display = 'none';
  game.style.display = 'block';

  // Collect bucket list items
  const items = [];
  document.querySelectorAll('#inputs input').forEach(input => {
    if (input.value.trim() !== '') items.push(input.value.trim());
  });

  totalItems = items.length;

  // Setup bucket list
  items.forEach((item, index) => {
    const listItem = document.createElement('div');
    listItem.innerHTML = `
      <input type="checkbox" id="item-${index}">
      <label for="item-${index}">${item}</label>
      <input type="file" accept="image/*" class="upload" style="display:none;">
    `;
    bucketListDiv.appendChild(listItem);

    const checkbox = listItem.querySelector('input[type="checkbox"]');
    const upload = listItem.querySelector('.upload');

    checkbox.addEventListener('change', function() {
      if (this.checked) {
        upload.click();
      }
    });

    upload.addEventListener('change', function(event) {
      const file = event.target.files[0];
      if (file) {
        handleUpload(index, file);
      }
    });
  });

  // Setup zombies
  canvas.width = window.innerWidth;
  canvas.height = 250;
  zombies = Array.from({length: items.length}).map(() => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    speedX: Math.random() * 0.5 + 0.2,
    img: new Image(),
    alive: true
  }));

  zombies.forEach(z => z.img.src = 'static/images/zombie.png');

  requestAnimationFrame(drawZombies);

  // Start timer
  const minutes = parseInt(document.getElementById('timeLimit').value);
  startTimer(minutes);
});

function startTimer(minutes) {
  const timerDiv = document.getElementById('timer');
  let time = minutes * 60;
  timerInterval = setInterval(() => {
    let min = Math.floor(time / 60);
    let sec = time % 60;
    timerDiv.textContent = `${min}:${sec < 10 ? '0' + sec : sec}`;
    if (time > 0) {
      time--;
    } else {
      clearInterval(timerInterval);
      alert('Time is up! The world is taken over...');
    }
  }, 1000);
}

function handleUpload(index, file) {
  const reader = new FileReader();
  reader.onload = function(e) {
    // Create polaroid
    const polaroid = document.createElement('div');
    polaroid.classList.add('polaroid');
    const img = document.createElement('img');
    img.src = e.target.result;
    polaroid.appendChild(img);
    polaroidString.appendChild(polaroid);

    // Replace zombie with butterfly
    zombies[index].img.src = 'static/images/butterfly.png';
    zombies[index].alive = false;

    completedItems++;
    updateBackground();
    checkVictory();
  };
  reader.readAsDataURL(file);
}

function updateBackground() {
  const progress = completedItems / totalItems;
  if (progress > 0.3 && progress <= 0.6) {
    document.body.style.backgroundImage = "linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url('static/images/greenery.jpg')";
  } else if (progress > 0.6) {
    document.body.style.backgroundImage = "url('static/images/greenery.jpg')";
  }
}

function checkVictory() {
  if (completedItems === totalItems) {
    clearInterval(timerInterval);
    setTimeout(() => {
      alert('🎉 You saved the world! Great job!');
    }, 500);
  }
}

function drawZombies() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  zombies.forEach(zombie => {
    ctx.drawImage(zombie.img, zombie.x, zombie.y, 50, 50);
    zombie.x += zombie.speedX;

    if (zombie.x > canvas.width) {
      zombie.x = -50; // Loop back around
      zombie.y = Math.random() * (canvas.height - 50);
    }
  });
  requestAnimationFrame(drawZombies);
}
