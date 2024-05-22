# ADR: End to End Testing
## Context and Problem Statement

We need to conduct testing on how the user would interact with our web app so we would simulate real user scenarios, covering workflows from start to finish, ensuring that all features and user paths function correctly.

## Considered Options

* Puppeteer

## Decision Outcome

Chosen options: Using Puppeteer as our main way of conducting E2E testing because everyone is familiar with Puppeteer from the labs in class and many of us do not know any other tools for E2E testing.

## Conclusion

By choosing puppeteer as our E2E testing, we will know whether each of our functions work properly similarly to the lab where we created, read, updated, deleted sticky notes. We can apply similar approaches when we develop our task-list, code log, and documentaion page.
