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
    

    //Yes title yes date, tommorow
    test("Add a task with title 'hi3' and tomorrow's date", async () => {
      // Open the modal to add a task
      await page.click('.union');
  
      // Type the task title in the specific input field
      await page.type('input[type="text"].text-wrapper', 'hi3');
  
      // Select tomorrow's date in dd/mm/yyyy format
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      const day = String(tomorrow.getDate()).padStart(2, '0');
      const month = String(tomorrow.getMonth() + 1).padStart(2, '0'); // Month is zero-based
      const year = tomorrow.getFullYear();
      const formattedTomorrow = `${day}/${month}/${year}`;
  
      // Set the date input value
      await page.evaluate((formattedTomorrow) => {
        document.querySelector('input[type="date"].date-wrapper').value = formattedTomorrow.split('/').reverse().join('-'); // Set value in yyyy-mm-dd format
      }, formattedTomorrow);
  
      // Click the add task button
      await page.click('#addTaskButton');
  
      // Check the local storage for tasks
      const tasks = await page.evaluate(() => JSON.parse(localStorage.getItem('tasks')));
  
      // Verify the number of tasks in local storage
      expect(tasks.length).toBe(3);
  
      // Verify the task's contents for hi3
      expect(tasks[2].text).toBe('hi3');
      expect(tasks[2].date).toBe(`${year}-${month}-${day}`); // Ensure it is in yyyy-mm-dd format
  
      // Verify the displayed task text and date in the DOM
      const taskTexts = await page.$$eval('.tasks-container .text-wrapper', els => els.map(el => el.textContent.trim()));
      const taskDates = await page.$$eval('.tasks-container .date-wrapper', els => els.map(el => el.innerHTML.trim()));
  
      expect(taskTexts[0]).toBe('hi1');
      expect(taskDates[0]).toBe('No Due Date');
      expect(taskTexts[1]).toBe('hi2');
      expect(taskDates[1]).toBe('<span style="color:black;">Today</span>');
      expect(taskTexts[2]).toBe('hi3');
      expect(taskDates[2]).toBe('<span style="color:black;">Tomorrow</span>');
    });

    //yes title yes date, anytime in the past, should be OVERDUE. We will do yesterday arbitrarily.
    test("Add a task with title 'hi4' and yesterday's date", async () => {
      // Open the modal to add a task
      await page.click('.union');
  
      // Type the task title in the specific input field
      await page.type('input[type="text"].text-wrapper', 'hi4');
  
      // Select yesterday's date in dd/mm/yyyy format
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      const day = String(yesterday.getDate()).padStart(2, '0');
      const month = String(yesterday.getMonth() + 1).padStart(2, '0'); // Month is zero-based
      const year = yesterday.getFullYear();
      const formattedYesterday = `${day}/${month}/${year}`;
  
      // Set the date input value
      await page.evaluate((formattedYesterday) => {
        document.querySelector('input[type="date"].date-wrapper').value = formattedYesterday.split('/').reverse().join('-'); // Set value in yyyy-mm-dd format
      }, formattedYesterday);
  
      // Click the add task button
      await page.click('#addTaskButton');
  
      // Check the local storage for tasks
      const tasks = await page.evaluate(() => JSON.parse(localStorage.getItem('tasks')));
  
      // Verify the number of tasks in local storage
      expect(tasks.length).toBe(4);
  
      // Verify the task's contents for hi4
      expect(tasks[3].text).toBe('hi4');
      expect(tasks[3].date).toBe(`${year}-${month}-${day}`); // Ensure it is in yyyy-mm-dd format
  
      // Verify the displayed task text and date in the DOM
      const taskTexts = await page.$$eval('.tasks-container .text-wrapper', els => els.map(el => el.textContent.trim()));
      const taskDates = await page.$$eval('.tasks-container .date-wrapper', els => els.map(el => el.innerHTML.trim()));
  
      expect(taskTexts[0]).toBe('hi1');
      expect(taskDates[0]).toBe('No Due Date');
      expect(taskTexts[1]).toBe('hi4');
      expect(taskDates[1]).toBe('<span style="color: red;">OVERDUE</span>');
      expect(taskTexts[2]).toBe('hi2');
      expect(taskDates[2]).toBe('<span style="color:black;">Today</span>');
      expect(taskTexts[3]).toBe('hi3');
      expect(taskDates[3]).toBe('<span style="color:black;">Tomorrow</span>');
  
      // Verify the text color is red for the overdue task
      const overdueTaskColor = await page.$eval('.tasks-container .date-wrapper span[style="color: red;"]', el => window.getComputedStyle(el).color);
      expect(overdueTaskColor).toBe('rgb(255, 0, 0)');
    });

    //add 5 more tasks yes title yes date, all today. check local storage & cross functionality with dashboard (due soon & percentage). Dates are arbitrary.
    test("Add tasks hi5 - hi10 with arbitrary dates, check order, text, Due Soon section, and percentage of tasks done", async () => {
      const addTask = async (title, date) => {
        await page.click('.union');
        await page.type('input[type="text"].text-wrapper', title);
        if (date) {
          await page.evaluate((date) => {
            document.querySelector('input[type="date"].date-wrapper').value = date.split('/').reverse().join('-');
          }, date);
        }
        await page.click('#addTaskButton');
      };
  
      // Helper function to format the date
      const formatDate = (date) => {
        const day = date.getUTCDate();
        const month = date.toLocaleString('default', { month: 'long' });
        const year = date.getUTCFullYear();
        const daySuffix = (day) => {
          if (day > 3 && day < 21) return 'th'; // covers 11-20
          switch (day % 10) {
            case 1: return "st";
            case 2: return "nd";
            case 3: return "rd";
            default: return "th";
          }
        };
        return `${day}${daySuffix(day)} ${month} ${year}`;
      };
  
      const today = new Date();
      const getDate = (daysToAdd) => {
        const date = new Date(today);
        date.setDate(today.getDate() + daysToAdd);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      };
  
      // Adding tasks with arbitrary dates
      await addTask('hi5', getDate(5)); // Date in 5 days
      await addTask('hi6', getDate(-3)); // Date 3 days ago
      await addTask('hi7', getDate(1)); // Tomorrow
      await addTask('hi8', getDate(-1)); // Yesterday
      await addTask('hi9', null); // No due date
      await addTask('hi10', getDate(0)); // Today
  
      // Check the local storage for tasks
      const tasks = await page.evaluate(() => JSON.parse(localStorage.getItem('tasks')));
  
      // Verify the number of tasks in local storage
      expect(tasks.length).toBe(10);
  
      // Expected order: hi9 (No Due Date), hi1 (No Due Date), hi6 (Overdue), hi8 (Overdue), hi4 (Overdue), hi10 (Today), hi2 (Today), hi7 (Tomorrow), hi3 (Tomorrow), hi5 (5 days from now)
      const expectedOrder = ['hi1', 'hi9', 'hi6', 'hi4', 'hi8', 'hi2', 'hi10', 'hi3', 'hi7', 'hi5'];
      const expectedDates = [
        'No Due Date',
        'No Due Date',
        '<span style="color: red;">OVERDUE</span>',
        '<span style="color: red;">OVERDUE</span>',
        '<span style="color: red;">OVERDUE</span>',
        '<span style="color:black;">Today</span>',
        '<span style="color:black;">Today</span>',
        '<span style="color:black;">Tomorrow</span>',
        '<span style="color:black;">Tomorrow</span>',
        formatDate(new Date(getDate(5).split('/').reverse().join('-')))
      ];
  
      // Verify the displayed task text and date in the DOM
      const taskTexts = await page.$$eval('.tasks-container .text-wrapper', els => els.map(el => el.textContent.trim()));
      const taskDates = await page.$$eval('.tasks-container .date-wrapper', els => els.map(el => el.innerHTML.trim()));
  
      for (let i = 0; i < expectedOrder.length; i++) {
        expect(taskTexts[i]).toBe(expectedOrder[i]);
        expect(taskDates[i]).toBe(expectedDates[i]);
      }
  
      // Verify the text color is red for the overdue tasks
      const overdueTaskColors = await page.$$eval('.tasks-container .date-wrapper span[style="color: red;"]', els => els.map(el => window.getComputedStyle(el).color));
      overdueTaskColors.forEach(color => {
        expect(color).toBe('rgb(255, 0, 0)');
      });
  
      // Navigate to the dashboard
      await page.click('.sideButton img[alt="Dashboard Icon"]');
  
      // Verify the tasks in the Due Soon section
      const dueSoonTasks = await page.$$eval('#dueSoonContainer ul li', els => els.map(el => el.textContent.trim()));
      expect(dueSoonTasks).toEqual(['hi10', 'hi2', 'hi7', 'hi3', 'hi5']); // Tasks due today, tomorrow, and s
  
      // Verify the percentage of tasks done shows 0%
      const percentageDone = await page.$eval('#percent', el => el.textContent.trim());
      expect(percentageDone).toBe('0%');
  
      // Verify the local storage for total and completed tasks
      const totalTasks = await page.evaluate(() => localStorage.getItem('totalTasks'));
      const completedTasks = await page.evaluate(() => localStorage.getItem('completedTasks'));
      expect(totalTasks).toBe('10');
      expect(completedTasks).toBe('0');
    });

    //strikethrough 2 of the tasks

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