document.addEventListener('DOMContentLoaded', (event) => {
  console.log("DOM fully loaded and parsed");

initializeSimpleMDE();

// Event listener for the 'Add Log' button
document
  .getElementById('addLogButton')
  .addEventListener('click', function () {
    openModal();
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

window.onload = function () {
  // Load logs from localStorage
  let logs = localStorage.getItem('logs');
  if (logs) {
    logs = JSON.parse(logs);
    const logsContainer = document.getElementById('logsContainer');
    logs.forEach((log) => {
      addLogEntry(log.date, log.time, log.content, logsContainer);
    });
  }
};

function addLog() {
  let content = window.simplemde.value();
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
  const entry = document.createElement('pre');
  entry.className = 'log-entry';
  const htmlContent = window.simplemde.markdown(content);

  entry.innerHTML = `
      <div class='fieldD1'>
          <div class='date-codelog'>Date: ${date}
            <button class='delete-button'><img src="../img/task-delete.svg" alt="Delete" width="26" height="26"></button>
          </div>
          <div class='time-codelog'>Time: ${time}</div>
      </div>
      <div class='fieldD2'>
          <pre>${htmlContent}</pre>
      </div>

  `;




  const deleteButton = entry.querySelector('.delete-button');
  deleteButton.addEventListener('click', function () {
    // Remove the log entry from the screen
    container.removeChild(entry);

    // Remove the corresponding log entry from localStorage
    let logs = JSON.parse(localStorage.getItem('logs'));
    const logIndex = Array.from(container.children).indexOf(entry);
    logs.splice(logIndex, 1);
    localStorage.setItem('logs', JSON.stringify(logs));
  });

  entry.addEventListener('dblclick', function () {
    // Find the content element
    const contentElement = this.querySelector('.fieldD2 pre');

    // Replace the content with a textarea
    const textarea = document.createElement('textarea');
    textarea.value = content; // Use the original content, not the HTML
    textarea.style.width = '100%'; // Set the width to 100%
    textarea.style.height = '100%'; // Set the height to 100%
    contentElement.replaceWith(textarea);

    // Focus the textarea and select all text
    textarea.focus();
    textarea.select();

    // Add a blur event listener to the textarea to save changes
    textarea.addEventListener('blur', function () {
      // Convert the textarea value to Markdown and replace the textarea with the new content
      const newContent = this.value; // Use the textarea value, not the Markdown
      const newContentElement = document.createElement('pre');
      newContentElement.innerHTML = window.simplemde.markdown(newContent);
      textarea.replaceWith(newContentElement);

      // Update the corresponding log entry in localStorage
      let logs = JSON.parse(localStorage.getItem('logs'));
      const logIndex = Array.from(container.children).indexOf(entry);
      logs[logIndex].content = newContent;
      localStorage.setItem('logs', JSON.stringify(logs));
    });
  });

  container.appendChild(entry);
}



// Function to initialize SimpleMDE
function initializeSimpleMDE() {
  // Check if SimpleMDE is already initialized
  if (!window.simplemde) {
    // Initialize SimpleMDE if not already done
    window.simplemde = new SimpleMDE({
      element: document.getElementById('logContent'),
    });
  }
}

// Function to set the current date and time in the input fields
function setDateTimeFields() {
  const currentDate = new Date(); // Get the current date and time
  const formattedDate = formatDate(currentDate); // Format the date
  const formattedTime = currentDate.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  }); // Format the time

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
  const formattedDate = date.toLocaleDateString('en-US', options); // Format the date as a string
  const day = date.getDate();
  const suffix = getSuffix(day); // Get the suffix for the day
  return formattedDate.replace(/\b(\d{1,2})(th|nd|rd|st)\b/gi, `$1${suffix}`); // Replace the default suffix with the correct one
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

});