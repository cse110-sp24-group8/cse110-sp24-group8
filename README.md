# LeJournal - cse110-sp24-group8

<img src="./src/scripts/main/public/icons/journallogo-icon.png" width="175">

Welcome to LeJournal, your all-in-one web dev journal that empowers developers to manage tasks, integrate calendar events, log code, document projects, and track user feedback seamlessly. Experience a new level of productivity and organization tailored specifically for developers.

## Demo 
![YouTube](https://img.shields.io/badge/YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white) 

(Insert final demo Youtube Video Link here) 

## Features 

- `Dashboard`: Serve as the home page of the dev journal, offering widgets that provide overviews of information from other features.
- `TaskList`: Efficiently organize your tasks, track due dates, and mark items as completed to stay on top of your to-do list.
- `Calendar`: Keep track of important dates, deadlines, and events with a fully integrated calendar, allowing you to add entries on specific days to manage your schedule effectively.
- `Code Log`: Document your coding progress, changes, and decisions with detailed logs using the markdown editor, making it easier to track the evolution of your work.
- `Documentation`: Utilize the markdown editor to create, store, and access detailed documentation effortlessly.
- `Feedback`: Collect and manage feedback from peers and users to continually refine and enhance your ideas.

## Relevant Links 
![Github](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)
![Github Pages](https://img.shields.io/badge/GitHub%20Pages-222222?style=for-the-badge&logo=GitHub%20Pages&logoColor=white)
- We are using Github Pages to host our web app. You can find our live site [here](https://cse110-sp24-group8.github.io/cse110-sp24-group8/).
- Our SSOT (Single Source of Truth) is our Github Repository which can be found [here](https://github.com/cse110-sp24-group8/cse110-sp24-group8).
- Learn more about our [team](/admin/team.md).

## Brainstorming/Design Process
![Figma](https://img.shields.io/badge/Figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white)
- Used [Retrium](https://app.retrium.com/) to facilitate brainstorming sessions for identifying for problems and solutions related to potential features for the dev journal.
- Ultilized [Figma](https://www.figma.com/) for designing wireframes, low-fidelity mockups, and high-fidelity mockups, streamlining the entire design process from conceptualization to finalization. 
- Our high-fidelity diagrams can be viewed [here](https://www.figma.com/design/iuuBu34fkbDqax3Vnc2bUJ/High-Fidelity-Diagram?node-id=0-1&t=GznIrdROIvAf74bI-0)
- 1. Personal Issues & Conflicts
- 2. Continuity in Work
- 3. Developing a Workflow
- 4. Testing & Maintenance
- 5. Resources

## Coding Process
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E)
- We split our development team into equal sized subgroups each assigned to a page that corresponds to a feature of our dev journal. 
- We had multiple sprints to encompass the different stages of the coding process:
- 1. Creating the skeleton/structure of the web app with HTML and CSS. Sidebar and header features developed first - page features developed second.
- 2. Implementing basic functionality with vanilla JS. 

### SimpleMDE
![Markdown](https://img.shields.io/badge/Markdown-000000?style=for-the-badge&logo=markdown&logoColor=white)
- Utilized [SimpleMDE API](https://simplemde.com/) to implement a markdown editor for pages that necessitated it (i.e Documentation & Code Log).
- Allows for text editor functionality with markdown features like headings, boldings, italicize, code blocs, etc., through buttons and keyboard shortcuts


## Testing Process
![Jest](https://img.shields.io/badge/Jest-323330?style=for-the-badge&logo=Jest&logoColor=white)
- We used the Jest framework alongside the Puppeteer library to implement Unit & E2E testing for correct functionality in page interactions and local storage
- Used live server to host website to facilitate automated testing during CI.


## CI/CD Pipeline
![Github Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)
(Needs work)
We've integrated GitHub Actions into our project for seamless Continuous Integration and Deployment, featuring a robust pipeline that encompasses:

- `JSDoc`:
- `Superlinter`:
- `Jest and Puppeteer`:

## Repository Structure

- `/admin/branding/images`: Branding-related information.
- `/admin/cipipepine`: Contains our CI/CD pipeline diagram.
- `/admin/meetings`: Stores our meeting notes.
- `/admin/misc`: Contains our team contract information.
- `/admin/videos`: Contain our introduction and status video.
- `/src/scripts/main/public`: Contains our source code for our project.
- `/specs/adrs`: Houses Architectural Design Records detailing significant project decisions.

## Acknowledgements

### Contributors 

- Arthur Cheung
- Brandon Luu
- Eric Huang
- Joshua Chen
- Kaustubh Paliwal
- Kevin Kuang
- Nicholas Nguyen
- Samvathna Em
- Ulises Salinas

