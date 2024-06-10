describe("Basic user flow for Website", () => {
  // First, visit the feedback page
  beforeAll(async () => {
      await page.goto("http://127.0.0.1:6969");
  });

  test('Add a feedback ticket', async () => {
      await page.goto("http://127.0.0.1:6969/html/feedback.html");
      // Ensure the modal button exists
      const modalButtonExists = await page.$('.union') !== null;
      console.log('Modal button exists:', modalButtonExists);
      expect(modalButtonExists).toBe(true);

      // Click the button to open the modal
      await page.waitForSelector('.union');
      await page.evaluate(() => document.querySelector('.union').scrollIntoView());
      await page.click('.union');

      // Check if the feedback ticket is added
      await page.waitForSelector('.feedbacklist');
      const feedbackListCount = await page.$$eval('.feedbacklist', (els) => els.length);
      expect(feedbackListCount).toBeGreaterThan(0);
  });
});