"""
Basic "Hello, World!" Flask Backend

Run using "python app.py" while in backend directory

Access using:
http://localhost:5000/

Used for storing data between app and MongoDB
Currently not connected to mobile app
"""

from flask import Flask, redirect, url_for
from pymongo import MongoClient

app = Flask(__name__)

client = MongoClient('localhost', 27017)
db = client.flask_database

@app.route('/')
def index():
    """Redirects user to the home endpoint."""
    return redirect(url_for("home"))

@app.route('/home')
def home():
    return "Home"

@app.route('/login')
def login():
    return "Login"

if __name__ == '__main__':
    app.run(debug=True)
