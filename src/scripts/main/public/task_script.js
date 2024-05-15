/** The old code doesn't work on the new application. I am currently working on debugging.**/

document.addEventListener("DOMContentLoaded", function() {
    // Activate add-button and add new task to the list
    const addButton = document.querySelector('.add-list .frame');
    if (!addButton) {
        console.error('Add button not found');
        return; // Stop execution if addButton is not found
    }

    addButton.addEventListener('click', function(event) {
        event.preventDefault(); 

        const inputField = document.querySelector('.add-list .text-wrapper');
        if (!inputField) {
            console.error('Input field not found');
            return; 
        }

        const inputText = inputField.value; // Get the value from the text input
        console.log('Adding task:', inputText); // Log input for debugging

        if (inputText.trim() !== "") {
            let tasks = JSON.parse(localStorage.getItem('tasks')) || []; // Retrieve tasks array or initialize it
            const newTask = {
                id: Date.now(), // Unique identifier for each task
                text: inputText,
                completed: false // Track completion status
            };
            tasks.push(newTask); // Add new task to array
            localStorage.setItem('tasks', JSON.stringify(tasks)); // Store updated array back to localStorage
            window.location.href = 'index.html'; // Redirect to index.html
        } else {
            alert('Please enter a task name.');
        }
    });

    // Adding task to the list 
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const tasksContainer = document.querySelector('.tasks-container');

    tasksContainer.innerHTML = '';

    tasks.forEach(task => {
        const newTaskHtml = `
            
        <div class="overlap" data-id="${task.id}">
            <label class="group">
                <input type="checkbox" id="task-checkbox" class="rectangle-checkbox"${task.completed ? 'checked' : ''}>
                    <div class="text-wrapper">${task.text}</div>
                </label>
            <button class="delete-btn">&#x2716;</button>
        </div>
        
        
        
        `;
        tasksContainer.insertAdjacentHTML('beforeend', newTaskHtml);
    });

    // Blurring the task-list bar and move the task to the bottom of the list
    const taskDiv = document.querySelector('.to-do-list .div');

    function updateOverflow() {
        const tasks = document.querySelectorAll('.overlap');
        const taskCount = tasks.length;
        
        if (taskCount >= 10) {
            taskDiv.style.overflowY = 'auto';
        } else {
            taskDiv.style.overflowY = 'hidden';
        }
    }

    updateOverflow();

    tasksContainer.addEventListener('DOMNodeInserted', updateOverflow);
    tasksContainer.addEventListener('DOMNodeRemoved', updateOverflow);

    // Delete button functionality
    tasksContainer.addEventListener('click', function(event) {
        if (event.target.classList.contains('delete-btn')) {
            const taskElement = event.target.closest('.overlap');
            const taskId = parseInt(taskElement.dataset.id); // Make sure IDs are integers
            let tasks = JSON.parse(localStorage.getItem('tasks'));
            tasks = tasks.filter(task => task.id !== taskId);
            localStorage.setItem('tasks', JSON.stringify(tasks));
            taskElement.remove();
        }
    });
});
