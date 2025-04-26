// Dynamically add new item inputs
const addItemBtn = document.getElementById('add-item');
const bucketListDiv = document.getElementById('bucket-list-items');

addItemBtn.addEventListener('click', () => {
  const currentItems = bucketListDiv.querySelectorAll('input[name="item"]').length;
  if (currentItems < 10) {
    const input = document.createElement('input');
    input.type = 'text';
    input.name = 'item';
    input.required = true;
    bucketListDiv.appendChild(input);
    bucketListDiv.appendChild(document.createElement('br'));
  } else {
    alert('You can only have up to 10 bucket list items!');
  }
});

// Handle form submission
const setupForm = document.getElementById('setup-form');
setupForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const timer = document.getElementById('timer').value;
  const itemInputs = document.querySelectorAll('input[name="item"]');

  const items = Array.from(itemInputs)
    .map(input => input.value.trim())
    .filter(val => val !== '');

  if (items.length < 5) {
    alert('Please enter at least 5 items!');
    return;
  }

  // Save into local storage
  localStorage.setItem('bucketList', JSON.stringify(items));
  localStorage.setItem('timer', timer);

  // Redirect to tracker.html
  window.location.href = 'tracker.html';
});
