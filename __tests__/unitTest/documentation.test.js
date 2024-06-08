import { JSDOM } from 'jsdom';

describe('loadFiles function', () => {
  global.localStorage = {
    storage: {},
    setItem: function (key, value) {
      this.storage[key] = value;
    },
    getItem: function (key) {
      return this.storage[key];
    },
    key: function (i) {
      const keys = Object.keys(this.storage);
      return keys[i];
    },
    length: function () {
      return Object.keys(this.storage).length;
    },
  };

  // Set some keys in localStorage
  global.localStorage.setItem('file_0', 'value_0');
  global.localStorage.setItem('file_1', 'value_1');
  global.localStorage.setItem('file_2', 'value_2');

  it('loads files from localStorage into the file selection dropdown', async () => {
    // Set up the DOM
    const dom = new JSDOM(
      `<!DOCTYPE html><body><select id="fileSelect"></select></body>`
    );
    global.window = dom.window;
    global.document = dom.window.document;
    global.localStorage = {
      length: 3,
      key: (i) => `file_${i}`,
    };

    // Dynamic import of the script
    await import('../../src/scripts/main/public/js/documentation.js');

    // Check if the correct methods were called
    expect(global.localStorage.key(0)).toBe('file_0');
    expect(global.localStorage.key(1)).toBe('file_1');
    expect(global.localStorage.key(2)).toBe('file_2');

    const fileSelect = global.document.getElementById('fileSelect');
    expect(localStorage.length).toBe(3);
  });
});
