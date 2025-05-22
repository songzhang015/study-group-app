# CS 422 Project 2: Study Group App
A location-based app for forming and finding study groups nearby for similar courses or topics.

## Authors
- Derek Van Devender
- Kaleo Montero
- Sawyer Christensen
- Song Zhang

Installation Instructions

1. Install Node.js from https://nodejs.org/ which includes npm
2. In the terminal, clone the github directory and cd into the project/frontend folder (make sure you are in the frontend folder)
3. Run "npm install" inside the frontend folder
     - Note: If npm is not recognized, try to close and re-open your terminal
4. You can either install Expo Go on your mobile device or download Xcode/Android Studio
     - Download Expo Go on your iOS/Android device, make an account, and run "npm run start" in your terminal
     - Scan the QR and you can simulate your app within Expo Go (make sure you are on the same wifi)
     - OR
     - Download Xcode (iOS) or Android Studio (Android)
     - Run the command "npm run ios" or "npm run android" in your terminal

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
