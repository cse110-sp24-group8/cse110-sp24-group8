# Phase 1 CI/CD Pipeline

**First Row:**
![FirstRow](https://github.com/cse110-sp24-group8/cse110-sp24-group8/assets/86510539/9bde91bb-5104-4021-98bd-e38332a7b53b)
Currently, all elements of our pipeline in the first row are fully functional. The code successfully checks out the code from the repository upon any push or pull requests. In our `main.yml` file, we set `node-version: '18'` and from there, it's able to install all the necessary project dependencies. 

**Second Row:**
![SecondRow](https://github.com/cse110-sp24-group8/cse110-sp24-group8/assets/86510539/fb12bf1c-d404-4236-99f9-2b2c3763ce9f)
After installing all the necessary dependencies and setting the correct node version, our pipeline then runs lint, which is able to identify any syntax or style errors within the code. We tested this function out with example syntax within our repo and it was able to report it, using this command `run: npm run lint`. We set an arbitrary unit test file, called `__tests__/subtract.test.js` based on the lab we did since we aren't fully done with our design and haven't begun implementation. Our pipeline was able to run our unit test so when we begin implementation, we can replace it with actual unit tests for our code. The next stop in our pipeline is documentation, which is generated from the source code comments, utilizing JSDoc. JSDoc reads comments within code and generates an HTML documentation website. The jsdoc command (which we run with `npm run docs`) scans your specified JavaScript files, interprets the comments, and generates static HTML files.


**Last Row:** 
![ThirdFourthRow](https://github.com/cse110-sp24-group8/cse110-sp24-group8/assets/86510539/178be591-2447-4c4d-be80-4c4b2858fb8a)

After generating documentation, it is then committed and pushed to the `gh` branch. From there, the next pipeline process inspects the code quality, utilizing Code Climate GitHub Action using `npm run coverage`. It runs an analysis on our code, checking for potential bugs, how much of the codebase is covered with tests, and 'code smells' (duplicated code, overly complex logic, or poor naming conventions). After that, our pipeline enters it's 'cleanup' mode or `post-job` mode. These processes ensures that the runner environment is clean and does not retain any state changes that could affect future jobs. This is crucial in CI/CD pipelines to maintain the consistency and reliability of the build and test environments. Each step here is geared towards cleaning or resetting configurations that were temporarily necessary during the main parts of the job, especially concerning Git and related operations.

To summarize, our Phase 1 pipeline has most of its functionality from `Set-up job`, `Checkout Code`, `Set-up Node.js`, `Install Dependencies`, `Run Lint`, `Test`, `Documentation`, `Code QC`, `Post Set-up Node.js`, and `Post Checkout Code` fully functioning. Our `Unit Test` portion is still in progress and is waiting when we start actual implementation. 




