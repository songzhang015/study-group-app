# CS 422 Project 2: Study Group App
A location-based app for forming and finding study groups nearby for similar courses or topics.

## Authors
- Derek Van Devender
- Kaleo Montero
- Sawyer Christensen
- Song Zhang

## Installation Instructions

1. Install Node.js from https://nodejs.org/ which includes npm
2. In the terminal, clone the github directory and cd into the project/frontend folder (make sure you are in the frontend folder)
3. Run "npm install" inside the frontend folder
     - Note: If npm is not recognized, try closing and re-opening your terminal
4. You can either install Expo Go on your mobile device or download Xcode/Android Studio to test running the app
     - Download Expo Go on your iOS/Android device, make an account, and run "npm run start" in your terminal
     - Scan the QR and you can simulate your app within Expo Go (make sure you are on the same wifi)
     - OR
     - Download Xcode (iOS) or Android Studio (Android)
     - Run the command "npm run ios" or "npm run android" in your terminal

Backend:
- Make sure the above installation instructions work
- Download Python if you haven't already (https://www.python.org/downloads/)
- cd into the project's backend folder
- Create a virtual environment, use "python3 -m venv venv" (if "python3" is not recognized, try "python" or "py")
- Activate your virtual environment (do this everytime you wish to work on the backend)
     - Mac: Activate your env using "source venv/bin/activate"
     - Windows: Activate your env using "venv\Scripts\activate" OR "venv\bin\activate" if the first command did not work
     - Make sure the terminal displays a green "(venv)" at the beginning of your prompt
- Once activated, run "pip install -r requirements.txt"
     - If you get an error, run "pip cache purge" first before pip install
- You can leave your virtual environment using "deactivate", and re-enter it using the above activation command
     - Virtual environments help isolate project dependencies for your specific system, activate it whenever you are developing the backend
- Add requirements by using "pip freeze > requirements.txt"
     - Everytime you install a new library/module, run the pip freeze command so other people can download it too
- Install MongoDB (https://www.mongodb.com/try/download/community), and make sure the service is started before opening the server
     - Mac: Run "brew services start mongodb/brew/mongodb-community" in the terminal if MongoDB services are not automatically started
     - Windows: Run "net start MongoDB" in the terminal if MongoDB services are not automatically started
          - You may have to run this command in an admin terminal
- Open app.py with "python app.py" and access it with localhost:5000
- Use MongoDB Compass to access or see database via its GUI
