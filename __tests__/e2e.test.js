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
      await page.type('.text-wrapper', 'hi1');
  
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

    //check local storage & organization by date of tasks.

    //Yes title yes date, today
    //check local storage & organization by date of tasks.

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

  // Test the functionality to add a log entry and then close the modal using the cross button
  describe("Add and cancel a log entry", () => {
    test("Click the button to add a log entry and close modal with cross button", async () => {
      // Ensure the add log entry button is present and click it
      await page.waitForSelector('.add-log-btn');
      await page.click('.add-log-btn');

      // Check if the add log modal appears
      const modalVisibleBefore = await page.$eval('#addLogModal', el => el.style.display === 'block');
      expect(modalVisibleBefore).toBe(true);

      await page.waitForSelector('.close');
      await page.click('.close');
      // Verify the modal is closed
      const modalVisibleAfter = await page.$eval('#addLogModal', el => el.style.display === 'none');
      expect(modalVisibleAfter).toBe(true);
    });
  });

});



});