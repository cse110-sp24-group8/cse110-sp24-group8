/**
 * @jest-environment jsdom
 */
const localStorageMock = (() => {
    let store = {};
    return {
      getItem(key) {
        return store[key] || null;
      },
      setItem(key, value) {
        store[key] = value.toString();
      },
      clear() {
        store = {};
      },
      removeItem(key) {
        delete store[key];
      },
    };
  })();
  
  Object.defineProperty(window, 'localStorage', { value: localStorageMock });
  
  import {
    convertToPercentage,
    monthDayDate,
    monthDayTime,
    changeProgressText,
    progressCalculator,
  } from '../../src/scripts/main/public/js/dashboard.js';
  // Adjust the path to your JavaScript file
  
  describe('Dashboard Functions', () => {
    beforeEach(() => {
      document.body.innerHTML = `
              <section id="dueSoonContainer"></section>
              <svg class="progress" viewBox="0 0 100 100"></svg>
              <section id="contentCodeUpdate">
                  <ul></ul>
                  <ul></ul>
              </section>
              <div id="percent"></div>
          `;
  
      localStorage.clear();
    });
  
    test('progressCalculator calculates the correct circle length', () => {
      expect(progressCalculator(0.25)).toBe(70.75);
      expect(progressCalculator(0.5)).toBe(141.5);
      expect(progressCalculator(1)).toBe(283);
    });
  
    test('convertToPercentage converts a decimal to percentage string', () => {
      expect(convertToPercentage(0.25)).toBe('25.00%');
      expect(convertToPercentage(0.5)).toBe('50.00%');
      expect(convertToPercentage(1)).toBe('100.00%');
    });
  
    test('monthDayDate converts date to Month Day format', () => {
      expect(monthDayDate('2024-05-15')).toBe('May 15');
    });
  
    test('monthDayTime converts date and time to (Month, Day, Time) format', () => {
      expect(monthDayTime('May 15, 2024', '13:00')).toBe('(May 15, 13:00)');
    });
  
    // test('changeProgressText sets the text content of progress circle', () => {
    //   changeProgressText(0.5);
    //   const percentText = document.getElementById('percent');
    //   expect(percentText.textContent).toBe('50%');
    // });
  
    // describe('DOMContentLoaded Event Listener', () => {
    //   beforeEach(() => {
    //     localStorage.setItem(
    //       'tasks',
    //       JSON.stringify([
    //         { text: 'Task 1', date: '2024-05-13', completed: false },
    //         { text: 'Task 2', date: '2024-05-13', completed: false },
    //         { text: 'Task 3', date: '2024-05-13', completed: false },
    //         { text: 'Task 4', date: '2024-05-15', completed: false },
    //       ])
    //     );
    //     localStorage.setItem('totalTasks', '4');
    //     localStorage.setItem('completedTasks', '2');
    //   });
  
      // test('DOM fully loaded and parsed', () => {
      //   document.dispatchEvent(new Event('DOMContentLoaded'));
  
      //   const dueSection = document.getElementById('dueSoonContainer');
      //   expect(dueSection.querySelectorAll('h3').length).toBe(2);
      //   expect(dueSection.querySelectorAll('ul').length).toBe(2);
      //   expect(dueSection.querySelectorAll('li').length).toBe(4);
      // });
  
      // test('Progress bar updates correctly', () => {
      //   document.dispatchEvent(new Event('DOMContentLoaded'));
  
      //   const progressBar = document.querySelector('.progress');
      //   const computedStyle = getComputedStyle(progressBar);
      //   expect(computedStyle.animation).toContain('progressAnimation');
      // });
    });
  // });