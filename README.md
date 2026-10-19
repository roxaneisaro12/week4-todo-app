# Family Chores

A simple, interactive household chore manager built with HTML, Tailwind CSS v4, JavaScript, and Vite. Family Chores helps users organize everyday tasks, track progress, and manage priorities in one place.

## Features

- Add chores using the button or Enter key.
- Validate empty chore names and display helpful error messages.
- Mark chores as completed or active.
- Edit chore names inline using Enter to save or Escape to cancel.
- Delete chores with confirmation.
- Filter chores by All, To do, and Completed.
- Search chores by name.
- Assign Low, Medium, or High priority.
- View total, active, and completed chore statistics.
- Save chores and the selected filter using localStorage.
- Clear completed chores after confirmation.
- Responsive layout for different screen sizes.

## Technologies

- HTML5
- Tailwind CSS v4
- Vanilla JavaScript
- Vite
- Browser localStorage

## Getting Started

### Prerequisites

Install Node.js and npm.

### Run locally

1. Clone this repository.
2. Open the project folder in your terminal.
3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open the local URL printed in your terminal.

## How It Works

The application stores chores in a JavaScript array. Each chore has an ID, text, completion status, priority, and creation timestamp. A render function updates the task list and statistics when the state changes.

Chores and the selected filter are saved in browser localStorage, allowing them to persist after a page refresh in the same browser.

## User Stories

- As a user, I can add chores so I can keep track of household responsibilities.
- As a user, I can complete and edit chores so I can keep my list accurate.
- As a user, I can search and filter chores so I can find tasks quickly.
- As a user, I can assign priorities so I can identify important chores.
- As a user, I can refresh the page without losing my saved chores.



## Reflection

Building Family Chores helped me practise JavaScript state management, DOM manipulation, event handling, and localStorage. I learned how to validate user input and update the interface when tasks change. I used browser developer tools to inspect errors and troubleshoot issues during development. Testing each feature helped me check that adding, editing, deleting, filtering, and saving chores worked as expected. I also learned the importance of accessible controls and clear feedback for users. The project gave me more confidence in building an interactive web application with HTML, Tailwind CSS, and vanilla JavaScript.

## Videos
https://drive.google.com/file/d/1pexIwHrHHSSngluBJdh_GV7HVahY7Bno/view?usp=sharing

## Author

Created by Isaro Roxane.
