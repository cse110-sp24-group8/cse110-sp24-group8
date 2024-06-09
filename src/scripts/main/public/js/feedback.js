/**
 * Initializes the feedback system when the DOM content is fully loaded.
 */
document.addEventListener('DOMContentLoaded', () => {
    const addFeedbackButton = document.getElementById('openModal');
    const feedbackContainer = document.getElementById('feedbackContainer');
  
    addFeedbackButton.addEventListener('click', addFeedbackTicket);
  
    // Load existing feedback from localStorage
    loadFeedbackFromLocalStorage();
  
    /**
     * Adds a new feedback ticket to the feedback container.
     */
    function addFeedbackTicket() {
        const currentDate = new Date();
        const formattedDate = formatDate(currentDate);
        const formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const uniqueId = generateUniqueId();
  
        const feedbackList = document.createElement('div');
        feedbackList.className = 'feedbacklist';
        feedbackList.setAttribute('data-id', uniqueId);
  
        feedbackList.innerHTML = `
            <div class="fieldD1"> 
                <button class="delete-btn">
                    <img src="../img/task-delete.svg" alt="Delete" width="26" height="26">
                </button>
                <p class="date-feedback">Date: ${formattedDate}</p>                        
                <p class="time-feedback">Time: ${formattedTime}</p>
            </div>
            <div class="fieldD2">
                <h2 class="question-feedback">Question:</h2>
                <textarea class="user_question" rows="3" placeholder="Enter a Question"></textarea>
                <h2 class="answer-feedback">Answer:</h2>
                <textarea class="user_answer" rows="3" placeholder="Enter received answer"></textarea>
            </div>
        `;
  
        feedbackContainer.prepend(feedbackList);
  
        // Save feedback to localStorage
        saveFeedbackToLocalStorage(uniqueId, formattedDate, formattedTime);
    }
  
    /**
     * Formats a date object into a string with the format "Month Day, Year".
     * 
     * @param {Date} date - The date object to format.
     * @returns {string} The formatted date string.
     */
    function formatDate(date) {
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        const formattedDate = date.toLocaleDateString('en-US', options);
        const day = date.getDate();
        const suffix = getSuffix(day);
        return formattedDate.replace(/\b(\d{1,2})(th|nd|rd|st)\b/gi, `$1${suffix}`);
    }
  
    /**
     * Returns the appropriate suffix for a given day of the month.
     * 
     * @param {number} day - The day of the month.
     * @returns {string} The suffix for the day.
     */
    function getSuffix(day) {
        switch (day % 10) {
            case 1:
                return 'st';
            case 2:
                return 'nd';
            case 3:
                return 'rd';
            default:
                return 'th';
        }
    }
  
    /**
     * Generates a unique identifier.
     * 
     * @returns {string} A unique identifier string.
     */
    function generateUniqueId() {
        return 'id-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
    }
  
    /**
     * Saves feedback information to localStorage.
     * 
     * @param {string} id - The unique identifier for the feedback.
     * @param {string} date - The date of the feedback.
     * @param {string} time - The time of the feedback.
     */
    function saveFeedbackToLocalStorage(id, date, time) {
        const feedbacks = JSON.parse(localStorage.getItem('feedbacks')) || [];
        const feedback = {
            id: id,
            date: date,
            time: time,
            question: '',
            answer: ''
        };
        feedbacks.push(feedback);
        localStorage.setItem('feedbacks', JSON.stringify(feedbacks));
    }
  
    /**
     * Loads feedback information from localStorage and displays it in the feedback container.
     */
    function loadFeedbackFromLocalStorage() {
        const feedbacks = JSON.parse(localStorage.getItem('feedbacks')) || [];
  
        feedbacks.forEach(feedback => {
            const feedbackList = document.createElement('div');
            feedbackList.className = 'feedbacklist';
            feedbackList.setAttribute('data-id', feedback.id);
  
            feedbackList.innerHTML = `
                <div class="fieldD1"> 
                    <p class="date-feedback">Date: ${feedback.date}</p>                        
                    <p class="time-feedback">Time: ${feedback.time}</p>
                    <button class="delete-btn">
                        <img src="../img/task-delete.svg" alt="Delete" width="26" height="26">
                    </button>
                </div>
                <div class="fieldD2">
                    <h2 class="question-feedback">Question:</h2>
                    <textarea class="user_question" rows="3" placeholder="Enter a Question">${feedback.question}</textarea>
                    <h2 class="answer-feedback">Answer:</h2>
                    <textarea class="user_answer" rows="3" placeholder="Enter received answer">${feedback.answer}</textarea>
                </div>
            `;
  
            feedbackContainer.prepend(feedbackList);
        });
    }
  
    /**
     * Updates feedback information in localStorage when the user modifies it.
     */
    feedbackContainer.addEventListener('input', (event) => {
        if (event.target.classList.contains('user_question') || event.target.classList.contains('user_answer')) {
            const feedbackList = event.target.closest('.feedbacklist');
            const id = feedbackList.getAttribute('data-id');
            const question = feedbackList.querySelector('.user_question').value;
            const answer = feedbackList.querySelector('.user_answer').value;
  
            updateFeedbackInLocalStorage(id, question, answer);
        }
    });
  
    /**
     * Updates a feedback entry in localStorage.
     * 
     * @param {string} id - The unique identifier of the feedback.
     * @param {string} question - The user's question.
     * @param {string} answer - The received answer.
     */
    function updateFeedbackInLocalStorage(id, question, answer) {
        let feedbacks = JSON.parse(localStorage.getItem('feedbacks')) || [];
  
        feedbacks = feedbacks.map(feedback => {
            if (feedback.id === id) {
                return { ...feedback, question, answer };
            }
            return feedback;
        });
  
        localStorage.setItem('feedbacks', JSON.stringify(feedbacks));
    }
  
    /**
     * Deletes a feedback entry from localStorage.
     */
    feedbackContainer.addEventListener('click', (event) => {
        if (event.target.closest('.delete-btn')) {
            const feedbackList = event.target.closest('.feedbacklist');
            const id = feedbackList.getAttribute('data-id');
  
            feedbackList.remove();
            deleteFeedbackFromLocalStorage(id);
        }
    });
  
    /**
     * Deletes a feedback entry from localStorage.
     * 
     * @param {string} id - The unique identifier of the feedback.
     */
    function deleteFeedbackFromLocalStorage(id) {
        let feedbacks = JSON.parse(localStorage.getItem('feedbacks')) || [];
  
        feedbacks = feedbacks.filter(feedback => feedback.id !== id);
  
        localStorage.setItem('feedbacks', JSON.stringify(feedbacks));
    }
});
