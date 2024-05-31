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
    xhttp.open("GET", "addlist.html", true);
    xhttp.send();
}

/**
 * Event listener for the button to open the modal
 */
document.getElementById("openModal").addEventListener("click", function() {
    loadPopupContent();
    document.getElementById("modal").style.display = "block";
});

/**
 * Event listener for the close button of the modal
 */
document.getElementById("closeModal").addEventListener("click", function() {
    document.getElementById("modal").style.display = "none";
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
            document.getElementById("popupContent").setAttribute('data-task-id', taskId); // Set task ID as data attribute
            document.getElementById("modal").style.display = "block";

            const task = JSON.parse(localStorage.getItem('tasks')).find(t => t.id === parseInt(taskId));
            if (task) {
                document.querySelector('.edit-list .text-wrapper1').value = task.text;
                document.querySelector('.edit-list .date-wrapper1').value = task.date;
            }
        }
    };
    xhttp.open("GET", "editlist.html", true);
    xhttp.send();
}

/**
 * Function to handle the submission of edited task
 * @param {string} taskId - The ID of the task to be edited
 */
function handleEditSubmit(taskId) {
    const newText = document.querySelector('.edit-list .text-wrapper1').value;
    const newDate = document.querySelector('.edit-list .date-wrapper1').value;
    const tasks = JSON.parse(localStorage.getItem('tasks'));
    const taskIndex = tasks.findIndex(t => t.id === parseInt(taskId));
    if (taskIndex !== -1) {
        tasks[taskIndex].text = newText;
        tasks[taskIndex].date = newDate;
        localStorage.setItem('tasks', JSON.stringify(tasks)); // Overwrite the existing task in local storage
        updateTaskList(); // Refresh the task list
        document.getElementById("modal").style.display = "none"; // Close the modal
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
    saveButton.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent form submission

        const taskId = document.getElementById("popupContent").getAttribute('data-task-id');
        handleEditSubmit(taskId);
    });
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
                    date: inputDate,
                    completed: false,
                    completedDate: null // Add completedDate property to track completion time
                };
                tasks.push(newTask);
                localStorage.setItem('tasks', JSON.stringify(tasks));
                updateTaskList();

                document.getElementById("modal").style.display = "none";
                document.getElementById("popupContent").innerHTML = "";
            } else {
                alert('Please enter a task name.');
            }
        }
    });
});

/**
 * Function to update the tasks displayed in the DOM
 */
function updateTaskList() {
    const tasksContainer = document.querySelector('.tasks-container');
    tasksContainer.innerHTML = ''; // Clear existing tasks before re-rendering
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // Split tasks into active and completed
    const activeTasks = tasks.filter(task => !task.completed);
    const completedTasks = tasks.filter(task => task.completed);

    // Sorting active tasks by due date, with the closest due date towards the top
    activeTasks.sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort by due date

    const today = new Date(); // Get today's date

    // Render active tasks
    activeTasks.forEach(task => {
        const checkedAttribute = task.completed ? 'checked' : '';

        // Check if the task date is before or equal to today
        const isOverdue = new Date(task.date) < today;

        // Set the text and color accordingly
        const dateText = isOverdue ? '<span style="color: red;">OVERDUE</span>' : task.date;

        const newTaskHtml = `
        <div class="overlap" data-task-id="${task.id}">
            <label class="group">
                <input type="checkbox" class="rectangle-checkbox" ${checkedAttribute}>
                <div class="text-wrapper">${task.text}</div>
                <div class="date-wrapper">${dateText}</div>
            </label>
            <button class="delete-btn">
                <img src="../img/task-delete.svg" alt="Delete" width="26" height="26">
            </button>
            <button class="edit-btn" data-task-id="${task.id}">
                <img src="../img/task-edit.svg" alt="Edit" width="26" height="26">
            </button>
        </div>`;
        tasksContainer.insertAdjacentHTML('beforeend', newTaskHtml);
    });

    // Render completed tasks
    completedTasks.forEach(task => {
        const newTaskHtml = `
        <div class="overlap" data-task-id="${task.id}">
            <label class="group">
                <input type="checkbox" class="rectangle-checkbox" checked disabled>
                <div class="text-wrapper" style="text-decoration: line-through; color: red;">${task.text}</div>
                <div class="date-wrapper">${task.date}</div>
            </label>
            <button class="delete-btn">
                <img src="../img/task-delete.svg" alt="Delete" width="26" height="26">
            </button>
            <button class="edit-btn" data-task-id="${task.id}">
                <img src="../img/task-edit.svg" alt="Edit" width="26" height="26">
            </button>
        </div>`;
        tasksContainer.insertAdjacentHTML('beforeend', newTaskHtml);
    });

    // Update total tasks and completed tasks count
    updateTaskCounts();
}

/**
 * Function to update the total tasks and completed tasks count
 */
function updateTaskCounts() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    console.log(`Total tasks: ${totalTasks}, Completed tasks: ${completedTasks}`);
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
    }
}

// Initial load of the task list
document.addEventListener("DOMContentLoaded", updateTaskList);
