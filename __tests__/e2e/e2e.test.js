describe("Exhaustive E2E testing based on user flow for website.", () => {
  // First, visit the app hosted by live server
  beforeAll(async () => {
      await page.goto("http://127.0.0.1:6969");
  });


  // Helper function to format the task list date
  // const formatTaskListDate = (date) => {
  //     const day = date.getUTCDate();
  //     const month = date.toLocaleString('default', { month: 'long' });
  //     const year = date.getUTCFullYear();
  //     const daySuffix = (day) => {
  //         if (day > 3 && day < 21) return 'th'; // covers 11-20
  //         switch (day % 10) {
  //             case 1: return "st";
  //             case 2: return "nd";
  //             case 3: return "rd";
  //             default: return "th";
  //         }
  //     };
  //     return `${day}${daySuffix(day)} ${month} ${year}`;
  // };

  // Helper function to format the Due Soon date
  // const formatDueSoonDate = (date) => {
  //     const day = date.getUTCDate();
  //     const month = date.toLocaleString('default', { month: 'long' });
  //     return `${month} ${day}`;
  // };

  // const getDate = (daysToAdd) => {
  //     const today = new Date();
  //     const date = new Date(today);
  //     date.setDate(today.getDate() + daysToAdd);
  //     const day = String(date.getDate()).padStart(2, '0');
  //     const month = String(date.getMonth() + 1).padStart(2, '0');
  //     const year = date.getFullYear();
  //     return `${day}/${month}/${year}`;
  // };
  const formatTaskListDate = (date) => {
    const day = date.getUTCDate();
    const month = date.toLocaleString('default', { month: 'long', timeZone: 'UTC' });
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

const formatDueSoonDate = (date) => {
    const day = date.getUTCDate();
    const month = date.toLocaleString('default', { month: 'long', timeZone: 'UTC' });
    return `${month} ${day}`;
};

const getDate = (daysToAdd) => {
    const today = new Date();
    const date = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() + daysToAdd));
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();
    return `${day}/${month}/${year}`;
};



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

  // Function to check the displayed task text and date in the DOM
  const checkTaskOrderAndDates = async (expectedOrder, expectedDates) => {
      const taskTexts = await page.$$eval('.tasks-container .text-wrapper', els => els.map(el => el.textContent.trim()));
      const taskDates = await page.$$eval('.tasks-container .date-wrapper', els => els.map(el => el.innerHTML.trim()));

      for (let i = 0; i < expectedOrder.length; i++) {
          expect(taskTexts[i]).toBe(expectedOrder[i]);
          expect(taskDates[i]).toBe(expectedDates[i]);
      }
  };

  // Function to check Due Soon section
  const checkDueSoonSection = async (expectedDueSoonTasks, expectedDueSoonDates) => {
      const dueSoonTasks = await page.$$eval('#dueSoonContainer ul li', els => els.map(el => el.textContent.trim()));
      expect(dueSoonTasks).toEqual(expectedDueSoonTasks);

      const dueSoonDates = await page.$$eval('#dueSoonContainer h3', els => els.map(el => el.textContent.trim()));
      expect(dueSoonDates).toEqual(expectedDueSoonDates);
  };

  // Helper function to strikethrough a task by clicking its checkbox
  const strikeThroughTask = async (taskText) => {
    const taskIndex = await page.$$eval('.tasks-container .text-wrapper', (els, taskText) => {
        return els.findIndex(el => el.textContent.trim() === taskText);
    }, taskText);

    const taskCheckboxSelector = `.tasks-container .overlap:nth-child(${taskIndex + 1}) input[type="checkbox"]`;
    await page.click(taskCheckboxSelector);
  };

  //helper function to edit task
  const editTask = async (taskText, newText, newDate, shouldSave) => {
    const taskIndex = await page.$$eval('.tasks-container .text-wrapper', (els, taskText) => {
        return els.findIndex(el => el.textContent.trim() === taskText);
    }, taskText);
    
    const taskEditSelector = `.tasks-container .overlap:nth-child(${taskIndex + 1}) .edit-btn img`;
    await page.click(taskEditSelector);
    
    await page.waitForSelector('.edit-list .text-wrapper1');
    await page.click('.edit-list .text-wrapper1', { clickCount: 3 });
    await page.type('.edit-list .text-wrapper1', newText);

    if (newDate) {
        await page.click('.edit-list .date-wrapper1', { clickCount: 3 });
        await page.type('.edit-list .date-wrapper1', newDate);
    }

    if (shouldSave) {
        await page.click('.edit-list .frame1');
    } else {
        await page.click('#closeModal');
    }
};

  // Dashboard basic button tests & basic sidebar navigation tests
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

    test("Test view events button", async () => {
      await page.waitForSelector('#viewEventsButton');
      await page.click('#viewEventsButton');
      const documentationUrl = await page.url();
      expect(documentationUrl).toContain('html/team-calendar.html');
      await page.click('.sideButton img[alt="Dashboard Icon"]');
    });
  });

  // Task List Tests & Cross Features with Dashboard Tests (Due Soon & Percentage) & Cross Features with Calendar (Tasks Show Up on Calendar)
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

      // Task List should still be empty
      const tasks = await page.evaluate(() => localStorage.getItem('tasks'));
      expect(tasks).toBeNull();
    });

    test("Click the button to add a task and test cancel button", async () => {
      await page.waitForSelector('.union');
      await page.click('.union');
      await page.click('#cancel');
      const modalVisible = await page.$eval('#pageModal', el => el.style.display === 'block');
      expect(modalVisible).toBe(false);

      // Task List should still be empty
      const tasks = await page.evaluate(() => localStorage.getItem('tasks'));
      expect(tasks).toBe("[]");
    });

    test("Click the button to add a task with no title and no date", async () => {
      await page.waitForSelector('.union');
      await page.click('.union');

      // Handle the alert dialog
      page.once('dialog', async dialog => {
        expect(dialog.message()).toBe('Please enter a task name.');
        await dialog.dismiss();
      });

      await page.waitForSelector('#addTaskButton');
      await page.click('#addTaskButton');
  
      // Task List should still be empty
      const tasks = await page.evaluate(() => localStorage.getItem('tasks'));
      expect(tasks).toBe("[]");
    });

    test("Click the button to add a task with a date but no title", async () => {
      await page.waitForSelector('.union');
      await page.click('.union');

      page.once('dialog', async dialog => {
        expect(dialog.message()).toBe('Please enter a task name.');
        await dialog.dismiss();
      });

      // Set a date in the date picker
      await page.waitForSelector('.date-wrapper');
      await page.click('.date-wrapper');
      await page.type('.date-wrapper', '06062024'); // Example date
      
      // Attempt to add the task
      // Task List should still be empty
      await page.click('#addTaskButton'); 
      await page.click('#closeModal'); 
      const tasks = await page.evaluate(() => localStorage.getItem('tasks'));
      expect(tasks).toBe("[]");
    });

    // Yes title no date
    test("Add a task with title 'hi1' and no date", async () => {
      await addTask('hi1', null);
  
      // Check the local storage for tasks
      const tasks = await page.evaluate(() => JSON.parse(localStorage.getItem('tasks')));
      expect(tasks.length).toBe(1);
      expect(tasks[0].text).toBe('hi1');
      expect(tasks[0].date).toBe(null);

      // Check displayed content to be accurate
      await checkTaskOrderAndDates(['hi1'], ['No Due Date']);
    });

    // Yes title yes date, today
    test("Add a task with title 'hi2' and today's date", async () => {
      const today = getDate(0);
      await addTask('hi2', today);
  
      const tasks = await page.evaluate(() => JSON.parse(localStorage.getItem('tasks')));
      expect(tasks.length).toBe(2);
      expect(tasks[1].text).toBe('hi2');
      expect(tasks[1].date).toBe(today.split('/').reverse().join('-'));

      await checkTaskOrderAndDates(['hi1', 'hi2'], ['No Due Date', '<span>Today</span>']);
    });

    // Yes title yes date, tomorrow
    test("Add a task with title 'hi3' and tomorrow's date", async () => {
      const tomorrow = getDate(1);
      await addTask('hi3', tomorrow);

      const tasks = await page.evaluate(() => JSON.parse(localStorage.getItem('tasks')));
      expect(tasks.length).toBe(3);
      expect(tasks[2].text).toBe('hi3');
      expect(tasks[2].date).toBe(tomorrow.split('/').reverse().join('-'));

      await checkTaskOrderAndDates(['hi1', 'hi2', 'hi3'], ['No Due Date', '<span>Today</span>', '<span>Tomorrow</span>']);
    });

    // Yes title yes date, anytime in the past, should be OVERDUE. We will do yesterday arbitrarily.
    test("Add a task with title 'hi4' and yesterday's date", async () => {
      const yesterday = getDate(-1);
      await addTask('hi4', yesterday);

      const tasks = await page.evaluate(() => JSON.parse(localStorage.getItem('tasks')));
      expect(tasks.length).toBe(4);
      expect(tasks[1].text).toBe('hi4');
      expect(tasks[1].date).toBe(yesterday.split('/').reverse().join('-'));

      await checkTaskOrderAndDates(
        ['hi1', 'hi4', 'hi2', 'hi3'],
        ['No Due Date', '<span style="color: red;">OVERDUE</span>', '<span>Today</span>', '<span>Tomorrow</span>']
      );

      // Verify the text color is red for the overdue task
      const overdueTaskColor = await page.$eval('.tasks-container .date-wrapper span[style="color: red;"]', el => window.getComputedStyle(el).color);
      expect(overdueTaskColor).toBe('rgb(255, 0, 0)');
    });

    // Add 5 more tasks yes title yes date, all arbitrary dates. Check local storage & cross functionality with dashboard (due soon & percentage) & calendar (tasks show up on correct dates)
    test("Add tasks hi5 - hi12 with arbitrary dates, check order, text, Due Soon section, and percentage of tasks done", async () => {
      await addTask('hi5', getDate(5)); // Date in 5 days
      await addTask('hi6', getDate(-3)); // Date 3 days ago
      await addTask('hi7', getDate(1)); // Tomorrow
      await addTask('hi8', getDate(-1)); // Yesterday
      await addTask('hi9', null); // No due date
      await addTask('hi10', getDate(0)); // Today
      await addTask('hi11', getDate(0)); // Today
      await addTask('hi12', getDate(0)); // Today
  
      const tasks = await page.evaluate(() => JSON.parse(localStorage.getItem('tasks')));
      expect(tasks.length).toBe(12);

      const expectedOrder = ['hi1', 'hi9', 'hi6', 'hi4', 'hi8', 'hi2', 'hi10', 'hi11', 'hi12', 'hi3', 'hi7', 'hi5'];
      const expectedDates = [
          'No Due Date', 'No Due Date',
          '<span style="color: red;">OVERDUE</span>', '<span style="color: red;">OVERDUE</span>', '<span style="color: red;">OVERDUE</span>',
          '<span>Today</span>', '<span>Today</span>', '<span>Today</span>', '<span>Today</span>',
          '<span>Tomorrow</span>', '<span>Tomorrow</span>',
          formatTaskListDate(new Date(getDate(5).split('/').reverse().join('-')))
      ];

      await checkTaskOrderAndDates(expectedOrder, expectedDates);

      // Verify the text color is red for the overdue tasks
      const overdueTaskColors = await page.$$eval('.tasks-container .date-wrapper span[style="color: red;"]', els => els.map(el => window.getComputedStyle(el).color));
      overdueTaskColors.forEach(color => {
          expect(color).toBe('rgb(255, 0, 0)');
      });

      await page.click('.sideButton img[alt="Dashboard Icon"]');

      const expectedDueSoonTasks = ['hi6', 'hi4', 'hi8', 'hi2', 'hi10', 'hi11', 'You have more tasks for this day ...'];
      const expectedDueSoonDates = [
        formatDueSoonDate(new Date(getDate(-3).split('/').reverse().join('-'))),
        formatDueSoonDate(new Date(getDate(-1).split('/').reverse().join('-'))),
        formatDueSoonDate(new Date(getDate(0).split('/').reverse().join('-')))
      ];
      await checkDueSoonSection(expectedDueSoonTasks, expectedDueSoonDates);

      // Verify the percentage of tasks done shows 0%
      const percentageDone = await page.$eval('#percent', el => el.textContent.trim());
      expect(percentageDone).toBe('0%');

      await page.click('.sideButton img[alt="Task List Icon"]');
      await page.reload();

      await checkTaskOrderAndDates(expectedOrder, expectedDates);
    });

    // Strikethrough hi1
    test("Strikethrough hi1, check order, strike-through persistence, dashboard updates, and reload", async () => {
      await strikeThroughTask('hi1');

      const expectedOrderAfterStrike = ['hi9', 'hi6', 'hi4', 'hi8', 'hi2', 'hi10', 'hi11', 'hi12', 'hi3', 'hi7', 'hi5', 'hi1'];
      const expectedDatesAfterStrike = [
          'No Due Date', '<span style="color: red;">OVERDUE</span>', '<span style="color: red;">OVERDUE</span>', '<span style="color: red;">OVERDUE</span>',
          '<span>Today</span>', '<span>Today</span>', '<span>Today</span>', '<span>Today</span>',
          '<span>Tomorrow</span>', '<span>Tomorrow</span>',
          formatTaskListDate(new Date(getDate(5).split('/').reverse().join('-'))), 'No Due Date'
      ];

      const taskTextsAfterStrike = await page.$$eval('.tasks-container .text-wrapper', els => els.map(el => el.textContent.trim()));
      const taskDatesAfterStrike = await page.$$eval('.tasks-container .date-wrapper', els => els.map(el => el.innerHTML.trim()));
      const taskStrikeThroughStyles = await page.$$eval('.tasks-container .text-wrapper', els => els.map(el => window.getComputedStyle(el).textDecoration));

      for (let i = 0; i < expectedOrderAfterStrike.length; i++) {
        console.log(`Task: ${taskTextsAfterStrike[i]}, Expected Date: ${expectedDatesAfterStrike[i]}, Actual Date: ${taskDatesAfterStrike[i]}`);
          expect(taskTextsAfterStrike[i]).toBe(expectedOrderAfterStrike[i]);
          expect(taskDatesAfterStrike[i]).toBe(expectedDatesAfterStrike[i]);
          if (expectedOrderAfterStrike[i] === 'hi1') {
              expect(taskStrikeThroughStyles[i]).toContain('line-through');
          }
      }

      // Reload the page and check persistence of strike-through
      await page.reload();

      const reloadedTaskTextsAfterStrike = await page.$$eval('.tasks-container .text-wrapper', els => els.map(el => el.textContent.trim()));
      const reloadedTaskDatesAfterStrike = await page.$$eval('.tasks-container .date-wrapper', els => els.map(el => el.innerHTML.trim()));
      const reloadedTaskStrikeThroughStyles = await page.$$eval('.tasks-container .text-wrapper', els => els.map(el => window.getComputedStyle(el).textDecoration));

      for (let i = 0; i < expectedOrderAfterStrike.length; i++) {
          expect(reloadedTaskTextsAfterStrike[i]).toBe(expectedOrderAfterStrike[i]);
          expect(reloadedTaskDatesAfterStrike[i]).toBe(expectedDatesAfterStrike[i]);
          if (expectedOrderAfterStrike[i] === 'hi1') {
              expect(reloadedTaskStrikeThroughStyles[i]).toContain('line-through');
          }
      }

      await page.click('.sideButton img[alt="Dashboard Icon"]');

      const dueSoonTasksAfterStrike = await page.$$eval('#dueSoonContainer ul li', els => els.map(el => el.textContent.trim()));
      expect(dueSoonTasksAfterStrike).toEqual(['hi6', 'hi4', 'hi8', 'hi2', 'hi10', 'hi11', 'You have more tasks for this day ...']); // Tasks due 3 days ago, yesterday, and today

      const percentageDoneAfterStrike = await page.$eval('#percent', el => el.textContent.trim());
      expect(percentageDoneAfterStrike).toBe('8%');

      const totalTasksAfterStrike = await page.evaluate(() => localStorage.getItem('totalTasks'));
      const completedTasksAfterStrike = await page.evaluate(() => localStorage.getItem('completedTasks'));
      expect(totalTasksAfterStrike).toBe('12');
      expect(completedTasksAfterStrike).toBe('1');
    });

    // Strikethrough hi6
    test("Strikethrough hi6, check order, strike-through persistence, dashboard updates, and reload", async () => {
      await page.click('.sideButton img[alt="Task List Icon"]');
      await strikeThroughTask('hi6');
      const expectedOrderAfterStrike = ['hi9', 'hi4', 'hi8', 'hi2', 'hi10', 'hi11', 'hi12', 'hi3', 'hi7', 'hi5', 'hi1', 'hi6'];
      const expectedDatesAfterStrike = [
          'No Due Date', '<span style="color: red;">OVERDUE</span>', '<span style="color: red;">OVERDUE</span>',
          '<span>Today</span>', '<span>Today</span>', '<span>Today</span>', '<span>Today</span>',
          '<span>Tomorrow</span>', '<span>Tomorrow</span>',
          formatTaskListDate(new Date(getDate(5).split('/').reverse().join('-'))), 'No Due Date', '<span style="color: red;">OVERDUE</span>'
      ];
    
      const taskTextsAfterStrike = await page.$$eval('.tasks-container .text-wrapper', els => els.map(el => el.textContent.trim()));
      const taskDatesAfterStrike = await page.$$eval('.tasks-container .date-wrapper', els => els.map(el => el.innerHTML.trim()));
      const taskStrikeThroughStyles = await page.$$eval('.tasks-container .text-wrapper', els => els.map(el => window.getComputedStyle(el).textDecoration));
    
      for (let i = 0; i < expectedOrderAfterStrike.length; i++) {
          expect(taskTextsAfterStrike[i]).toBe(expectedOrderAfterStrike[i]);
          expect(taskDatesAfterStrike[i]).toBe(expectedDatesAfterStrike[i]);
          if (expectedOrderAfterStrike[i] === 'hi6') {
              expect(taskStrikeThroughStyles[i]).toContain('line-through');
          }
      }
    
      // Reload the page and check persistence of strike-through
      await page.reload();
    
      const reloadedTaskTextsAfterStrike = await page.$$eval('.tasks-container .text-wrapper', els => els.map(el => el.textContent.trim()));
      const reloadedTaskDatesAfterStrike = await page.$$eval('.tasks-container .date-wrapper', els => els.map(el => el.innerHTML.trim()));
      const reloadedTaskStrikeThroughStyles = await page.$$eval('.tasks-container .text-wrapper', els => els.map(el => window.getComputedStyle(el).textDecoration));
    
      for (let i = 0; i < expectedOrderAfterStrike.length; i++) {
          expect(reloadedTaskTextsAfterStrike[i]).toBe(expectedOrderAfterStrike[i]);
          expect(reloadedTaskDatesAfterStrike[i]).toBe(expectedDatesAfterStrike[i]);
          if (expectedOrderAfterStrike[i] === 'hi6') {
              expect(reloadedTaskStrikeThroughStyles[i]).toContain('line-through');
          }
      }
    
      await page.click('.sideButton img[alt="Dashboard Icon"]');
    
      const dueSoonTasksAfterStrike = await page.$$eval('#dueSoonContainer ul li', els => els.map(el => el.textContent.trim()));
      const expectedDueSoonTasks = [
          'hi4', 'hi8', // Yesterday's tasks
          'hi2', 'hi10', 'hi11', 'You have more tasks for this day ...', // Today's tasks
          'hi3', 'hi7'  // Tomorrow's tasks
      ];
    
      const expectedDueSoonDates = [
          formatDueSoonDate(new Date(getDate(-1).split('/').reverse().join('-'))),
          formatDueSoonDate(new Date(getDate(0).split('/').reverse().join('-'))),
          formatDueSoonDate(new Date(getDate(1).split('/').reverse().join('-')))
      ];
    
      expect(dueSoonTasksAfterStrike).toEqual(expectedDueSoonTasks);
    
      const percentageDoneAfterStrike = await page.$eval('#percent', el => el.textContent.trim());
      expect(percentageDoneAfterStrike).toBe('16%');
    
      const totalTasksAfterStrike = await page.evaluate(() => localStorage.getItem('totalTasks'));
      const completedTasksAfterStrike = await page.evaluate(() => localStorage.getItem('completedTasks'));
      expect(totalTasksAfterStrike).toBe('12');
      expect(completedTasksAfterStrike).toBe('2');
    });
    //unstrikethrough hi1. Check dashboard (added back to due soon and percentage decrease.). hi6 should still be struckthrough and "completed"
    test("Unstrikethrough hi1, check dashboard updates and reload", async () => {
      await page.click('.sideButton img[alt="Task List Icon"]');
      await strikeThroughTask('hi1'); // Unstrikethrough
      const expectedOrderAfterUnstrike = ['hi9','hi1', 'hi4', 'hi8', 'hi2', 'hi10', 'hi11', 'hi12', 'hi3', 'hi7', 'hi5', 'hi6'];
      const expectedDatesAfterUnstrike = [
          'No Due Date', 'No Due Date','<span style="color: red;">OVERDUE</span>', '<span style="color: red;">OVERDUE</span>',
          '<span>Today</span>', '<span>Today</span>', '<span>Today</span>', '<span>Today</span>',
          '<span>Tomorrow</span>', '<span>Tomorrow</span>',
          formatTaskListDate(new Date(getDate(5).split('/').reverse().join('-'))), '<span style="color: red;">OVERDUE</span>'
      ];
  
      const taskTextsAfterUnstrike = await page.$$eval('.tasks-container .text-wrapper', els => els.map(el => el.textContent.trim()));
      const taskDatesAfterUnstrike = await page.$$eval('.tasks-container .date-wrapper', els => els.map(el => el.innerHTML.trim()));
      const taskStrikeThroughStylesAfterUnstrike = await page.$$eval('.tasks-container .text-wrapper', els => els.map(el => window.getComputedStyle(el).textDecoration));
  
      for (let i = 0; i < expectedOrderAfterUnstrike.length; i++) {
          expect(taskTextsAfterUnstrike[i]).toBe(expectedOrderAfterUnstrike[i]);
          expect(taskDatesAfterUnstrike[i]).toBe(expectedDatesAfterUnstrike[i]);
          if (expectedOrderAfterUnstrike[i] === 'hi1') {
              expect(taskStrikeThroughStylesAfterUnstrike[i]).not.toContain('line-through');
          }
      }
  
      // Reload the page and check persistence of unstrike-through
      await page.reload();
  
      const reloadedTaskTextsAfterUnstrike = await page.$$eval('.tasks-container .text-wrapper', els => els.map(el => el.textContent.trim()));
      const reloadedTaskDatesAfterUnstrike = await page.$$eval('.tasks-container .date-wrapper', els => els.map(el => el.innerHTML.trim()));
      const reloadedTaskStrikeThroughStylesAfterUnstrike = await page.$$eval('.tasks-container .text-wrapper', els => els.map(el => window.getComputedStyle(el).textDecoration));
  
      for (let i = 0; i < expectedOrderAfterUnstrike.length; i++) {
          expect(reloadedTaskTextsAfterUnstrike[i]).toBe(expectedOrderAfterUnstrike[i]);
          expect(reloadedTaskDatesAfterUnstrike[i]).toBe(expectedDatesAfterUnstrike[i]);
          if (expectedOrderAfterUnstrike[i] === 'hi1') {
              expect(reloadedTaskStrikeThroughStylesAfterUnstrike[i]).not.toContain('line-through');
          }
      }
  
      await page.click('.sideButton img[alt="Dashboard Icon"]');
  
      const dueSoonTasksAfterUnstrike = await page.$$eval('#dueSoonContainer ul li', els => els.map(el => el.textContent.trim()));
      const expectedDueSoonTasks = [
          'hi4', 'hi8', // Yesterday's tasks
          'hi2', 'hi10', 'hi11', 'You have more tasks for this day ...', // Today's tasks
          'hi3', 'hi7'  // Tomorrow's tasks
      ];
  
      const expectedDueSoonDates = [
          formatDueSoonDate(new Date(getDate(-1).split('/').reverse().join('-'))),
          formatDueSoonDate(new Date(getDate(0).split('/').reverse().join('-'))),
          formatDueSoonDate(new Date(getDate(1).split('/').reverse().join('-')))
      ];
  
      expect(dueSoonTasksAfterUnstrike).toEqual(expectedDueSoonTasks);
  
      const percentageDoneAfterUnstrike = await page.$eval('#percent', el => el.textContent.trim());
      expect(percentageDoneAfterUnstrike).toBe('8%');
  
      const totalTasksAfterUnstrike = await page.evaluate(() => localStorage.getItem('totalTasks'));
      const completedTasksAfterUnstrike = await page.evaluate(() => localStorage.getItem('completedTasks'));
      expect(totalTasksAfterUnstrike).toBe('12');
      expect(completedTasksAfterUnstrike).toBe('1');
  });

    //DELETE, not strikethrough, hi1, hi2, hi10, hi11, hi4, hi8, hi3, and hi7. Check that the percentage has increased (should now be be 1/4). Also check Due Soon is correct. 
    test("Delete tasks hi1, hi2, hi10, hi11, hi4, hi8, hi3, and hi7, check percentage and Due Soon section", async () => {
      await page.click('.sideButton img[alt="Task List Icon"]');
      const deleteTask = async (taskText) => {
          const taskIndex = await page.$$eval('.tasks-container .text-wrapper', (els, taskText) => {
              return els.findIndex(el => el.textContent.trim() === taskText);
          }, taskText);
          
          const taskDeleteSelector = `.tasks-container .overlap:nth-child(${taskIndex + 1}) .delete-btn img`;
          await page.click(taskDeleteSelector);
      };
  
      await deleteTask('hi1');
      await deleteTask('hi2');
      await deleteTask('hi10');
      await deleteTask('hi11');
      await deleteTask('hi4');
      await deleteTask('hi8');
      await deleteTask('hi3');
      await deleteTask('hi7');
  
      // Check local storage
      const tasks = await page.evaluate(() => JSON.parse(localStorage.getItem('tasks')));
      expect(tasks.length).toBe(4);  // 12 tasks initially - 8 deleted
  
      // Check percentage of tasks done
      await page.click('.sideButton img[alt="Dashboard Icon"]');
      const percentageDone = await page.$eval('#percent', el => el.textContent.trim());
      expect(percentageDone).toBe('25%');  // 2 out of 8 tasks completed is 25%
  
      const expectedDueSoonTasks = ['hi12', 'hi5'];
      const expectedDueSoonDates = [
          formatDueSoonDate(new Date(getDate(0).split('/').reverse().join('-'))),  // Today's date
          formatDueSoonDate(new Date(getDate(5).split('/').reverse().join('-')))   // 5 days later
      ];
      await checkDueSoonSection(expectedDueSoonTasks, expectedDueSoonDates);
    });

    //Press the edit button for hi12. Change the title to bla12 then press cancel. Check local storage & dashboard & calendar. hi12 should still be there.
    test("Edit hi12, change title to bla12, then press cancel, check local storage & dashboard & calendar", async () => {
      await page.click('.sideButton img[alt="Task List Icon"]');
      await editTask('hi12', 'bla12', null, false);
  
      // Check local storage
      const tasks = await page.evaluate(() => JSON.parse(localStorage.getItem('tasks')));
      const task = tasks.find(t => t.text === 'hi12');
      expect(task).toBeDefined();
  
      await page.click('.sideButton img[alt="Dashboard Icon"]');
      
      // Check Due Soon section
      const expectedDueSoonTasks = ['hi12', 'hi5'];
      const expectedDueSoonDates = [
          formatDueSoonDate(new Date(getDate(0).split('/').reverse().join('-'))),  // Today's date
          formatDueSoonDate(new Date(getDate(5).split('/').reverse().join('-')))   // 5 days later
      ];
      await checkDueSoonSection(expectedDueSoonTasks, expectedDueSoonDates);
    });
    //Press the edit button for hi12. Change the title to bla12 then press the cross to cancel. Check local storage & dashboard & calendar. hi12 should still be there.
    test("Edit hi12, change title to bla12, then press the cross to cancel, check local storage & dashboard & calendar", async () => {
      await page.click('.sideButton img[alt="Task List Icon"]');
      await editTask('hi12', 'bla12', null, false);
  
      // Check local storage
      const tasks = await page.evaluate(() => JSON.parse(localStorage.getItem('tasks')));
      const task = tasks.find(t => t.text === 'hi12');
      expect(task).toBeDefined();
  
      await page.click('.sideButton img[alt="Dashboard Icon"]');
  
      // Check Due Soon section
      const expectedDueSoonTasks = ['hi12', 'hi5'];
      const expectedDueSoonDates = [
          formatDueSoonDate(new Date(getDate(0).split('/').reverse().join('-'))),  // Today's date
          formatDueSoonDate(new Date(getDate(5).split('/').reverse().join('-')))   // 5 days later
      ];
      await checkDueSoonSection(expectedDueSoonTasks, expectedDueSoonDates);
    });

    //Press the edit button for hi12. Change the title to bla12 and the date to the day after tommorow (i.e 2 days after today) then press save. Check local storage & dashboard & calendar. Should now be bla12 with the date in the June 12th 2025 format in task list, and June 12 format in the Due Soon. (shouldn't be june 12 as the date, i just wanted to give an example)
    test("Edit hi12, change title to bla12 and date to day after tomorrow, then press save, check local storage & dashboard & calendar", async () => {
      await page.click('.sideButton img[alt="Task List Icon"]');
      let dayAfterTomorrow = getDate(2);
      await editTask('hi12', 'bla12', dayAfterTomorrow, true);
      
      // Check local storage
      const tasks = await page.evaluate(() => JSON.parse(localStorage.getItem('tasks')));
      const task = tasks.find(t => t.text === 'bla12');
      expect(task).toBeDefined();

      const convertDateToYYYYMMDD = (dateString) => {
        const [day, month, year] = dateString.split('/');
        return `${year}-${month}-${day}`;
      };

      dayAfterTomorrow = convertDateToYYYYMMDD(dayAfterTomorrow)

      expect(task.date).toBe(dayAfterTomorrow);
  
      await page.click('.sideButton img[alt="Dashboard Icon"]');
  
      // Check Due Soon section
      const expectedDueSoonTasks = ['bla12', 'hi5'];
      const expectedDueSoonDates = [
          formatDueSoonDate(new Date(dayAfterTomorrow)),  // The day after tomorrow's date
          formatDueSoonDate(new Date(getDate(5).split('/').reverse().join('-')))   // 5 days later
      ];
      await checkDueSoonSection(expectedDueSoonTasks, expectedDueSoonDates);
    });

    //Cross functionality with Calendar. Go to calendar. Should have all info from task list.
    test("Check tasks on Calendar page", async () => {
      await page.click('.sideButton img[alt="Calendar Icon"]');
      
      // Check the date 2 days from now for bla12
      const dateIn2Days = getDate(2).split('/').reverse().join('-');
      await page.click(`.calendar-cell[data-date="${dateIn2Days}"]`);
      const tasksIn2Days = await page.$$eval('#task-content .text-wrapper', els => els.map(el => el.textContent.trim()));
      expect(tasksIn2Days).toContain('bla12');
    
      // Check the date 5 days later for hi5
      const dateIn5Days = getDate(5).split('/').reverse().join('-');
      await page.click(`.calendar-cell[data-date="${dateIn5Days}"]`);
      const tasksIn5Days = await page.$$eval('#task-content .text-wrapper', els => els.map(el => el.textContent.trim()));
      expect(tasksIn5Days).toContain('hi5');
    
      // Check the date 3 days ago for hi6 (should be struck through)
      const date3DaysAgo = getDate(-3).split('/').reverse().join('-');
      await page.click(`.calendar-cell[data-date="${date3DaysAgo}"]`);
      const tasks3DaysAgo = await page.$$eval('#task-content .text-wrapper', els => els.map(el => el.textContent.trim()));
      const hi6StruckThrough = await page.$$eval('#task-content .text-wrapper', els => els.some(el => el.textContent.trim() === 'hi6' && window.getComputedStyle(el).textDecoration.includes('line-through')));
      expect(tasks3DaysAgo).toContain('hi6');
      expect(hi6StruckThrough).toBe(true);
    });
    
  });

  //Calendar Tests & Cross Features with Dashboard (Events in Recent Updates) & Cross Features with Task List (Striking through tasks in calendar are applied when we check back in the task list page)  
describe("Comprehensive E2E testing for Calendar page", () => {
    beforeAll(async () => {
        await page.goto("http://127.0.0.1:6969/html/team-calendar.html");
    });

    // Helper function to format date as 'YYYY-MM-DD'
    const formatDate = (daysToAdd) => {
        const date = new Date();
        date.setDate(date.getDate() + daysToAdd);
        return date.toISOString().split('T')[0];
    };

    const formatDateForEvent = (dateStr, time) => {
      const date = new Date(dateStr);
      const month = date.toLocaleString('default', { month: 'long' });
      const day = date.getUTCDate();
      return `${month} ${day}, ${time}`;
    };

    // Helper function to add an event
    const addEvent = async (title, date, time) => {
        await page.click('.union');
        await page.type('.add-list .text-wrapper', title);
        await page.evaluate((date) => {
            document.querySelector('.add-list .date-wrapper').value = date;
        }, date);
        if (time) {
            await page.evaluate((time) => {
                document.querySelector('.add-list .time-wrapper').value = time;
            }, time);
        }
        await page.click('.add-list .frame');
    };


    // Helper function to navigate to the previous or next month
    const navigateMonth = async (direction) => {
        if (direction === 'prev') {
            await page.click('#prev_month');
        } else if (direction === 'next') {
            await page.click('#next_month');
        }
    };

    // Test to add an event and check it on the calendar
    test("Add an event and check it on the calendar", async () => {
        const eventDate = formatDate(2); // Two days from now
        await addEvent('Test Event', eventDate, '10:00');

        const dateIn2Days = eventDate.split('-').join('-');
        await page.click(`.calendar-cell[data-date="${dateIn2Days}"]`);
        const eventsIn2Days = await page.$$eval('#event-content .text-content-wrapper', els => els.map(el => el.textContent.trim()));
        expect(eventsIn2Days).toContain('Test Event');

        await page.reload();        
        expect(eventsIn2Days).toContain('Test Event');
    });


    // Test to navigate through months and check the calendar displays correct dates
    test("Navigate through months and check the calendar", async () => {
        await navigateMonth('next');
        const nextMonthDisplayed = await page.$eval('#current_month', el => el.textContent.includes('July'));

        await navigateMonth('prev');
        const currentMonthDisplayed = await page.$eval('#current_month', el => el.textContent.includes('June'));

        expect(nextMonthDisplayed).toBe(true);
        expect(currentMonthDisplayed).toBe(true);
    });

    // Cross-feature test: Check events in Recent Updates on the dashboard
    test("Check events in Recent Updates on the dashboard", async () => {
      const eventDate = formatDate(0); // Today's date
      await addEvent('Dashboard Event', eventDate, '09:00');
  
      const testEventDate = formatDate(2); // Adjust based on when 'Test Event' was added
      const dashboardEventDate = formatDate(0); // Today's date for 'Dashboard Event'
  
      const formattedTestEvent = `(${formatDateForEvent(testEventDate, '10:00 AM')}) Test Event`; // Adjust the time as needed
      const formattedDashboardEvent = `(${formatDateForEvent(dashboardEventDate, '9:00 AM')}) Dashboard Event`; // Adjust the time as needed
  
      await page.click('.sideButton img[alt="Dashboard Icon"]');
      const recentUpdates = await page.$$eval('#contentCodeUpdate ul li', els => els.map(el => el.textContent.trim()));
  
      console.log("Recent Updates:", recentUpdates);
      console.log("Formatted Test Event:", formattedTestEvent);
      console.log("Formatted Dashboard Event:", formattedDashboardEvent);
  
      expect(recentUpdates).toContain(formattedTestEvent);
      expect(recentUpdates).toContain(formattedDashboardEvent);
    });

});


  //Code Log Tests & Cross Features with Dashboard (Code Log Updates in Recent Updates)
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
  test("Add and edit a log entry", async () => {

    await page.waitForSelector('.add-log-btn');
    await page.click('.add-log-btn');
    await page.waitForSelector('.CodeMirror');
    await page.click('.CodeMirror'); 
    await page.type('.CodeMirror', 'general text test'); 
    await page.waitForSelector('button.frame');
    await page.evaluate(() => document.querySelector('button.frame').scrollIntoView());
    await page.click('button.frame');
    await page.waitForSelector('.log-entry');
  
    let isLogEntryCorrect = await page.evaluate(() => {
      const lastLogEntry = document.querySelector('.logs-container .log-entry:last-child');
      const contentDisplayed = lastLogEntry.querySelector('.fieldD2 pre').textContent.trim();
      return contentDisplayed === 'general text test';
    });
  
    expect(isLogEntryCorrect).toBe(true);
  
    await page.evaluate(() => {
      const lastLogEntry = document.querySelector('.logs-container .log-entry:last-child');
      lastLogEntry.dispatchEvent(new MouseEvent('dblclick', {bubbles: true}));
    });

    await page.keyboard.press('Backspace'); 
    await page.type('.CodeMirror', 'edited text content');

  });
  //refresh test
  test("Add a log entry with 'refresh'", async () => {
    await page.waitForSelector('.add-log-btn');
    await page.click('.add-log-btn');

    await page.waitForSelector('.CodeMirror');
    await page.click('.CodeMirror'); 
    await page.type('.CodeMirror', 'refresh test'); 

    await page.waitForSelector('button.frame');
    await page.evaluate(() => document.querySelector('button.frame').scrollIntoView());
    await page.click('button.frame');
    await page.waitForSelector('.log-entry');

    const isLogEntryCorrect = await page.evaluate(() => {
      const lastLogEntry = document.querySelector('.logs-container .log-entry:last-child');
      const dateDisplayed = lastLogEntry.querySelector('.date-codelog').textContent.includes('Date:');
      const timeDisplayed = lastLogEntry.querySelector('.time-codelog').textContent.includes('Time:');
      const contentDisplayed = lastLogEntry.querySelector('.fieldD2 pre').textContent.trim() === 'refresh test';

      return dateDisplayed && timeDisplayed && contentDisplayed;
    });

    expect(isLogEntryCorrect).toBe(true);

    await page.reload();
    const isLogEntryCorrectA = await page.evaluate(() => {
      const lastLogEntryA = document.querySelector('.logs-container .log-entry:last-child');
      const dateDisplayedA = lastLogEntryA.querySelector('.date-codelog').textContent.includes('Date:');
      const timeDisplayedA = lastLogEntryA.querySelector('.time-codelog').textContent.includes('Time:');
      const contentDisplayedA= lastLogEntryA.querySelector('.fieldD2 pre').textContent.trim() === 'refresh test';

      return dateDisplayedA && timeDisplayedA && contentDisplayedA;
    });
    expect(isLogEntryCorrectA).toBe(true);


});


// Header check 
test("Add a log entry with 'general text test'", async () => {
  await page.waitForSelector('.add-log-btn');
  await page.click('.add-log-btn');

  await page.waitForSelector('.CodeMirror');
  await page.click('.CodeMirror'); 
  await page.type('.CodeMirror', '# Empty'); 

  await page.waitForSelector('button.frame');
  await page.evaluate(() => document.querySelector('button.frame').scrollIntoView());
  await page.click('button.frame');
  await page.waitForSelector('.log-entry');

  // Retrieve the rendered HTML content inside the 'pre' tag and verify it is correct
  const renderedContent = await page.evaluate(() => {
    const content = document.querySelector('.fieldD2 pre').textContent.trim(); // Adjust to fetch textContent
    return content;
  });

  expect(renderedContent).toBe('Empty');
});
});

// Bullet point check 
test("Add a log entry with bullet-point text", async () => {
  await page.waitForSelector('.add-log-btn');
  await page.click('.add-log-btn');

  await page.waitForSelector('.CodeMirror');
  await page.click('.CodeMirror'); 
  await page.type('.CodeMirror', '* Empty'); 

  await page.waitForSelector('button.frame');
  await page.evaluate(() => document.querySelector('button.frame').scrollIntoView());
  await page.click('button.frame');
  await page.waitForSelector('.log-entry');

  const renderedContentV = await page.evaluate(() => {
    let content = document.querySelector('.fieldD2 pre').textContent.trim(); 
    return content;
  });

  expect(renderedContentV).toBe('Empty');
});
// Bold check 
test("Add a log entry with bold text", async () => {
  await page.waitForSelector('.add-log-btn');
  await page.click('.add-log-btn');

  await page.waitForSelector('.CodeMirror');
  await page.click('.CodeMirror'); 
  await page.type('.CodeMirror', '**Empty**'); 

  await page.waitForSelector('button.frame');
  await page.evaluate(() => document.querySelector('button.frame').scrollIntoView());
  await page.click('button.frame');
  await page.waitForSelector('.log-entry');

  
  const renderedContentV = await page.evaluate(() => {
    let content = document.querySelector('.fieldD2 pre').textContent.trim(); 
    return content;
  });

  expect(renderedContentV).toBe('Empty');
});

//10 entries
test("Add a lot of entries", async () => {
  for (let i = 1; i <= 4; i++) {
    await page.waitForSelector('.add-log-btn');
    await page.click('.add-log-btn');

    await page.waitForSelector('.CodeMirror');
    await page.click('.CodeMirror'); 
    await page.type('.CodeMirror', `* Entry ${i}`); 

    await page.waitForSelector('button.frame');
    await page.evaluate(() => document.querySelector('button.frame').scrollIntoView());
    await page.click('button.frame');
    await page.waitForSelector('.log-entry');
  }

  const entryCount = await page.evaluate(() => {
    return document.querySelectorAll('.log-entry').length;
  });

  expect(entryCount).toBe(10);
});


test("Delete 10 log entries", async () => {
  await page.waitForSelector('.delete-button');

  let deleteButtons;
  let clickCount = 0;
  while (clickCount < 10) {
      deleteButtons = await page.$$('.delete-button');
      if (deleteButtons.length === 0) {
          console.log('No more delete buttons found.');
          break;
      }
      await deleteButtons[0].click();

      clickCount++;
  }

  console.log(`Total delete clicks made: ${clickCount}`);
});

});


  //Documentation Tests
  describe("Documentation Page Tests", () => {
    beforeAll(async () => {
      await page.goto("http://127.0.0.1:6969/html/documentation.html");
    });
  
    test("Create, refresh, and edit files", async () => {
  
      await page.waitForSelector('#createFileButton');
      page.once('dialog', async dialog => {
        expect(dialog.type()).toBe('prompt');
        expect(dialog.message()).toBe('Enter the name for the new file:');
        await dialog.accept('file2');
      });
      await page.click('#createFileButton');
      await page.waitForFunction(() => {
        const fileSelect = document.getElementById('fileSelect');
        return Array.from(fileSelect.options).some(option => option.value === 'file2');
      });
      await page.select('#fileSelect', 'file2');
      await page.waitForSelector('.CodeMirror');
      await page.click('.CodeMirror');
      await page.type('.CodeMirror', 'file2');
      let content = await page.evaluate(() => {
        return document.querySelector('.CodeMirror').CodeMirror.getValue();
      });
      expect(content).toBe('file2');
  
      await page.reload();
  
      // Select file1 (untitled file)
      await page.waitForSelector('#fileSelect');
      await page.select('#fileSelect', 'Untitled');  // Assuming the default file name is 'Untitled'
  
      await page.waitForSelector('.CodeMirror');
      await page.click('.CodeMirror');
      await page.evaluate(() => {
        const cm = document.querySelector('.CodeMirror').CodeMirror;
        cm.setValue('');  
      });
      await page.type('.CodeMirror', 'edited file1');
  
      content = await page.evaluate(() => {
        return document.querySelector('.CodeMirror').CodeMirror.getValue();
      });
      expect(content).toBe('edited file1');
  
      // Rename the file to 'renamed'
      await page.waitForSelector('#renameFileButton');
      page.once('dialog', async dialog => {
        expect(dialog.type()).toBe('prompt');
        expect(dialog.message()).toBe('Enter the new name for the file:');
        await dialog.accept('renamed');
      });
      await page.click('#renameFileButton');
      await page.waitForFunction(() => {
        const fileSelect = document.getElementById('fileSelect');
        return Array.from(fileSelect.options).some(option => option.value === 'renamed');
      });
      await page.select('#fileSelect', 'renamed');
      
  
      content = await page.evaluate(() => {
        return document.querySelector('.CodeMirror').CodeMirror.getValue();
      });
      expect(content).toBe('edited file1');
    });
  });


  // Feedback Tests
  describe("Feedback Tests", () => {
    beforeAll(async () => {
      await page.goto("http://127.0.0.1:6969/html/feedback.html");
    });

    test("Add feedback logs", async () => {
      const feedbackEntries = [
        { question: 'is this a test?', answer: 'yes, this is a test.' },
        { question: 'oh i see', answer: 'your welcome' },
        { question: 'another question', answer: 'another answer' },
        { question: 'final question', answer: 'final answer' }
      ];

      for (const entry of feedbackEntries) {
        await page.waitForSelector('.feedback .union-wrapper');
        await page.click('.feedback .union-wrapper');
        await page.waitForSelector('.user_question');
        await page.click('.user_question');
        await page.type('.user_question', entry.question);
        await page.waitForSelector('.user_answer');
        await page.click('.user_answer');
        await page.type('.user_answer', entry.answer);
        await page.evaluate(() => document.querySelector('.feedbacklist:last-child').scrollIntoView());
      }

      await page.reload();

      // Verify the feedback log entries
      const isFeedbackLogsCorrect = await page.evaluate(() => {
        const entries = document.querySelectorAll('.feedbacklist');
        const questions = [...entries].map(entry => entry.querySelector('.user_question').textContent.trim());
        const answers = [...entries].map(entry => entry.querySelector('.user_answer').textContent.trim());

        return questions.includes('is this a test?') && answers.includes('yes, this is a test.')
          && questions.includes('oh i see') && answers.includes('your welcome')
          && questions.includes('another question') && answers.includes('another answer')
          && questions.includes('final question') && answers.includes('final answer');
      });

      expect(isFeedbackLogsCorrect).toBe(true);
    });

    test("Edit feedback log entry", async () => {
      // Click to edit the specific feedback entry
      await page.waitForSelector('.user_question');
      await page.click('.user_question');


      for (let i = 0; i < 15; i++) {
        await page.keyboard.press('Backspace');
      }
      await page.type('.user_question', 'thank you cse110');

      await page.waitForSelector('.user_answer');
      await page.click('.user_answer');

      for (let i = 0; i < 15; i++) {
        await page.keyboard.press('Backspace');
      }
      await page.type('.user_answer', 'goodbye');

      await page.reload();

    });

    test("Delete feedback log entry", async () => {
      await page.waitForSelector('.feedbacklist .delete-btn');
      await page.click('.feedbacklist .delete-btn');
      await page.click('.feedbacklist .delete-btn');
      await page.click('.feedbacklist .delete-btn');
      await page.click('.feedbacklist .delete-btn');


      await page.reload();

      // Verify the feedback log entry is deleted
      const isFeedbackLogDeleted = await page.evaluate(() => {
        const lastFeedbackEntry = document.querySelector('.feedbacklist:last-child');
        if (!lastFeedbackEntry) return true;

        const questionDisplayed = lastFeedbackEntry.querySelector('.user_question').textContent.includes('is this a test?');
        const answerDisplayed = lastFeedbackEntry.querySelector('.user_answer').textContent.includes('yes, this is a test.');

        return !(questionDisplayed && answerDisplayed);
      });

      expect(isFeedbackLogDeleted).toBe(true);
    });
});