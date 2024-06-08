/**
 * event listener to change the percentage of the circle depending on the amount of tasks completed
 */
document.addEventListener("DOMContentLoaded", (event) => {
    console.log("DOM fully loaded and parsed");

    // Controls and parses the Due Soon Container
    const dueSection = document.getElementById('dueSoonContainer');
    let tasks = JSON.parse(localStorage.getItem('tasks'));
    if (tasks && (tasks.length !== 0)){
        // Runs through all tasks
        for (const task of tasks) {
            const listOfH3 = dueSection.querySelectorAll('h3');
            const indexOfh3 = Array.from(listOfH3).findIndex(h3 => h3.innerHTML === monthDayDate(task.date));
            // We only want 3 dates to show
            if (listOfH3.length !== 3 && indexOfh3 === -1 && task.completed === false && task.date !== null) {
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
                    // Check if this was already printed the current bug prints multiple times
                    const moreTaskText = 'You have more tasks for this day ...';
                    const listLiIndex = Array.from(listSibling.querySelectorAll('li')).findIndex(li => li.innerHTML === moreTaskText);
                    if (listLiIndex === -1) {
                        const listItemText = document.createElement('li');
                        listItemText.innerHTML = moreTaskText;
                        listSibling.appendChild(listItemText);
                    }
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
    let progressPercent = completedTasks / totalTasks;
    console.log('Test');

    if(isNaN(progressPercent)) {
        progressPercent = 1;
    }

    //Will use later for changing the task amount

    // if(isNaN(progressPercent)) {
    //     progressPercent = 1;
    // }

    // if(isNaN(progressPercent)) {
    //     progressPercent = 1;
    // }

    // if(isNaN(progressPercent)) {
    //     progressPercent = 1;
    // }

    // Changes progress animation 
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

    // These functions will dynamically parse events and code log
    const codeUpdate = document.getElementById('contentCodeUpdate');
    const codeUpdateUL = codeUpdate.querySelectorAll('ul');
    const logs = JSON.parse(localStorage.getItem('logs'));
    const events = JSON.parse(localStorage.getItem('events'));

    if (!events || events.length == 0) {
        const nothingTextLi = document.createElement('li');
        nothingTextLi.innerHTML = 'None';
        codeUpdateUL[0].appendChild(nothingTextLi);
    }
    else {
        for (event of events) {
            if (codeUpdateUL[0].children.length !== 3 && event.date !== "") {
                const eventLi = document.createElement('li');
                if (event.time !== "") {
                    eventLi.innerHTML = '(' + monthDayDate(event.date)+ ', ' + event.time + ') ' +  event.title;
                }
                else {  
                    eventLi.innerHTML = '(' + monthDayDate(event.date)+ ') ' + event.title;
                }
                codeUpdateUL[0].appendChild(eventLi); 
            }
        }
    }

    
    // Parses at most 3 logs to show in the recent updates
    if (!logs || logs.length == 0) {
        const nothingTextLi = document.createElement('li');
        nothingTextLi.innerHTML = 'None';
        codeUpdateUL[1].appendChild(nothingTextLi);
    }
    else {
        let i = logs.length-1;
        while ((i > -1) && (i > logs.length-1 - 3)) {
            const logListItem = document.createElement('li');
            const content = logs[i].content;
            const lines = content.split('\n');
            const firstLine = lines[0];
            const cleanedFirstLine = firstLine.replace(/^#+\s*/, '').trim();
            logListItem.innerHTML = monthDayTime(logs[i].date, logs[i].time) + ' '  + cleanedFirstLine;
            codeUpdateUL[1].appendChild(logListItem);
            i--;
        }
    }
});


/**
 * progressCalculator calculates the length of the bar based on percentage of tasks completed in taskList
 * 
 * @param {float} taskListPercent the decimal percent from 0 to 1. e.g. .25 is 25%
 * @returns {float} The number that determines the circle length
 */
export function progressCalculator(taskListPercent) {
    return taskListPercent * 283;
}


/**
 * changesProgressText sets the text value of the progress circle
 * 
 * @param {float} percent 
 * @returns {void} 
 */
export function changeProgressText(percent) {
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
export function convertToPercentage(decimal) {
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
export function monthDayDate(dateString) {
    // Split the date string and create a Date object with local time
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day); // Month is zero-based in JavaScript Date
    // Format the date to "Month Day" format
    const options = { month: 'long', day: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-US', options);

    return formattedDate;
}

/**
 * Converts date of Month Day, Year with time to "(Month, Day, Time)"
 * 
 * @param {String} dateString
 * @param {String} timeString
 * @returns {String} "(Month, Day, Time)"
 */
export function monthDayTime(dateString, timeString) {
    // Split the date string and create a Date object with local time
    const datePart = dateString.split(',')[0];
    // Combine the extracted date part and time string into the desired format
    const formattedDate = `(${datePart}, ${timeString})`;
    return formattedDate;
}