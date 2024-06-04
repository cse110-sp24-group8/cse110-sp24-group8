/**
 * event listener to change the percentage of the circle depending on the amount of tasks completed
 */

document.addEventListener("DOMContentLoaded", (event) => {
    console.log("DOM fully loaded and parsed");
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