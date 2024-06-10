document.addEventListener('DOMContentLoaded', function() {
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();
    
    let selectedDate = getPacificDate().toISOString().split('T')[0]; // Gets 'YYYY-MM-DD'

    let notes = JSON.parse(localStorage.getItem('tasks')) || {};
    
    function getPacificDate() {
        const utcNow = Date.now(); // Current timestamp in UTC in milliseconds
        const pacificOffset = -7 * 60 * 60 * 1000; // PDT is UTC-7 in milliseconds
    
        // Create new date object for Pacific time
        const pacificDate = new Date(utcNow + pacificOffset);
    
        return pacificDate;
    }   
    
    function displayCalendar(month, year) {
        let firstDay = new Date(year, month, 1);
        let daysInMonth = new Date(year, month + 1, 0).getDate();
        let startingDay = firstDay.getDay();
        let calendarBody = document.getElementById("calendarBody");
        calendarBody.innerHTML = '';

        const monthNames = ["January", "February", "March", "April", "May", "June",
                            "July", "August", "September", "October", "November", "December"];
        document.getElementById("current_month").textContent = `${monthNames[month]} ${year}`;

        // Get all tasks and create a set of dates that have tasks
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const taskDates = new Set(tasks.map(task => task.date));

        // Fetch events and prepare to highlight dates with events
        const events = JSON.parse(localStorage.getItem('events')) || [];
        const eventDates = new Set(events.map(event => event.date));

        let date = 1;
        for (let i = 0; i < 6; i++) {
            let row = document.createElement("tr");
            for (let j = 0; j < 7; j++) {
                let cell = document.createElement("td");
                if (i === 0 && j < startingDay) {
                    row.appendChild(cell);
                } else if (date > daysInMonth) {
                    row.appendChild(cell);
                } else {
                    let fullDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
                    cell.textContent = date;
                    cell.dataset.date = fullDate;
                    cell.classList.add('calendar-cell');
                    cell.onclick = () => {
                        selectedDate = cell.dataset.date;
                        displayTasks(selectedDate);
                        displayEvents(selectedDate);
                        highlightSelectedDate();
                    };

                    if (taskDates.has(fullDate) && eventDates.has(fullDate)) {
                        cell.style.fontWeight = "bold";
                        cell.style.color = "var(--lecoder-purple)";
                        cell.style.fontWeight = "bold";
                        cell.style.fontSize = "1em"; // Larger text for emphasis
                        cell.style.textDecoration = "underline";
                    }

                    // Check if the date has tasks and highlight if it does
                    if (taskDates.has(fullDate)) {
                        cell.style.fontWeight = "bold";
                        cell.style.color = "var(--lecoder-purple)";
                        cell.style.fontWeight = "bold";
                        cell.style.fontSize = "1em"; // Larger text for emphasis
                    }

                    // Underline dates with events
                    if (eventDates.has(fullDate)) {
                        cell.style.textDecoration = "underline";
                    }

                    if (fullDate === selectedDate) {
                        cell.classList.add('selected-date');
                    }

                    row.appendChild(cell);
                    date++;
                }
            }
            calendarBody.appendChild(row);
        }
    }

    function highlightSelectedDate() {
        document.querySelectorAll('.calendar-cell').forEach(cell => {
            cell.classList.remove('selected-date');
            if (cell.dataset.date === selectedDate) {
                cell.classList.add('selected-date');
            }
        });
    }

    function displayTasks(date) {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const filteredTasks = tasks.filter(task => task.date === date);
        const taskContentContainer = document.getElementById('task-content');
        taskContentContainer.innerHTML = '';

        if (filteredTasks.length === 0) {
            taskContentContainer.innerHTML = `
                <img src="../icons/calendar-icon.svg" alt="No Schedule Icon" class="icon">
                <p class="message">No Tasks</p>
            `;
        } else {
            filteredTasks.forEach(task => {
                const taskElement = document.createElement('div');
                taskElement.className = 'overlap';
                taskElement.dataset.taskId = task.id;
                taskElement.innerHTML = `
                    <label class="group">
                        <input type="checkbox" class="rectangle-checkbox" ${task.completed ? 'checked' : ''}>
                        <div class="text-wrapper" style="${task.completed ? 'text-decoration: line-through;' : ''}">${task.text}</div>
                    </label>
                `;

                taskContentContainer.appendChild(taskElement);

                const checkbox = taskElement.querySelector('.rectangle-checkbox');
                checkbox.addEventListener('change', function() {
                    updateTaskCompletion(task.id, this.checked);
                });
            });
        }
    }

    function displayEvents(date) {
        const events = JSON.parse(localStorage.getItem('events')) || [];
        const filteredEvents = events.filter(event => event.date === date);
        const eventContentContainer = document.getElementById('event-content');

        eventContentContainer.innerHTML = '';

        if (filteredEvents.length === 0) {
            eventContentContainer.innerHTML = `
                <img src="../icons/calendar-icon.svg" alt="No Schedule Icon" class="icon">
                <p class="message">No Events</p>
            `;
        } else {
            filteredEvents.forEach(event => {
                const eventElement = document.createElement('div');
                eventElement.className = 'overlap';
                eventElement.dataset.eventId = event.id;
                eventElement.innerHTML = `
                    <label class="group">
                        <div class="text-content-wrapper">${event.title}</div>
                        <div class="time-wrapper-display">${event.time}</div>
                        <button class="delete-btn" onclick="handleEventDeletion('${event.id}')">
                            <img src="../img/task-delete.svg" alt="Delete" width="26" height="26">
                        </button>
                        <button class="edit-btn" onclick="loadEditContent('${event.id}')">
                            <img src="../img/task-edit.svg" alt="Edit" width="26" height="26">
                        </button>
                    </label>
                `;
                eventContentContainer.appendChild(eventElement);
            });
        }
    }

    function updateTaskCompletion(taskId, isCompleted) {
        const tasks = JSON.parse(localStorage.getItem('tasks'));
        const taskIndex = tasks.findIndex(t => t.id == taskId);

        if (taskIndex !== -1) {
            tasks[taskIndex].completed = isCompleted;
            tasks[taskIndex].completedDate = isCompleted ? new Date().toISOString() : null;
            localStorage.setItem('tasks', JSON.stringify(tasks));
            const taskElement = document.querySelector(`.overlap[data-task-id="${taskId}"]`);
            if (taskElement) {
                const textWrapper = taskElement.querySelector('.text-wrapper');
                textWrapper.style.textDecoration = isCompleted ? 'line-through' : 'none';
                updateTaskCounts();
            }
        }
    }

    function updateTaskCounts() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(task => task.completed).length;
    
        // Store the counts in localStorage
        localStorage.setItem('totalTasks', totalTasks);
        localStorage.setItem('completedTasks', completedTasks);
    }

    displayCalendar(currentMonth, currentYear);
    highlightSelectedDate(); // Highlight today's date by default
    displayTasks(selectedDate); // Display tasks for today's date
    displayEvents(selectedDate); // Display events for today's date

    document.getElementById("prev_month").addEventListener("click", function() {
        if (currentMonth === 0) {
            currentMonth = 11;
            currentYear--;
        } else {
            currentMonth--;
        }
        displayCalendar(currentMonth, currentYear);
        highlightSelectedDate(); // Maintain the highlight on the selected date
    });

    document.getElementById("next_month").addEventListener("click", function() {
        if (currentMonth === 11) {
            currentMonth = 0;
            currentYear++;
        } else {
            currentMonth++;
        }
        displayCalendar(currentMonth, currentYear);
        highlightSelectedDate(); // Maintain the highlight on the selected date
    });
});



function loadPopupContent() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("popupContent").innerHTML = this.responseText;
        } else if (this.readyState == 4) {
            console.error("Error loading page: " + this.statusText);
        }
    };
    xhttp.open("GET", "addEvent.html", true);
    xhttp.send();
}

// document.getElementById("openModal").addEventListener("click", function() {
//     loadPopupContent();
//     document.getElementById("pageModal").style.display = "block";
// });

// document.getElementById("closeModal").addEventListener("click", function() {
//     document.getElementById("pageModal").style.display = "none";
//     document.getElementById("popupContent").innerHTML = "";
// });

// document.addEventListener("DOMContentLoaded", function() {
//     const popupContent = document.getElementById("popupContent");
let openModalElement = document.getElementById("openModal");
if (openModalElement) {
  openModalElement.addEventListener("click", function() {
    loadPopupContent();
    document.getElementById("pageModal").style.display = "block";
  });
}

let closeModalElement = document.getElementById("closeModal");
if (closeModalElement) {
  closeModalElement.addEventListener("click", function() {
    document.getElementById("pageModal").style.display = "none";
    document.getElementById("popupContent").innerHTML = "";
  });
}
document.addEventListener("DOMContentLoaded", function() {
    const popupContent = document.getElementById("popupContent");

    if (!popupContent) {
        console.error("Popup content not found");
        return;
    }

    popupContent.addEventListener('click', function(event) {
        if (event.target.classList.contains('frame')) {
            event.preventDefault();

            const titleField = document.querySelector('.add-list .text-wrapper');
            const dateField = document.querySelector('.add-list .date-wrapper');
            const timeField = document.querySelector('.add-list .time-wrapper');

            if (!titleField || !dateField || !timeField) {
                console.error("Form fields not found");
                return;
            }

            const titleText = titleField.value;
            const dateText = dateField.value;
            let timeText = timeField.value;
            if (titleText.trim() === "" & dateText.trim() === "") {
                alert('Please enter the event title and date title.');
                return;
            }
              
            if (titleText.trim() === "") {
                alert('Please enter the event title.');
                return;
            }

            if (dateText.trim() === "") {
                alert('Please enter the event date.');
                return;
            }

            timeText = timeText ? formatTimeTo12Hr(timeText) : "";

            let events = JSON.parse(localStorage.getItem('events')) || [];
            const newEvent = {
                id: Date.now(),
                title: titleText,
                date: dateText,
                time: timeText,
            };

            events.push(newEvent);
            localStorage.setItem('events', JSON.stringify(events));
            updateEventList(dateText);

            document.getElementById("pageModal").style.display = "none";
            document.getElementById("popupContent").innerHTML = "";
        }
    });
});

//formatting the AM and PM time function
export function formatTimeTo12Hr(timeText) {
    if (!timeText) return ""; // Return empty if no time provided

    let [hour, minute] = timeText.split(':');
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12; // Convert hour to 12-hour format
    return `${hour}:${minute} ${ampm}`;
}

//converting 12-hour format back to 24-hour format
export function formatTimeTo24Hr(timeText) {
    const [time, modifier] = timeText.split(' ');
    let [hour, minute] = time.split(':');
    hour = parseInt(hour);

    if (modifier === 'PM' && hour !== 12) {
        hour = hour + 12;
    } else if (modifier === 'AM' && hour === 12) {
        hour = 0;
    }

    return `${hour.toString().padStart(2, '0')}:${minute}`;
}

function updateEventList(targetDate) {
    const eventContentContainer = document.getElementById('event-content');
    if (!eventContentContainer) {
        console.error('Event content container not found');
        return;
    }

    eventContentContainer.innerHTML = '';
    let events = JSON.parse(localStorage.getItem('events')) || [];

    events = events.filter(event => event.date === targetDate);
    events.sort((a, b) => {
        return new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`);
    });

    events.forEach(event => {
        const eventElement = `
            <div class="overlap" data-task-id="${event.id}">
                <label class="group">
                    <div class="text-content-wrapper">${event.title}</div>
                    <div class="time-wrapper-display">${event.time || ""}</div>
                    <button class="delete-btn" onclick="handleEventDeletion('${event.id}')">
                        <img src="../img/task-delete.svg" alt="Delete" width="26" height="26">
                    </button>
                    <button class="edit-btn" onclick="loadEditContent('${event.id}')">
                        <img src="../img/task-edit.svg" alt="Edit" width="26" height="26">
                    </button>
                </label>
            </div>`;
        eventContentContainer.insertAdjacentHTML('beforeend', eventElement);
    });
}

function loadEditContent(eventId) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("popupContent").innerHTML = this.responseText;

            document.getElementById("popupContent").setAttribute('data-event-id', eventId);
            document.getElementById("pageModal").style.display = "block";

            const event = JSON.parse(localStorage.getItem('events')).find(e => e.id === parseInt(eventId));

            if (event) {
                let textWrapper = document.querySelector('.edit-list .text-wrapper');
                let dateWrapper = document.querySelector('.edit-list .date-wrapper');
                let timeWrapper = document.querySelector('.edit-list .time-wrapper');

                if (textWrapper && dateWrapper && timeWrapper) {
                    textWrapper.value = event.title;
                    dateWrapper.value = event.date;
                    timeWrapper.value = event.time ? formatTimeTo24Hr(event.time) : "";
                } else {
                    console.error("Form fields not found");
                }
            } else {
                console.error("Event not found with ID:", eventId);
            }

            const saveButton = document.querySelector('.edit-list .frame1');
            if (saveButton) {
                saveButton.addEventListener('click', function(event) {
                    event.preventDefault();
                    handleEditSubmit(eventId);
                    document.getElementById("pageModal").style.display = "none";
                });
            } else {
                console.error('Save button not found.');
            }
        }
    };
    xhttp.open("GET", "editEvent.html", true);
    xhttp.send();
}

function handleEditSubmit(eventId) {
    const newTitle = document.querySelector('.edit-list .text-wrapper').value;
    const newDate = document.querySelector('.edit-list .date-wrapper').value;
    const newTime = document.querySelector('.edit-list .time-wrapper').value;
    const events = JSON.parse(localStorage.getItem('events'));
    const eventIndex = events.findIndex(e => e.id === parseInt(eventId));

    if (eventIndex !== -1) {
        events[eventIndex].title = newTitle;
        events[eventIndex].date = newDate;

        events[eventIndex].time = formatTimeTo12Hr(newTime);

        localStorage.setItem('events', JSON.stringify(events.sort((a, b) => {
            return new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`);
        })));

        updateEventList(newDate);
    }
}

document.addEventListener("DOMContentLoaded", function() {
    let eventContentElement = document.getElementById('event-content');
    if (eventContentElement) {
        eventContentElement.addEventListener('click', function(event) {
    if (event.target.closest('.delete-btn')) {
      const eventElement = event.target.closest('.overlap');
      const eventId = eventElement.dataset.eventId;
      handleEventDeletion(eventId);
      eventElement.remove();
    }
  });
}

function handleEventDeletion(eventId) {
    let events = JSON.parse(localStorage.getItem('events')) || [];
    events = events.filter(event => event.id.toString() !== eventId);
    localStorage.setItem('events', JSON.stringify(events));
}
});

let eventContentElement = document.getElementById('event-content');
if (eventContentElement) {
  eventContentElement.addEventListener('click', function(event) {
    if (event.target.closest('.delete-btn')) {
      const eventElement = event.target.closest('.overlap');
      const eventId = eventElement.dataset.eventId;
      handleEventDeletion(eventId);
      eventElement.remove();
    }
  });
}

function handleEventDeletion(eventId) {
    let events = JSON.parse(localStorage.getItem('events')) || [];
    events = events.filter(event => event.id.toString() !== eventId);
    localStorage.setItem('events', JSON.stringify(events));
}

