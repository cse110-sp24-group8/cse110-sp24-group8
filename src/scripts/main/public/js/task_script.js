// Function to load content from external HTML file and display it in the modal
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

// Event listener for the button to open the modal
document.getElementById("openModal").addEventListener("click", function() {
    loadPopupContent();
    document.getElementById("modal").style.display = "block";
});

// Event listener for the close button of the modal
document.getElementById("closeModal").addEventListener("click", function() {
    document.getElementById("modal").style.display = "none";
    document.getElementById("popupContent").innerHTML = "";
});

// Function to load edit content from external HTML file and display it in the modal
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
            }
        }
    };
    xhttp.open("GET", "editlist.html", true);
    xhttp.send();
}

function handleEditSubmit(taskId) {
    const newText = document.querySelector('.edit-list .text-wrapper1').value;
    const tasks = JSON.parse(localStorage.getItem('tasks'));
    const taskIndex = tasks.findIndex(t => t.id === parseInt(taskId));
    if (taskIndex !== -1) {
        tasks[taskIndex].text = newText;
        localStorage.setItem('tasks', JSON.stringify(tasks));
        updateTaskList(); // Refresh the task list
        document.getElementById("modal").style.display = "none"; // Close the modal
    }
}

// Add event listeners to handle edit button clicks within the tasks-container
document.addEventListener("DOMContentLoaded", function() {
    const tasksContainer = document.querySelector('.tasks-container');
    tasksContainer.addEventListener('click', function(event) {
        if (event.target.closest('.edit-btn')) {
            const taskElement = event.target.closest('.overlap');
            const taskId = taskElement.dataset.taskId; // ensure your task elements have a data-task-id attribute
            loadEditContent(taskId);
        }
    });
});


//Add-list
document.addEventListener("DOMContentLoaded", function() {
    // Function to update the tasks displayed in the DOM
    function updateTaskList() {
        const tasksContainer = document.querySelector('.tasks-container');
        tasksContainer.innerHTML = ''; // Clear existing tasks before re-rendering
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

        tasks.sort((a, b) => {
        // Put completed tasks at the bottom
            if (a.completed === b.completed) {
                // If both tasks are either completed or not, sort by ID
                return b.id - a.id;
            } else {
                // If one task is completed and the other is not, put the completed one at the bottom
                return (a.completed === true) ? 1 : -1;
            }
        });
        tasks.forEach(task => {
            const checkedAttribute = task.completed ? 'checked' : '';
            const newTaskHtml = `
            <div class="overlap" data-task-id="${task.id}">
                <label class="group">
                    <input type="checkbox" class="rectangle-checkbox" ${checkedAttribute}>
                    <div class="text-wrapper">${task.text}</div>
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
    }
    
    
    // Initial display of tasks
    updateTaskList();

    // Event delegation for handling dynamically loaded add button
    document.getElementById("popupContent").addEventListener('click', function(event) {
        if (event.target.classList.contains('frame')) {
            event.preventDefault();
            console.log("Add button clicked.");

            const inputField = document.querySelector('.add-list .text-wrapper');
            if (!inputField) {
                console.error('Input field not found');
                return;
            }

            const inputText = inputField.value;
            console.log('Adding task:', inputText);

            if (inputText.trim() !== "") {
                let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
                const newTask = {
                    id: Date.now(),
                    text: inputText,
                    completed: false
                };
                tasks.push(newTask);
                localStorage.setItem('tasks', JSON.stringify(tasks));
                console.log("Task added:", newTask);
                
                // Update the task list immediately after adding a new task
                updateTaskList();

                // Optionally close the modal here
                document.getElementById("modal").style.display = "none";
                document.getElementById("popupContent").innerHTML = "";
            } else {
                alert('Please enter a task name.');
            }
        }
    });
});


document.addEventListener("DOMContentLoaded", function() {
    const tasksContainer = document.querySelector('.tasks-container');

    // Listen for delete button clicks
    tasksContainer.addEventListener('click', function(event) {
        if (event.target.closest('.delete-btn')) {
            const taskElement = event.target.closest('.overlap');
            const taskId = taskElement.dataset.taskId;
            removeTask(taskId);
            taskElement.remove(); // Removes the task from the DOM
        }
    });

    function removeTask(taskId) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks = tasks.filter(task => task.id.toString() !== taskId);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
});

document.addEventListener("DOMContentLoaded", function() {
    const tasksContainer = document.querySelector('.tasks-container');
    
    // Handle checkbox changes
    tasksContainer.addEventListener('change', function(event) {
        if (event.target.type === 'checkbox') {
            const taskElement = event.target.closest('.overlap');
            const taskId = taskElement.dataset.taskId;
            updateTaskCompletion(taskId, event.target.checked);
            setTimeout(function() {
                window.location.reload();
            }, 500);
        }
    });

    function updateTaskCompletion(taskId, isCompleted) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        let task = tasks.find(t => t.id.toString() === taskId);
        if (task) {
            task.completed = isCompleted;
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }
    }
    // New event listener for edit buttons
    tasksContainer.addEventListener('click', function(event) {
        if (event.target.closest('.edit-btn')) {
            const taskElement = event.target.closest('.overlap');
            const taskId = taskElement.dataset.taskId;
            loadEditContent(taskId);
        }
    });

    function loadEditContent(taskId) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById("popupContent").innerHTML = this.responseText;
                document.getElementById("modal").style.display = "block";
                // Populate the form with the task's existing data
                const task = JSON.parse(localStorage.getItem('tasks')).find(t => t.id === parseInt(taskId));
                if (task) {
                    document.querySelector('.edit-list .text-wrapper1').value = task.text;
                }
            }
        };
        xhttp.open("GET", "editlist.html", true);
        xhttp.send();
    }

});

document.addEventListener("DOMContentLoaded", function() {
    const popupContent = document.getElementById("popupContent");

    // Delegate click events within popupContent
    popupContent.addEventListener('click', function(event) {
        if (event.target.classList.contains('frame1')) {
            event.preventDefault();
            const taskId = popupContent.getAttribute('data-task-id');
            const inputField = document.querySelector('.edit-list .text-wrapper1');
            const newText = inputField.value.trim();
    
            if (newText === "") {
                alert("Please enter some text.");
                return;
            }
    
            updateTask(taskId, newText);
    
            // Close the modal and clear its content
            document.getElementById("modal").style.display = "none";
            document.getElementById("popupContent").innerHTML = "";

            window.location.href = 'task-list.html';
        }
    });
    

    function updateTask(taskId, newText) {
        let tasks = JSON.parse(localStorage.getItem('tasks'));
        let taskIndex = tasks.findIndex(t => t.id.toString() === taskId);
        if (taskIndex !== -1) {
            tasks[taskIndex].text = newText;
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }
    }
    
});
    
    
    
    
    
