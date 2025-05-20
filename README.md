# CS 422 Project 2: Study Group App
A location-based app for forming and finding study groups nearby for similar courses or topics.

## Authors
- Derek Van Devender
- Kaleo Montero
- Sawyer Christensen
- Song Zhang

Installation Instructions (for developers, to be removed)

Frontend:
- TODO: Update instructions for both mac/windows
- For React Native, install Node.js and npm (from https://nodejs.org/)
- Clone github directory and cd into the project and then cd into the frontend folder.
- We'll be using Expo (standard framework for React Native), run "npm install" inside the frontend folder
     - Note: If npm is not recognized, close and re-open your terminal
- Next, for basic testing you can use Expo Go but for building/later on, download Xcode/Android emulator

- Download Expo Go (on your mobile device) on your iOS/Android device, make an account, and run "npm run start" in terminal
- Scan the QR and you can simulate your app within Expo Go
- OR
- Download Xcode (iOS) or Android Studio? (Android)
- Run the command "npm run ios" or "npm run android"

- You can modify frontend stuff using frontend/app/index.js

Backend:
- TODO: Update instructions for both mac/windows
- Download Python if you haven't already (you should have this)
- cd into the backend folder
- Create a virtual environment, use "python3 -m venv venv" (or some variation for your own system)
- Activate it using "source venv/bin/activate" for Mac, something like "venv\Scripts\activate" for Windows?
- Once activated, run "pip install -r requirements.txt"
- You can leave your virtual environment using "deactivate", and re-enter it using the above activation command
- Virtual environments help isolate project dependencies for your specific system, use it whenever you are adding new modules
- Add requirements by using "pip freeze > requirements.txt"
- Install MongoDB, and run the service before opening server with "brew services start mongodb/brew/mongodb-community" (mac)
- Open app.py with "python app.py" and access it with localhost:5000
- Use MongoDB Compass to access or see database

Installation Instructions (user):
TBD
