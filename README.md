# CS 422 Project 2: Study Group App
A location-based app for forming and finding study groups nearby for similar courses or topics.

## Authors
- Derek Van Devender
- Kaleo Montero
- Sawyer Christensen
- Song Zhang

### Last Modified: 05/28/2025

## Installation Instructions
The only dependency for this application is Docker, which will automatically set up an isolated environment with all the required dependencies.
1. Install Docker at https://docs.docker.com/get-started/get-docker/.
2. Once Docker has been installed, open the Docker Desktop application.
     - This is to ensure Docker services are active, but you do not have to interact with the GUI.
4. In a terminal, `cd` into the repository's main root directory (not frontend/backend).
5. Run `docker compose up -d --build` to run the server.
     - If you are developing the app, run the same command whenever you make changes to reflect those changes.
6. Access the app:
     - Frontend (Website): http://localhost:3000
     - Backend (API server): http://localhost:5000
7. To turn off the server, you may run `docker compose down` or manually shut it off in the Docker Desktop GUI.


