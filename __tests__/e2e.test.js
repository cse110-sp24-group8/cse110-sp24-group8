describe("Exhaustive E2E testing based on user flow for website.", () => {
  // First, visit the app hosted by live server
  beforeAll(async () => {
      await page.goto("http://127.0.0.1:6969");
  });

  // Helper function to format the task list date
  const formatTaskListDate = (date) => {
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

  // Helper function to format the Due Soon date
  const formatDueSoonDate = (date) => {
      const day = date.getUTCDate();
      const month = date.toLocaleString('default', { month: 'long' });
      return `${month} ${day}`;
  };

  const getDate = (daysToAdd) => {
      const today = new Date();
      const date = new Date(today);
      date.setDate(today.getDate() + daysToAdd);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
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
      expect(documentationUrl).toContain('html/team_calendar.html');
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
      page.on('dialog', async dialog => {
        expect(dialog.message()).toBe('Please enter a task name.');
        await dialog.dismiss();
      });
      
      // Task List should still be empty
      await page.click('#addTaskButton');
      const tasks = await page.evaluate(() => localStorage.getItem('tasks'));
      expect(tasks).toBe("[]");
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

      await checkTaskOrderAndDates(['hi1', 'hi2'], ['No Due Date', '<span style="color:black;">Today</span>']);
    });

    // Yes title yes date, tomorrow
    test("Add a task with title 'hi3' and tomorrow's date", async () => {
      const tomorrow = getDate(1);
      await addTask('hi3', tomorrow);

      const tasks = await page.evaluate(() => JSON.parse(localStorage.getItem('tasks')));
      expect(tasks.length).toBe(3);
      expect(tasks[2].text).toBe('hi3');
      expect(tasks[2].date).toBe(tomorrow.split('/').reverse().join('-'));

      await checkTaskOrderAndDates(['hi1', 'hi2', 'hi3'], ['No Due Date', '<span style="color:black;">Today</span>', '<span style="color:black;">Tomorrow</span>']);
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
        ['No Due Date', '<span style="color: red;">OVERDUE</span>', '<span style="color:black;">Today</span>', '<span style="color:black;">Tomorrow</span>']
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
          '<span style="color:black;">Today</span>', '<span style="color:black;">Today</span>', '<span style="color:black;">Today</span>', '<span style="color:black;">Today</span>',
          '<span style="color:black;">Tomorrow</span>', '<span style="color:black;">Tomorrow</span>',
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
      // Strikethrough hi1 by clicking the checkbox
      const strikeThroughTask = async (taskText) => {
          const taskIndex = await page.$$eval('.tasks-container .text-wrapper', (els, taskText) => {
              return els.findIndex(el => el.textContent.trim() === taskText);
          }, taskText);

          const taskCheckboxSelector = `.tasks-container .overlap:nth-child(${taskIndex + 1}) input[type="checkbox"]`;
          await page.click(taskCheckboxSelector);
      };
      await strikeThroughTask('hi1');

      const expectedOrderAfterStrike = ['hi9', 'hi6', 'hi4', 'hi8', 'hi2', 'hi10', 'hi11', 'hi12', 'hi3', 'hi7', 'hi5', 'hi1'];
      const expectedDatesAfterStrike = [
          'No Due Date', '<span style="color: red;">OVERDUE</span>', '<span style="color: red;">OVERDUE</span>', '<span style="color: red;">OVERDUE</span>',
          '<span style="color:black;">Today</span>', '<span style="color:black;">Today</span>', '<span style="color:black;">Today</span>', '<span style="color:black;">Today</span>',
          '<span style="color:black;">Tomorrow</span>', '<span style="color:black;">Tomorrow</span>',
          formatTaskListDate(new Date(getDate(5).split('/').reverse().join('-'))), 'No Due Date'
      ];

      const taskTextsAfterStrike = await page.$$eval('.tasks-container .text-wrapper', els => els.map(el => el.textContent.trim()));
      const taskDatesAfterStrike = await page.$$eval('.tasks-container .date-wrapper', els => els.map(el => el.innerHTML.trim()));
      const taskStrikeThroughStyles = await page.$$eval('.tasks-container .text-wrapper', els => els.map(el => window.getComputedStyle(el).textDecoration));

      for (let i = 0; i < expectedOrderAfterStrike.length; i++) {
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

  });
    
    //Strikethrough hi6. Do the same checkings has striking through hi1. Also check that in dashboard, hi6 and its date (3 days ago) are completely removed from the Due Soon section. Check the correct percentage is displayed.
    //unstrikethrough 1. Check dashboard (added back to due soon and percentage increase.)

    //delete the 2 that are still struck through. check local storage & dashboard.

    //edit, change content, cancel edit. Check  local storage & dashboard & calendar
    //edit, change content, cross edit. Check  local storage & dashboard.
    //edit, change content, save edit. Check  local storage & dashboard.

  
  //Calendar Tests & Cross Features with Dashboard (Events in Recent Updates) & Cross Features with Task List (Strikethrough tasks are applied globally)  



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






