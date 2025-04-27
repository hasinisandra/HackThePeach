const form = document.getElementById('bucketForm');
const landing = document.getElementById('landing');
const game = document.getElementById('game');
const bucketListDiv = document.getElementById('bucketList');
const canvas = document.getElementById('zombieCanvas');
const ctx = canvas.getContext('2d');
const polaroidString = document.getElementById('polaroidString');
let zombies = [];
let timerInterval;
let remainingItems;

document.getElementById('addItem').addEventListener('click', () => {
  const input = document.createElement('input');
  input.type = "text";
  input.placeholder = `Bucket List Item ${document.querySelectorAll('#inputs input').length + 1}`;
  input.required = true;
  document.getElementById('inputs').appendChild(input);
});

form.addEventListener('submit', function(event) {
  event.preventDefault();
  
  // Hide landing, show game
  landing.style.display = 'none';
  game.style.display = 'block';

  // Collect items
  const items = [];
  document.querySelectorAll('#inputs input').forEach(input => {
    if (input.value.trim() !== '') items.push(input.value.trim());
  });

  remainingItems = items.length;

  // Setup bucket list
  items.forEach((item, index) => {
    const listItem = document.createElement('div');
    listItem.innerHTML = `
      <input type="checkbox" id="item-${index}">
      <label for="item-${index}">${item}</label>
      <input type="file" accept="image/*" class="upload" style="display:none;">
    `;
    bucketListDiv.appendChild(listItem);

    listItem.querySelector('input[type="checkbox"]').addEventListener('change', function() {
      listItem.querySelector('.upload').click();
    });

    listItem.querySelector('.upload').addEventListener('change', function(event) {
      const file = event.target.files[0];
      if (file) {
        handleUpload(index, file);
      }
    });
  });

  // Setup zombies
  canvas.width = window.innerWidth;
  canvas.height = 200;
  zombies = Array.from({length: items.length}).map(() => ({
    x: Math.random() * canvas.width,
    y: Math.random() * 150,
    img: new Image()
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

    // Background changes gradually
    document.body.style.backgroundImage = "url('static/images/greenery.jpg')";

    remainingItems--;
    if (remainingItems === 0) {
      clearInterval(timerInterval);
      setTimeout(() => {
        alert('You saved the world! 🌎🎉');
      }, 500);
    }
  };
  reader.readAsDataURL(file);
}

function drawZombies() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  zombies.forEach(zombie => {
    ctx.drawImage(zombie.img, zombie.x, zombie.y, 50, 50);
    zombie.x += Math.random() * 2 - 1;
    zombie.y += Math.random() * 2 - 1;
  });
  requestAnimationFrame(drawZombies);
}
