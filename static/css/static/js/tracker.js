// Load data from localStorage
const bucketList = JSON.parse(localStorage.getItem('bucketList'));
const totalTime = localStorage.getItem('timer');

// Setup Timer
let timerDiv = document.getElementById('timer');
let timeRemaining = totalTime * 60; // in seconds

function startTimer() {
  setInterval(() => {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    timerDiv.textContent = `${minutes}m ${seconds}s`;

    if (timeRemaining <= 0) {
      alert('Time is up! 🌎💥');
      clearInterval();
    } else {
      timeRemaining--;
    }
  }, 1000);
}

startTimer();

// Setup Checklist
const listUl = document.getElementById('list');
bucketList.forEach((item, index) => {
  const li = document.createElement('li');
  li.innerHTML = `<input type="checkbox" id="item-${index}"> ${item}`;
  listUl.appendChild(li);

  // Clicking the checkbox triggers upload
  const checkbox = document.getElementById(`item-${index}`);
  checkbox.addEventListener('change', () => {
    if (checkbox.checked) {
      document.getElementById('file-input').click();
      handleFileUpload(index, item);
    }
  });
});

// Handle Upload
function handleFileUpload(index, itemName) {
  const fileInput = document.getElementById('file-input');
  fileInput.onchange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(evt) {
        createPolaroid(evt.target.result, itemName);
        transformZombie(index); // Placeholder for zombie->butterfly
      }
      reader.readAsDataURL(file);
    }
  };
}

// Create Polaroid
function createPolaroid(imageSrc, itemName) {
  const polaroidLine = document.getElementById('polaroid-line');
  const div = document.createElement('div');
  div.className = 'polaroid';
  div.innerHTML = `<img src="${imageSrc}" style="width:150px;"><p>${itemName}</p>`;
  polaroidLine.appendChild(div);
}

// Transform Zombie (placeholder)
function transformZombie(index) {
  console.log(`Zombie ${index} turns into a butterfly! 🦋`);
}
