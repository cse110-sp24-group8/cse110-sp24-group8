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
  
    test('monthDayDate converts date to Month Day format', () => {
      expect(monthDayDate('2024-05-15')).toBe('May 15');
    });
  
    test('monthDayTime converts date and time to (Month, Day, Time) format', () => {
      expect(monthDayTime('May 15, 2024', '13:00')).toBe('(May 15, 13:00)');
    });
  
    test('changeProgressText sets the text content of progress circle', () => {
      changeProgressText(0.5);
      const percentText = document.getElementById('percent');
      expect(percentText.textContent).toBe('50%');
    });
});