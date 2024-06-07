describe("Exhaustive E2E testing based on user flow for website.", () => {
  // First, visit the app hosted by live server
  beforeAll(async () => {
      await page.goto("http://127.0.0.1:6969");
  });


  //We will write all of the tests in this e2e.test.js file. 

  //Dashboard basic button tests & basic sidebar navigation back to dashboard
  describe("Dashboard Page Tests", () => {
    test("Test view all tasks button", async () => {
      await page.waitForSelector('#viewAllTasksButton');
      await page.click('#viewAllTasksButton');
      const taskListUrl = await page.url();
      expect(taskListUrl).toContain('html/task-list.html');
      await page.click('.sideButton img[alt="Dashboard Icon"]');
    });

    test("Test view code log button", async () => {
      await page.waitForSelector('#viewCodeLogButton');
      await page.click('#viewCodeLogButton');
      const codeLogUrl = await page.url();
      expect(codeLogUrl).toContain('html/code-log.html');
      await page.click('.sideButton img[alt="Dashboard Icon"]');
    });

    test("Test view documentation button", async () => {
      await page.waitForSelector('#viewDocumentationButton');
      await page.click('#viewDocumentationButton');
      const documentationUrl = await page.url();
      expect(documentationUrl).toContain('html/documentation.html');
      await page.click('.sideButton img[alt="Dashboard Icon"]');
    });
  });

  //Task List Tests
  describe("Task List Page Tests", () => {
    beforeAll(async () => {
      await page.goto("http://127.0.0.1:6969/html/task-list.html");
      await page.evaluate(() => localStorage.clear());
    });
    
    test("Click the button to add a task and test cross button", async () => {
      await page.waitForSelector('.union');
      await page.click('.union');
      await page.waitForSelector('#closeModal');
      await page.click('#closeModal');
      const modalVisible = await page.$eval('#pageModal', el => el.style.display === 'block');
      expect(modalVisible).toBe(false);

      //Task List should still be empty
      const tasks = await page.evaluate(() => localStorage.getItem('tasks'));
      expect(tasks).toBeNull();
    });
    
    test("Click the button to add a task and test cancel button", async () => {
      await page.waitForSelector('.union');
      await page.click('.union');
      await page.click('#cancel');
      const modalVisible = await page.$eval('#pageModal', el => el.style.display === 'block');
      expect(modalVisible).toBe(false);

      //Task List should still be empty
      const tasks = await page.evaluate(() => localStorage.getItem('tasks'));
      expect(tasks).toBeNull();
    });

    test("Click the button to add a task with no title and no date", async () => {
      await page.waitForSelector('.union');
      await page.click('.union');

      // Handle the alert dialog
      page.on('dialog', async dialog => {
        expect(dialog.message()).toBe('Please enter a task name.');
        await dialog.dismiss();
      });
      
      //Task List should still be empty
      await page.click('#addTaskButton');
      const tasks = await page.evaluate(() => localStorage.getItem('tasks'));
      expect(tasks).toBeNull();
    });

    test("Click the button to add a task with a date but no title", async () => {

      await page.waitForSelector('.union');
      await page.click('.union');

      page.on('dialog', async dialog => {
        expect(dialog.message()).toBe('Please enter a task name.');
      });

      // Set a date in the date picker
      await page.waitForSelector('.date-wrapper');
      await page.click('.date-wrapper');
      await page.type('.date-wrapper', '06062024'); // Example date
      
      // Attempt to add the task
      //Task List should still be empty
      await page.click('#addTaskButton'); 
      const tasks = await page.evaluate(() => localStorage.getItem('tasks'));
      expect(tasks).toBeNull();
      await page.click('#closeModal'); 
    });

    //Yes title no date
    test("Add a task with title 'hi1' and no date", async () => {
      // Open the modal to add a task
      await page.click('.union');
  
      // Type the task title
      await page.type('input[type="text"].text-wrapper', 'hi1');
  
      // Click the add task button
      await page.click('#addTaskButton');
  
      // Check the local storage for tasks
      const tasks = await page.evaluate(() => JSON.parse(localStorage.getItem('tasks')));
  
      // Verify the number of tasks in local storage
      expect(tasks.length).toBe(1);
  
      // Verify the task's contents
      expect(tasks[0].text).toBe('hi1');
      expect(tasks[0].date).toBe(null);

      //Check displayed content to be accurate
      const taskText = await page.$eval('.text-wrapper', el => el.textContent.trim());
      const taskDate = await page.$eval('.date-wrapper', el => el.textContent.trim());
      expect(taskText).toBe('hi1');
      expect(taskDate).toBe('No Due Date');
    });


    //Yes title yes date, today
    test("Add a task with title 'hi2' and today's date", async () => {
      // Open the modal to add a task
      await page.click('.union');
  
      // Type the task title in the specific input field
      await page.type('input[type="text"].text-wrapper', 'hi2');
  
      // Select today's date in dd/mm/yyyy format
      const today = new Date();
      const day = String(today.getDate()).padStart(2, '0');
      const month = String(today.getMonth() + 1).padStart(2, '0'); // Month is zero-based
      const year = today.getFullYear();
      const formattedToday = `${day}/${month}/${year}`;
  
      // Set the date input value
      await page.evaluate((formattedToday) => {
        document.querySelector('input[type="date"].date-wrapper').value = formattedToday.split('/').reverse().join('-'); // Set value in yyyy-mm-dd format
      }, formattedToday);
  
      // Click the add task button
      await page.click('#addTaskButton');
  
      // Check the local storage for tasks
      const tasks = await page.evaluate(() => JSON.parse(localStorage.getItem('tasks')));
  
      // Verify the number of tasks in local storage
      expect(tasks.length).toBe(2);
  
      // Verify the task's contents for hi2
      expect(tasks[1].text).toBe('hi2');
      expect(tasks[1].date).toBe(`${year}-${month}-${day}`); // Ensure it is in yyyy-mm-dd format
  
      // Verify the displayed task text and date in the DOM
      const taskTexts = await page.$$eval('.tasks-container .text-wrapper', els => els.map(el => el.textContent.trim()));
      const taskDates = await page.$$eval('.tasks-container .date-wrapper', els => els.map(el => el.innerHTML.trim()));
  
      expect(taskTexts[0]).toBe('hi1');
      expect(taskDates[0]).toBe('No Due Date');
      expect(taskTexts[1]).toBe('hi2');
      expect(taskDates[1]).toBe('<span style="color:black;">Today</span>');
    });
    

    //yes title yes date, tommorow
    //check local storage & organization by date of tasks.

    //yes title yes date, anytime in the past, should be OVERDUE
    //check local storage & organization by date of tasks.
  
    //add 5 more tasks yes title yes date, all today. check local storage & dashboard (due soon & percentage)
    
    //strikethrough 2.

    //unstrikethrough 1. 

    //delete 3. check local storage & dashboard.

    //edit, change content, cancel edit.
    //edit, change content, cross edit. 
    //edit, change content, save edit. 

    
  
  });
  

  // Code Log Tests
describe("Code Log Tests", () => {
  beforeAll(async () => {
    await page.goto("http://127.0.0.1:6969/html/code-log.html");
  });

  describe("Add and cancel a log entry", () => {
    test("Click the button to add a log entry and close modal with cross button", async () => {
      await page.waitForSelector('.add-log-btn');
      await page.click('.add-log-btn');

      const modalVisibleBefore = await page.$eval('#addLogModal', el => el.style.display === 'block');
      expect(modalVisibleBefore).toBe(true);

      await page.waitForSelector('.close');
      await page.click('.close');
      const modalVisibleAfter = await page.$eval('#addLogModal', el => el.style.display === 'none');
      expect(modalVisibleAfter).toBe(true);
    });
  });


test("Add an empty log entry", async () => {
  await page.waitForSelector('.add-log-btn');
  await page.click('.add-log-btn');
  const modalVisibleBefore = await page.$eval('#addLogModal', el => el.style.display === 'block');
  expect(modalVisibleBefore).toBe(true);

  await page.waitForSelector('button.frame');
  await page.evaluate(() => {
    const addButton = document.querySelector('button.frame');
    addButton.scrollIntoView();
  });

  await page.click('button.frame');

  await page.waitForSelector('.log-entry');
  const isLogEntryCorrect = await page.evaluate(() => {
    const lastLogEntry = document.querySelector('.logs-container .log-entry:last-child');
    const dateDisplayed = lastLogEntry.querySelector('.date-codelog').textContent.includes('Date:');
    const timeDisplayed = lastLogEntry.querySelector('.time-codelog').textContent.includes('Time:');
    const isEmptyDisplayed = lastLogEntry.querySelector('.fieldD2 .placeholder-text') && lastLogEntry.querySelector('.fieldD2 .placeholder-text').textContent.trim() === 'Empty';

    return dateDisplayed && timeDisplayed && isEmptyDisplayed;
  });

  expect(isLogEntryCorrect).toBe(true);
});
//text test 
test("Add a log entry with 'general text test'", async () => {
  await page.waitForSelector('.add-log-btn');
  await page.click('.add-log-btn');
  await page.waitForSelector('.CodeMirror');
  await page.click('.CodeMirror'); 
  await page.type('.CodeMirror', 'general text test'); 
  await page.waitForSelector('button.frame');
  await page.evaluate(() => document.querySelector('button.frame').scrollIntoView());
  await page.click('button.frame');
  await page.waitForSelector('.log-entry');

  const isLogEntryCorrect = await page.evaluate(() => {
    const lastLogEntry = document.querySelector('.logs-container .log-entry:last-child');
    const dateDisplayed = lastLogEntry.querySelector('.date-codelog').textContent.includes('Date:');
    const timeDisplayed = lastLogEntry.querySelector('.time-codelog').textContent.includes('Time:');
    const contentDisplayed = lastLogEntry.querySelector('.fieldD2 pre').textContent.trim() === 'general text test';

    return dateDisplayed && timeDisplayed && contentDisplayed;
  });

  expect(isLogEntryCorrect).toBe(true);
});
//delete functionality
test("Add a log entry with 'general text test'", async () => {
  await page.click('delete-button');

  const modalDeleted = await page.$eval('#addLogModal', el => el.style.display === 'none');
  expect(modalDeleted).toBe(true);

});




});
});