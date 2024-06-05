/**
 * event listener to change the percentage of the circle depending on the amount of tasks completed
 */
document.addEventListener("DOMContentLoaded", (event) => {
    console.log("DOM fully loaded and parsed");

    // Controls and parses the Due Soon Container
    const dueSection = document.getElementById('dueSoonContainer');
    var tasks = JSON.parse(localStorage.getItem('tasks'));
    if (tasks && (tasks.length !== 0)){
        // Runs through all tasks
        for (const task of tasks) {
            const listOfH3 = dueSection.querySelectorAll('h3');
            const indexOfh3 = Array.from(listOfH3).findIndex(h3 => h3.innerHTML == monthDayDate(task.date));
            // We only want 3 dates to show
            if (listOfH3.length !== 3 && indexOfh3 === -1 && task.completed === false) {
                const date = document.createElement('h3');
                const uList = document.createElement('ul');
                const listItemText = document.createElement('li');
                listItemText.innerHTML = task.text;
                date.innerHTML = monthDayDate(task.date);
                dueSection.appendChild(date);
                dueSection.appendChild(uList);
                uList.appendChild(listItemText);
            }
            // Check if the date was already parsed
            if (indexOfh3 !== -1) {
                const listSibling = listOfH3[indexOfh3].nextElementSibling;
                // Only want 3 tasks to show per day and only shows uncompleted tasks
                if ((listSibling.querySelectorAll('li').length < 3)) {
                    if (task.completed === false) {
                        const listItemText = document.createElement('li');
                        listItemText.innerHTML = task.text;
                        listSibling.appendChild(listItemText);
                    }
                }
                else {
                    const listItemText = document.createElement('li');
                    listItemText.innerHTML = 'You have more for this day ...';
                    listSibling.appendChild(listItemText);
                }
            }
        }
    }
    else {
        const noTasks = document.createElement('h2');
        noTasks.innerHTML = 'You have nothing Due Soon!'
        dueSection.appendChild(noTasks);
    }
    // Accounts for all completed tasks
    if (dueSection.children.length == 1) {
        const noTasks = document.createElement('h2');
        noTasks.innerHTML = 'You have nothing Due Soon!'
        dueSection.appendChild(noTasks);
    }

    // Controls the Progress Bar and how it displays
    const progressBar = document.querySelector('.progress');
    const totalTasks = localStorage.getItem('totalTasks');
    const completedTasks = localStorage.getItem('completedTasks');
    const progressPercent = completedTasks / totalTasks

    let progressKeyframes = `@keyframes progressAnimation {
        from {
            stroke-dasharray: 0 283;
            stroke-dashoffset: 0;
        }
        to {
            stroke-dasharray: ${progressCalculator(progressPercent)} 283;
            stroke-dashoffset: 0;
        }
    }`
    let animationElement = document.createElement('style');
    animationElement.innerHTML = progressKeyframes;
    document.head.appendChild(animationElement);

    progressBar.style.transition = 'stroke-dasharray 2s';
    progressBar.style.animation = 'progressAnimation 2s forwards';
    
    changeProgressText(progressPercent);
});


/**
 * progressCalculator calculates the length of the bar based on percentage of tasks completed in taskList
 * 
 * @param {float} taskListPercent the decimal percent from 0 to 1. e.g. .25 is 25%
 * @returns {float} The number that determines the circle length
 */
function progressCalculator(taskListPercent) {
    return taskListPercent * 283;
}


/**
 * changesProgressText sets the text value of the progress circle
 * 
 * @param {float} percent 
 * @returns {void} 
 */
function changeProgressText(percent) {
    let percentText = document.getElementById('percent');
    // percentText.textContent = `${convertToPercentage((percent))}`; 
    percentText.textContent = `${Math.floor(percent * 100)}%`; //currently just an integer
}

/**
 * convertToPercentage changes a number to a percent with 2 decimal places and is used for the progress text
 * 
 * @param {float} decimal the decimal percent
 * @returns {String} rounded percentage with 2 decimals
 */
function convertToPercentage(decimal) {
    // Multiply by 100 to convert to percentage
    var percentage = decimal * 100;

    // Round to two decimal places
    percentage = Math.round(percentage * 100) / 100;

    // Convert back to string with % symbol
    return percentage.toFixed(2) + '%';
}

/**
 * Converts date of YYYY-MM-DD to Month, Day
 * 
 * @param {String} dateString
 * @returns {String} Month, Day
 */
function monthDayDate(dateString) {
    // Split the date string and create a Date object with local time
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day); // Month is zero-based in JavaScript Date

    // Format the date to "Month Day" format
    const options = { month: 'long', day: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-US', options);

    return formattedDate;
}