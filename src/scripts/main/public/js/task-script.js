/**
 * Function to load content from external HTML file and display it in the modal
 */
function loadPopupContent() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("popupContent").innerHTML = this.responseText;
        }
    };
    xhttp.open("GET", "add-list.html", true);
    xhttp.send();
}

/**
 * Event listener for the button to open the modal
 */
document.getElementById("openModal").addEventListener("click", function() {
    loadPopupContent();
    document.getElementById("pageModal").style.display = "block";
});

/**
 * Event listener for the close button of the modal
 */
document.getElementById("closeModal").addEventListener("click", function() {
    document.getElementById("pageModal").style.display = "none";
    document.getElementById("popupContent").innerHTML = "";
});

/**
 * Function to load edit content from external HTML file and display it in the modal
 * @param {string} taskId - The ID of the task to be edited
 */
function loadEditContent(taskId) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("popupContent").innerHTML = this.responseText;
            document.getElementById("popupContent").setAttribute('data-task-id', taskId);
            document.getElementById("pageModal").style.display = "block";

            const task = JSON.parse(localStorage.getItem('tasks')).find(t => t.id === parseInt(taskId));
            if (task) {
                document.querySelector('.edit-list .text-wrapper1').value = task.text;
                document.querySelector('.edit-list .date-wrapper1').value = task.date || '';
            }

            // Correctly place the event listener setup here after the content is loaded and elements are available
            const saveButton = document.querySelector('.edit-list .frame1');
            if (saveButton) {
                saveButton.addEventListener('click', function(event) {
                    event.preventDefault(); // Prevent form submission
                    handleEditSubmit(taskId);
                    document.getElementById("pageModal").style.display = "none"; // Close the modal
                });
            } else {
                console.error('Save button not found.');
            }
        }
    };
    xhttp.open("GET", "edit-list.html", true);
    xhttp.send();
}

/**
 * Function to handle the submission of edited task
 * @param {string} taskId - The ID of the task to be edited
 */
function handleEditSubmit(taskId) {
    const newText = document.querySelector('.edit-list .text-wrapper1').value;
    const newDate = document.querySelector('.edit-list .date-wrapper1').value;
    const standardizedDate = newDate ? standardizeDate(newDate) : 'No Due Date'; // Standardize or use default

    const tasks = JSON.parse(localStorage.getItem('tasks'));
    const taskIndex = tasks.findIndex(t => t.id === parseInt(taskId));

    if (taskIndex !== -1) {
        tasks[taskIndex].text = newText;
        tasks[taskIndex].date = standardizedDate;
        localStorage.setItem('tasks', JSON.stringify(tasks));
        updateTaskList();
    }
}


document.addEventListener("DOMContentLoaded", function() {
    const tasksContainer = document.querySelector('.tasks-container');
    tasksContainer.addEventListener('click', function(event) {
        if (event.target.closest('.edit-btn')) {
            const taskElement = event.target.closest('.overlap');
            const taskId = taskElement.dataset.taskId;
            loadEditContent(taskId);
        }
    });

    // Handle edit submission
    const saveButton = document.querySelector('.edit-list .frame1');
    if (saveButton) {
        saveButton.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent form submission

            const taskId = document.getElementById("popupContent").getAttribute('data-task-id');
            handleEditSubmit(taskId);
        });
    }
});

/**
 * Add event listener to handle task adding, task deletion, task completion, and task editing
 */
document.addEventListener("DOMContentLoaded", function() {
    const popupContent = document.getElementById("popupContent");

    // Delegate click events within popupContent
    popupContent.addEventListener('click', function(event) {
        if (event.target.classList.contains('frame')) {
            event.preventDefault();

            const inputField = document.querySelector('.add-list .text-wrapper');
            const dateField = document.querySelector('.add-list .date-wrapper');
            const inputText = inputField.value;
            const inputDate = dateField.value;

            if (inputText.trim() !== "") {
                let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
                const newTask = {
                    id: Date.now(),
                    text: inputText,
                    date: inputDate ? standardizeDate(inputDate) : null,
                    completed: false,
                    completedDate: null, // Add completedDate property to track completion time
                };
                tasks.push(newTask);
                localStorage.setItem('tasks', JSON.stringify(tasks));
                updateTaskList();

                document.getElementById("pageModal").style.display = "none";
                document.getElementById("popupContent").innerHTML = "";
            } else {
                alert('Please enter a task name.');
            }
        }
    });
});

/**
 * Function to standardize a date string to 00:00 AM in UTC
 * @param {string} date - The date string to standardize
 * @returns {string} - The standardized date string
 */
function standardizeDate(date) {
    if (!date) return null; // Return null if date is falsy
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
        return null; // Return null if the date is invalid
    }
    dateObj.setUTCHours(0, 0, 0, 0);
    return dateObj.toISOString().split('T')[0];
}


/**
 * Function to format date as "Today", "Tomorrow", or "10th May 2024"
 * @param {string} date - The date to format
 * @returns {string} - The formatted date string
 */
function formatDate(date) {
    if (!date || date === 'No Due Date') {
        return 'No Due Date'; // Return default text if no valid date
    }

    //PST timezone conversion
    const getPSTDate = (date) => {
        const dateString = date.toLocaleString("en-US", { timeZone: "America/Los_Angeles" });
        const pstDate = new Date(dateString);
        pstDate.setHours(0, 0, 0, 0); // Set to start of the day
        return pstDate;
    };

    const today = getPSTDate(new Date());
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const dateToFormat = getPSTDate(date);
    dateToFormat.setDate(dateToFormat.getDate() + 1);

    if (dateToFormat.getTime() < today.getTime()) {
        return '<span style="color: red;">OVERDUE</span>';
    } else if (dateToFormat.getTime() === today.getTime()) {
        return '<span style="color:black;">Today</span>';
    } else if (dateToFormat.getTime() === tomorrow.getTime()) {
        return '<span style="color:black;">Tomorrow</span>';
    } else {
        const day = dateToFormat.getUTCDate();
        const month = dateToFormat.toLocaleString('default', { month: 'long' });
        const year = dateToFormat.getUTCFullYear();

        const daySuffix = (day) => {
            if (day > 3 && day < 21) return 'th'; // covers 11-20
            switch (day % 10) {
                case 1: return "st";
                case 2: return "nd";
                case 3: return "rd";
                default: return "th";
            }
        };

        return `${day}${daySuffix(day)} ${month} ${year}`;
    }
}

/**
 * Function to update the tasks displayed in the DOM
 */
function updateTaskList() {
    const tasksContainer = document.querySelector('.tasks-container');
    tasksContainer.innerHTML = ''; // Clear the container before re-rendering tasks
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // Enhance tasks with a standardized date object for sorting
    tasks.forEach(task => {
        if (task.date) {
            task.dateObj = new Date(standardizeDate(task.date));
        } else {
            // Assign a past date to tasks without a specified due date to bring them to the top
            task.dateObj = new Date('1970-01-01T00:00:00Z');
        }
    });

    // Sort tasks by completion status first, then by due date (or lack thereof)
    tasks.sort((a, b) => {
        if (a.completed && !b.completed) {
            return 1; // Completed tasks go to the bottom
        } else if (!a.completed && b.completed) {
            return -1; // Incomplete tasks stay on top
        } else {
            // If both tasks are either completed or incomplete, sort by date
            if (!a.date && b.date) {
                return -1; // No due date tasks come after incomplete but before completed tasks with dates
            } else if (a.date && !b.date) {
                return 1; // Tasks with dates come before no due date when both are incomplete
            }
            return a.dateObj - b.dateObj; // Sort by date ascending
        }
    });

    localStorage.setItem('tasks', JSON.stringify(tasks)); // Saves sorted list to Local Storage

    // Render tasks
    tasks.forEach(task => {
        const checkedAttribute = task.completed ? 'checked' : '';
        const textDecoration = task.completed ? 'text-decoration: line-through; color: #DA70D6;' : '';
        const dateText = task.date ? formatDate(task.date) : "No Due Date";

        const taskHtml = `
            <div class="overlap" data-task-id="${task.id}">
                <label class="group">
                    <input type="checkbox" class="rectangle-checkbox" ${checkedAttribute} onchange="updateTaskCompletion('${task.id}', this.checked)">
                    <div class="text-wrapper" style="${textDecoration}">${task.text}</div>
                    <div class="date-wrapper">${dateText}</div>
                </label>
                <button class="delete-btn" onclick="handleTaskDeletion('${task.id}')">
                    <img src="../img/task-delete.svg" alt="Delete" width="26" height="26">
                </button>
                <button class="edit-btn" onclick="loadEditContent('${task.id}')">
                    <img src="../img/task-edit.svg" alt="Edit" width="26" height="26">
                </button>
            </div>`;
        tasksContainer.insertAdjacentHTML('beforeend', taskHtml);
    });

    updateTaskCounts(); // Update the count of total and completed tasks
}

/**
 * Function to update the total tasks and completed tasks count
 */
function updateTaskCounts() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;

    // Store the counts in localStorage
    localStorage.setItem('totalTasks', totalTasks);
    localStorage.setItem('completedTasks', completedTasks);
}

/**
 * Function to handle the deletion of a task
 * @param {string} taskId - The ID of the task to be deleted
 */
function handleTaskDeletion(taskId) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(task => task.id.toString() !== taskId);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    updateTaskCounts(); // Update task counts after removing a task
    updateTaskList();
}

document.addEventListener("DOMContentLoaded", function() {
    const tasksContainer = document.querySelector('.tasks-container');

    // Listen for delete button clicks
    tasksContainer.addEventListener('click', function(event) {
        if (event.target.closest('.delete-btn')) {
            const taskElement = event.target.closest('.overlap');
            const taskId = taskElement.dataset.taskId;
            handleTaskDeletion(taskId);
            taskElement.remove(); // Removes the task from the DOM
        }
    });

    // Handle checkbox changes
    tasksContainer.addEventListener('change', function(event) {
        if (event.target.type === 'checkbox') {
            const taskElement = event.target.closest('.overlap');
            const taskId = taskElement.dataset.taskId;
            updateTaskCompletion(taskId, event.target.checked);
            if (event.target.checked) {
                // Schedule task deletion after 24 hours
                setTimeout(() => {
                    handleTaskDeletion(taskId);
                    taskElement.remove(); // Removes the task from the DOM
                }, 24 * 60 * 60 * 1000); // 24 hours in milliseconds
            }
        }
    });
});

/**
 * Function to update the completion status of a task
 * @param {string} taskId - The ID of the task to be updated
 * @param {boolean} isCompleted - The completion status of the task
 */
function updateTaskCompletion(taskId, isCompleted) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const task = tasks.find(task => task.id.toString() === taskId);
    if (task) {
        task.completed = isCompleted;
        task.completedDate = isCompleted ? new Date().toISOString() : null; // Update completedDate
        localStorage.setItem('tasks', JSON.stringify(tasks));
        updateTaskCounts(); // Update task counts after changing completion status
        updateTaskList();
    }
}

// Initial load of the task list
document.addEventListener("DOMContentLoaded", updateTaskList);
