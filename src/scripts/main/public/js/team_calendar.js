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
    
                    // Check if the date has tasks and highlight if it does
                    if (taskDates.has(fullDate)) {
                        cell.style.fontWeight = "bold";
                        cell.style.color = "#fdb927";
                        cell.style.fontWeight = "bold";
                        cell.style.fontSize = "1em"; // Larger text for emphasis

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
                <p class="message">No Schedule Today</p>
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
        eventContentContainer.innerHTML = '';
    
        if (filteredEvents.length === 0) {
            eventContentContainer.innerHTML = `
                <img src="../icons/calendar-icon.svg" alt="No Schedule Icon" class="icon">
                <p class="message">No events scheduled for this date.</p>
            `;
        } else {
            filteredEvents.forEach(event => {
                const eventElement = document.createElement('div');
                eventElement.className = 'overlap';
                eventElement.dataset.eventId = event.id;
                eventElement.innerHTML = `
                    <label class="group">
                        <div class="text-wrapper">${event.title}</div>
                        <div class="time-wrapper">${event.time}</div>
                    </label>
                `;
    
                // Append the event element to the container
                eventContentContainer.appendChild(eventElement);
    
                // Find the edit button in the newly created event element
                const editButton = eventElement.querySelector('.edit-btn');
                editButton.addEventListener('click', function() {
                    loadEditContent(event.id);
                });
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

    // Delegate click events within popupContent
    popupContent.addEventListener('click', function(event) {
        if (event.target.classList.contains('frame')) {
            event.preventDefault();

            const titleField = document.querySelector('.add-list .text-wrapper');
            const dateField = document.querySelector('.add-list .date-wrapper');
            const timeField = document.querySelector('.add-list .time-wrapper');
            const titleText = titleField.value;
            const dateText = dateField.value;
            const timeText = timeField.value;

            if (titleText.trim() !== "") {
                let events = JSON.parse(localStorage.getItem('events')) || [];
                const newEvent = {
                    id: Date.now(),
                    title: titleText,
                    date: dateText,
                    time: timeText,
                };
                events.push(newEvent);
                localStorage.setItem('events', JSON.stringify(events));
                updateEventList();

                document.getElementById("pageModal").style.display = "none";
                document.getElementById("popupContent").innerHTML = "";
            } else {
                alert('Please enter an event title.');
            }
        }
    });
});

/**
 * Function to update the events displayed in the DOM
 */
function updateEventList() {
    const eventsContainer = document.querySelector('.event-content');
    eventsContainer.innerHTML = ''; // Clear the container before re-rendering events
    let events = JSON.parse(localStorage.getItem('events')) || [];

    // Group events by date
    const eventsByDate = {};
    events.forEach(event => {
        const date = new Date(event.date);
        const dateString = date.toISOString().split('T')[0]; // Extract date string
        if (!eventsByDate[dateString]) {
            eventsByDate[dateString] = [];
        }
        eventsByDate[dateString].push(event);
    });

    // Iterate through each date in the calendar
    const calendarDates = document.querySelectorAll('[data-date]');
    calendarDates.forEach(calendarDate => {
        const date = calendarDate.dataset.date;
        const eventsForDate = eventsByDate[date];
        if (eventsForDate && eventsForDate.length > 0) {
            const dateContainer = calendarDate.querySelector('.events-container');
            if (dateContainer) {
                eventsForDate.forEach(event => {
                    const eventHtml = `
                        <div class="event" data-event-id="${event.id}">
                            <div class="title">${event.title}</div>
                            <div class="time">${event.time}</div>
                            <button class="edit-btn">Edit</button>
                        </div>`;
                    dateContainer.insertAdjacentHTML('beforeend', eventHtml);
                });
            }
        }
    });
}

// Initial load of the event list
document.addEventListener("DOMContentLoaded", updateEventList);