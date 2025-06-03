# CS 422 Project 2: Study Group App
A location-based app for forming and finding study groups nearby for similar courses or topics.

## Authors
- Derek Van Devender
- Kaleo Montero
- Sawyer Christensen
- Song Zhang

### Last Modified: 06/03/2025

## Purpose
This app allows for study groups to be easily hosted, seen, and joined on campus without the hassle of bulletin boards or setting up specific meetings on a schedule. Users are able to meet, connect, study, and learn with others in the same physical space at the same time with ease.

## Installation Instructions
The only dependency for this application is Docker, which will automatically set up an isolated environment with all the required dependencies.
1. Install Docker at https://docs.docker.com/get-started/get-docker/.
2. Once Docker has been installed, open the Docker Desktop application.
     - This is to ensure Docker services are active, but you do not have to interact with the GUI.
4. In a terminal, `cd` into the repository's main directory (ex. Downloads/study-group-app/) and not a subdirectory.
5. Run `docker compose up -d` to run the server.
     - If you are composing the server for the first time, please allow roughly 30-45 seconds to download dependencies and start the server.
7. Access the app at http://localhost:3000/
     - Once you log in, please allow location permissions, usually as a request located in the upper-left corner of the browser.
8. To turn off the server, you may run `docker compose down` or manually shut it off in the Docker Desktop GUI.

## Repository Organization
- `main`: Basic files applicable to entire program
	- `README.md`: file describing important details regarding program
	- `docker-compose.yml`: instructions for containerizing program and running commands

- `backend`: Python code implementing the backend server/database using Flask and MongoDB
     - `app.py`: main server file for communications between frontend UI and backend database
     - `db_models.py`: contains MongoEngine schemas for User and StudyGroup objects
	- `seeder.py`: seeds initial users into the database if it is empty
	- `requirements.txt`: defines Python dependencies
	- `Dockerfile`: builds the backend container
 
- `frontend`: React (using TypeScript) frontend code, serving the user interface
 	- `src/home.tsx`, `src/login.tsx`: renders UI and functionality for login and home pages
	- `src/home.css`, `src/login.css`: stylesheet files for page-level component styling
	- `package.json`: list of dependencies to be installed(e.g. react, react-leaflet)
	- `tsconfig.json`: TypeScript configuration
	- `Dockerfile`: builds the frontend containers

