// Add new input fields if needed
const addItemBtn = document.getElementById('add-item');
const bucketListDiv = document.getElementById('bucket-list-items');

addItemBtn.addEventListener('click', () => {
  if (bucketListDiv.children.length < 10) {
    const input = document.createElement('input');
    input.type = 'text';
    input.name = 'item';
    input.required = true;
    bucketListDiv.appendChild(input);
    bucketListDiv.appendChild(document.createElement('br'));
  } else {
    alert('Maximum 10 items!');
  }
});

// Handle form submission
const setupForm = document.getElementById('setup-form');
setupForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const timer = document.getElementById('timer').value;
  const items = Array.from(document.getElementsByName('item'))
    .map(input => input.value)
    .filter(val => val.trim() !== '');

  if (items.length < 5) {
    alert('Please enter at least 5 items!');
    return;
  }

  // Save data to localStorage
  localStorage.setItem('bucketList', JSON.stringify(items));
  localStorage.setItem('timer', timer);

  // Redirect to tracker page
  window.location.href = 'tracker.html';
});
