document.addEventListener('DOMContentLoaded', () => {
    const addFeedbackButton = document.getElementById('openModal');
    const feedbackContainer = document.getElementById('feedbackContainer');
  
    addFeedbackButton.addEventListener('click', addFeedbackTicket);
  
    function addFeedbackTicket() {
      const currentDate = new Date();
      const formattedDate = formatDate(currentDate);
      const formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
      const feedbackList = document.createElement('div');
      feedbackList.className = 'feedbacklist';
  
      feedbackList.innerHTML = `
        <div class="fieldD1">
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
    }
  
    function formatDate(date) {
      const options = { day: 'numeric', month: 'long', year: 'numeric' };
      const formattedDate = date.toLocaleDateString('en-US', options);
      const day = date.getDate();
      const suffix = getSuffix(day);
      return formattedDate.replace(/\b(\d{1,2})(th|nd|rd|st)\b/gi, `$1${suffix}`);
    }
  
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
  });
  