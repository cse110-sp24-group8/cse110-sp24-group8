/**
 * @jest-environment jsdom
 */

import { JSDOM } from 'jsdom';

document.body.innerHTML = `
  <button id="openModal"></button>
  <div id="feedbackContainer"></div>
`;

// Import the script to be tested
import { getSuffix } from '../../src/scripts/main/public/js/feedback.js'; // Adjust the path to your JavaScript file

describe('Feedback System', () => {
  beforeEach(async () => {
    // Clear localStorage before each test
    localStorage.clear();
    // Reset the DOM
    document.body.innerHTML = `
    <button id="openModal"></button>
    <div id="feedbackContainer">
      <div class="feedbacklist" data-id="id-1717872352920-705">
        <div class="fieldD1"> 
          <button class="delete-btn">
            <img src="../img/task-delete.svg" alt="Delete" width="26" height="26">
          </button>
          <p class="date-feedback">Date: June 8th, 2024</p>
          <p class="time-feedback">Time: 11:45 AM</p>
        </div>
        <div class="fieldD2">
          <h2 class="question-feedback">Question:</h2>
          <textarea class="userquestion" rows="3" placeholder="Enter a Question"></textarea>
          <h2 class="answer-feedback">Answer:</h2>
          <textarea class="useranswer" rows="3" placeholder="Enter received answer"></textarea>
        </div>
      </div>
    </div>
    `;
    // Re-import the script to re-attach event listeners
    await import('../../src/scripts/main/public/js/feedback.js'); // Adjust the path to your JavaScript file
  });

  test('should add feedback to localStorage', async () => {
    localStorage.clear();
    document.dispatchEvent(new Event('DOMContentLoaded'))
    const addFeedbackButton = document.getElementById('openModal');
    addFeedbackButton.click();
    const feedbackContainer = document.getElementById('feedbackContainer');

    const feedbacks = JSON.parse(localStorage.getItem('feedbacks'));
    expect(feedbacks.length).toBe(1);
  });

  test('should load feedback from localStorage', () => {
    const feedback = {
      id: 'id-123',
      date: 'June 5th, 2023',
      time: '12:34 PM',
      question: 'Sample question?',
      answer: 'Sample answer.'
    };
    localStorage.setItem('feedbacks', JSON.stringify([feedback]));

    // Trigger the DOMContentLoaded event to load feedback from localStorage
    document.dispatchEvent(new Event('DOMContentLoaded'));

    const feedbacks = JSON.parse(localStorage.getItem('feedbacks'));
    expect(feedbacks.length).toBe(1);
  });

  test('should delete feedback from container and localStorage', () => {
    document.dispatchEvent(new Event('DOMContentLoaded'))

    const addFeedbackButton = document.getElementById('openModal');

    addFeedbackButton.click();

    let feedbacks = JSON.parse(localStorage.getItem('feedbacks'));
    const feedbackContainer = document.getElementById('feedbackContainer');
    const feedbackList = feedbackContainer.querySelector('.feedbacklist');
    const deleteButton = feedbackList.querySelector('.delete-btn');
    deleteButton.click();

    feedbacks = JSON.parse(localStorage.getItem('feedbacks'));
    expect(feedbacks.length).toBe(0);
  });
});

describe('getSuffix', () => {
  test('returns "st" for days ending in 1', () => {
    expect(getSuffix(1)).toBe('st');
    expect(getSuffix(21)).toBe('st');
    expect(getSuffix(31)).toBe('st');
  });

  test('returns "nd" for days ending in 2', () => {
    expect(getSuffix(2)).toBe('nd');
    expect(getSuffix(22)).toBe('nd');
  });

  test('returns "rd" for days ending in 3', () => {
    expect(getSuffix(3)).toBe('rd');
    expect(getSuffix(23)).toBe('rd');
  });

  test('returns "th" for days ending in 4-0', () => {
    expect(getSuffix(4)).toBe('th');
    expect(getSuffix(5)).toBe('th');
    expect(getSuffix(6)).toBe('th');
    expect(getSuffix(7)).toBe('th');
    expect(getSuffix(8)).toBe('th');
    expect(getSuffix(9)).toBe('th');
    expect(getSuffix(10)).toBe('th');
    expect(getSuffix(11)).toBe('th'); // special case: 11th
    expect(getSuffix(12)).toBe('th'); // special case: 12th
    expect(getSuffix(13)).toBe('th'); // special case: 13th
    expect(getSuffix(14)).toBe('th');
    expect(getSuffix(20)).toBe('th');
  });
});