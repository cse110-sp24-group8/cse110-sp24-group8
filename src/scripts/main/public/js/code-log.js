// Event listener for the 'Add Log' button
document.getElementById('add-log-button').addEventListener('click', function() {
  openModal();
  initializeSimpleMDE();
  setDateTimeFields();
});

// Function to open the modal
function openModal() {
  document.getElementById('addLogModal').style.display = 'block';
  document.getElementById('logsContainer').classList.add('hidden');
}

// Function to close the modal
function closeModal() {
  document.getElementById('addLogModal').style.display = 'none';
  document.getElementById('logsContainer').classList.remove('hidden');
}

window.onload = function() {
  // Load logs from localStorage
  let logs = localStorage.getItem('logs');
  if (logs) {
      logs = JSON.parse(logs);
      const logsContainer = document.getElementById('logsContainer');
      logs.forEach(log => {
          addLogEntry(log.date, log.time, log.content, logsContainer);
      });
  }
}

function addLog() {
  let content = window.simplemde.value().trim();  // Get markdown content and trim it
  const date = document.getElementById('logDate').value;
  const time = document.getElementById('logTime').value;

  // Add placeholder text if content is empty
  if (!content) {
      content = "<span class='placeholder-text'>Empty</span>";
  }

  // Append to the logs container
  const logsContainer = document.getElementById('logsContainer');
  addLogEntry(date, time, content, logsContainer);

  // Save to localStorage
  let logs = localStorage.getItem('logs');
  if (logs) {
      logs = JSON.parse(logs);
  } else {
      logs = [];
  }
  logs.push({ date, time, content });
  localStorage.setItem('logs', JSON.stringify(logs));

  // Clear the markdown editor
  window.simplemde.value('');

  // Close the modal
  closeModal();
}

function addLogEntry(date, time, content, container) {
  const entry = document.createElement('div');
  entry.className = 'log-entry';
  entry.innerHTML = `<div class='date-time-container'> <div class='date'>Date: ${date}</div>
                        <div class='time'>Time: ${time}</div> </div><p>${content}</p>`;
  container.appendChild(entry);
}


// Function to initialize SimpleMDE
function initializeSimpleMDE() {
  // Check if SimpleMDE is already initialized
  if (!window.simplemde) {
      // Initialize SimpleMDE if not already done
      window.simplemde = new SimpleMDE({ element: document.getElementById("logContent") });
  }
}

// Function to set the current date and time in the input fields
function setDateTimeFields() {
  const currentDate = new Date();  // Get the current date and time
  const formattedDate = formatDate(currentDate);  // Format the date
  const formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });  // Format the time

  const dateField = document.getElementById('logDate');
  const timeField = document.getElementById('logTime');

  // Set the formatted date and time in the input fields
  dateField.value = formattedDate;
  timeField.value = formattedTime;

  // Make the date and time fields read-only
  dateField.readOnly = true;
  timeField.readOnly = true;
}

// Function to format the date
function formatDate(date) {
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  const formattedDate = date.toLocaleDateString('en-US', options);  // Format the date as a string
  const day = date.getDate();
  const suffix = getSuffix(day);  // Get the suffix for the day
  return formattedDate.replace(/\b(\d{1,2})(th|nd|rd|st)\b/gi, `$1${suffix}`);  // Replace the default suffix with the correct one
}

// Function to get the suffix for a day
function getSuffix(day) {
  switch (day % 10) {
      case 1:
          return 'st';
      case 2:
          return 'nd';
      case 3:
          return 'rd';
      default:
          return 'th';
  }
}
