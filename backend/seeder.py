"""
Seeder script to populate the database with 3 default users
Run using: python seeder.py
"""

from mongoengine import connect, disconnect
from db_models import User

# Connect to MongoDB
connect(db='flask_database', host='localhost', port=27017)

#Optionally clears existing users to avoid possible duplicates
User.drop_collection()

# Sample users for the prototype (username + location only)
users = [
    {
        "username": "alice",
        "location": {"type": "Point", "coordinates": [-122.4194, 37.7749]},  # San Francisco
    },
    {
        "username": "bob",
        "location": {"type": "Point", "coordinates": [-118.2437, 34.0522]},  # Los Angeles
    },
    {
        "username": "charlie",
        "location": {"type": "Point", "coordinates": [-73.9352, 40.7306]},   # New York
    }
]

# Save each user to the database
for u in users:
    user = User(
        username=u['username'],
        location=u['location']
    )
    user.save()
    print(f"Created user: {user.username}")

# Disconnect when done
disconnect()
