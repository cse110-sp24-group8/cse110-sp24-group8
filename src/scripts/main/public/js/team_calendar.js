document.addEventListener('DOMContentLoaded', function() {
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();
    let notes = JSON.parse(localStorage.getItem('tasks')) || {};
  
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
                    cell.onclick = () => {
                        displayTasks(cell.dataset.date);
                        displayEvents(cell.dataset.date);
                    };

                    if(taskDates.has(fullDate) && eventDates.has(fullDate))
                    {
                        cell.style.fontWeight = "bold";
                        cell.style.color = "#fdb927";
                        cell.style.fontWeight = "bold";
                        cell.style.fontSize = "1em"; // Larger text for emphasis
                        cell.style.textDecoration = "underline";                      
                    }
    
                    // Check if the date has tasks and highlight if it does
                    if (taskDates.has(fullDate)) {
                        cell.style.fontWeight = "bold";
                        cell.style.color = "#fdb927";
                        cell.style.fontWeight = "bold";
                        cell.style.fontSize = "1em"; // Larger text for emphasis
                    }

                    // Underline dates with events
                    if (eventDates.has(fullDate)) {
                        cell.style.textDecoration = "underline";
                    }

    
                    row.appendChild(cell);
                    date++;
                }
            }
            calendarBody.appendChild(row);
        }
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
    
                // Append the task element to the container
                taskContentContainer.appendChild(taskElement);
    
                // Find the checkbox in the newly created task element
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
    
        // Clear previous content
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
                        <div class="time-wrapper">${event.time}</div>
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
            }
        }
    }   
    
    displayCalendar(currentMonth, currentYear);

    document.getElementById("prev_month").addEventListener("click", function() {
        if (currentMonth === 0) {
            currentMonth = 11;
            currentYear--;
        } else {
            currentMonth--;
        }
        displayCalendar(currentMonth, currentYear);
    });

    document.getElementById("next_month").addEventListener("click", function() {
        if (currentMonth === 11) {
            currentMonth = 0;
            currentYear++;
        } else {
            currentMonth++;
        }
        displayCalendar(currentMonth, currentYear);
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

document.getElementById("openModal").addEventListener("click", function() {
    loadPopupContent();
    document.getElementById("pageModal").style.display = "block";
});

document.getElementById("closeModal").addEventListener("click", function() {
    document.getElementById("pageModal").style.display = "none";
    document.getElementById("popupContent").innerHTML = "";
});

/**
 * Add event listener to handle event adding, event deletion, and event editing
 */
document.addEventListener("DOMContentLoaded", function() {
    const popupContent = document.getElementById("popupContent");

    if (!popupContent) {
        console.error("Popup content not found");
        return;
    }

    // Delegate click events within popupContent
    popupContent.addEventListener('click', function(event) {
        if (event.target.classList.contains('frame')) {
            event.preventDefault(); // Prevent default action of the button

            const titleField = document.querySelector('.add-list .text-wrapper');
            const dateField = document.querySelector('.add-list .date-wrapper');
            const timeField = document.querySelector('.add-list .time-wrapper');

            if (!titleField || !dateField || !timeField) {
                console.error("Form fields not found");
                return;
            }

            const titleText = titleField.value;
            const dateText = dateField.value;
            const timeText = timeField.value;

            if (titleText.trim() === "") {
                alert('Please enter an event title.');
                return;
            }

            let events = JSON.parse(localStorage.getItem('events')) || [];
            const newEvent = {
                id: Date.now(),
                title: titleText,
                date: dateText,
                time: timeText,
            };

            events.push(newEvent);
            localStorage.setItem('events', JSON.stringify(events));
            updateEventList(); // Ensure this function correctly updates the UI

            document.getElementById("pageModal").style.display = "none";
            document.getElementById("popupContent").innerHTML = ""; // Clear the modal content

            location.reload();
        }
    });
});

/**
 * Function to update the events displayed in the DOM
 */
function updateEventList(targetDate) {
    const eventContentContainer = document.getElementById('event-content');
    if (!eventContentContainer) {
        console.error('Event content container not found');
        return;
    }

    eventContentContainer.innerHTML = ''; // Clear the container before re-rendering events
    let events = JSON.parse(localStorage.getItem('events')) || [];

    // Filter events by the target date and sort them by time
    events = events.filter(event => event.date === targetDate);
    events.sort((a, b) => {
        return new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`);
    });

    events.forEach(event => {
        const eventElement = document.createElement('div');
        eventElement.className = 'overlap';
        eventElement.dataset.eventId = event.id;
        eventElement.innerHTML = `
            <label class="group">
                <div class="text-content-wrapper">${event.title}</div>
                <div class="time-wrapper">${event.time}</div>
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



/**
 * Function to load edit content from external HTML file and display it in the modal
 * @param {string} eventId - The ID of the event to be edited
 */
function loadEditContent(eventId) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("popupContent").innerHTML = this.responseText;

            // Ensure the modal content is fully loaded
            document.getElementById("popupContent").setAttribute('data-event-id', eventId);
            document.getElementById("pageModal").style.display = "block";

            // Debugging output
            console.log("Modal content loaded.");

            // Fetch the event and attempt to populate the form
            const event = JSON.parse(localStorage.getItem('events')).find(e => e.id === parseInt(eventId));
            console.log("Event data to populate:", event);

            if (event) {
                let textWrapper = document.querySelector('.edit-list .text-wrapper');
                let dateWrapper = document.querySelector('.edit-list .date-wrapper');
                let timeWrapper = document.querySelector('.edit-list .time-wrapper');

                if (textWrapper && dateWrapper && timeWrapper) {
                    textWrapper.value = event.title;
                    dateWrapper.value = event.date;
                    timeWrapper.value = event.time;
                } else {
                    console.error("Form fields not found");
                }
            } else {
                console.error("Event not found with ID:", eventId);
            }

            // Attach event listener to the save button if found
            const saveButton = document.querySelector('.edit-list .frame');
            if (saveButton) {
                saveButton.addEventListener('click', function(event) {
                    event.preventDefault(); // Prevent the form from submitting normally
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

/**
 * Function to handle the submission of edited event
 * @param {string} eventId - The ID of the event to be edited
 */
function handleEditSubmit(eventId) {
    const newTitle = document.querySelector('.edit-list .text-wrapper').value;
    const newDate = document.querySelector('.edit-list .date-wrapper').value;
    const newTime = document.querySelector('.edit-list .time-wrapper').value;
    const events = JSON.parse(localStorage.getItem('events'));
    const eventIndex = events.findIndex(e => e.id === parseInt(eventId));

    if (eventIndex !== -1) {
        events[eventIndex].title = newTitle;
        events[eventIndex].date = newDate;
        events[eventIndex].time = newTime;

        // Overwrite the existing event in local storage and sort events
        localStorage.setItem('events', JSON.stringify(events.sort((a, b) => {
            return new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`);
        })));

        updateEventList(newDate); // Refresh the event list for the specific date to reflect changes
        location.reload();
    }
}


document.addEventListener("DOMContentLoaded", function() {
    const eventsContainer = document.querySelector('.event-content');
    eventsContainer.addEventListener('click', function(event) {
        if (event.target.closest('.edit-btn')) {
            const eventElement = event.target.closest('.overlap');
            const eventId = eventElement.dataset.eventId;
            loadEditContent(eventId);
        }
    });
});

// Listen for delete button clicks on the event content container
document.getElementById('event-content').addEventListener('click', function(event) {
    if (event.target.closest('.delete-btn')) {
        const eventElement = event.target.closest('.overlap');
        const eventId = eventElement.dataset.eventId;
        handleEventDeletion(eventId);
        eventElement.remove(); // Removes the event from the DOM
    }
});

/**
 * Function to handle the deletion of an event
 * @param {string} eventId - The ID of the event to be deleted
 */
function handleEventDeletion(eventId) {
    let events = JSON.parse(localStorage.getItem('events')) || [];
    // Filter out the event to delete
    events = events.filter(event => event.id.toString() !== eventId);
    localStorage.setItem('events', JSON.stringify(events)); // Update localStorage with the filtered list

    // Filter out the event to delete
    events = events.filter(event => event.id.toString() !== eventId);
    localStorage.setItem('events', JSON.stringify(events)); // Update localStorage with the filtered list

    location.reload();
}







