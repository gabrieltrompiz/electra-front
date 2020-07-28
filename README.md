<br />
<p align='center'>
  Front-End of Desktop Application for the Synchronization of Collaborators in a Software Development Project
  <br />
  <img src='https://raw.githubusercontent.com/gabrieltrompiz/electra-front/develop/screenshots/power-with-name.png' alt='logo' />
</p>

## Table of Contents
* [About this project](#about-this-project)
* [Tech Stack](#teck-stack)
* [Features](#features)
* [Avaliable Scripts](#available-scripts)
* [Screenshots](#screenshots)

## About this project
This project was developed for opting for a Bachelor's Degree in Computer Science in Rafael Urdaneta University. It's a tool to keep collaborators on a project synchronized, with some GitHub features like repositories which can be linked to workpsaces, issues that can be linked to tasks, and so on... It was inspired in Discord's UI and in functionality it's like a basic Trello with GitHub features.

## Tech Stack
* React with TypeScript
* Redux
* Redux-thunk
* Sass
* Socket.IO client
* GraphQL using Apollo Client
* Electron

## Features
The main features of the application are:
* Users may register and link their GitHub profile to their account, to be able to get access to repositories, issues, pull requests and so on... Workspaces have a basic to-do, in progress and done board. There are two types of users on workspaces: admins and members.
* Workspaces can be created, these workspaces are like a board, and can have a repository associated. Having a repository linked to a workspace gives users the ability to assign issues on their repo to specific tasks.
* Tasks, as mentioned above, can have an issue associated, an user assigned to get this task done, due date, comments, checklists and can be moved between boards.
* Each workspace can have any number of sprints, with a start date and finish date, and they move to a sprint backlog when completed.
* Workspaces have channels (like groups) and one-on-one chats between members. This specific feature was inspired by Slack.

## To-do
These are features that couldn't be completed, but we would love to pick them up in a near future:
* Adding pull requests to a workspace
* Being able to see the tree of the repository with all of its branches
* Implement sockets, nothing is in real-time at the moment

## Available Scripts
In the project directory you can run:

### `npm start` or `yarn start`
Launches the react application in the browser using CRA.

### `npm build` or `yarn build`
Builds the app for production to the build folder.
It correctly bundles React in production mode and optimizes the build for the best performance.
The build is minified and the filenames include the hashes.

### `npm test` or `yarn test`
Launches the test runner in the interactive watch mode.

### `npm run electron-dev` or `yarn run electron-dev`
Runs the app in the development mode and opens it in Electron.


### `npm run dist` or `yarn run dist`
Builds a ready for distribution version of the app for Linux, Windows and MacOS (you may need MacOS to build for that OS) and with auto-updated support out of the box.

## Screenshots
These are the inital mockups used to develop the application. They don't represent the actual state of the application and some things may have changed.

#### Login
![Login](https://raw.githubusercontent.com/gabrieltrompiz/electra-front/develop/screenshots/login.png)

#### Register
![Register](https://raw.githubusercontent.com/gabrieltrompiz/electra-front/develop/screenshots/register.png)

#### Dashboard
![Dashboard](https://raw.githubusercontent.com/gabrieltrompiz/electra-front/develop/screenshots/dashboard.png)

#### Tasks
![Tasks](https://raw.githubusercontent.com/gabrieltrompiz/electra-front/develop/screenshots/task.png)

#### Chat
![Chat](https://raw.githubusercontent.com/gabrieltrompiz/electra-front/develop/screenshots/chats.png)

## Credits
This project was developed by Gabriel Trompiz: [@gabrieltrompiz](https://github.com/gabrieltrompiz) and Luis Petrella [@ptthappy](https://github.com/ptthappy).