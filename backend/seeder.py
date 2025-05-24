"""
Seeder script to populate the database with 3 default users
Run using: python seeder.py
"""

from mongoengine import connect, disconnect
from db_models import User
import hashlib

# Connect to MongoDB
connect(db='flask_database', host='localhost', port=27017)

# Helper to hash passwords???
def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

# Creates sample users. Location still NOT decided on!!! Included Password???
users = [
    {
        "username": "alice",
        "password": "694208008",
        "location": {"type": "Point", "coordinates": [0, 0]},
    },
    {
        "username": "bob",
        "password": "654321",
        "location": {"type": "Point", "coordinates": [0, 0]},
    },
    {
        "username": "charlie",
        "password": "sowrd789",
        "location": {"type": "Point", "coordinates": [0, 0]},
    }
]

# Save users to DB
for u in users:
    user = User(
        username=u['username'],
        password_hash=hash_password(u['password']),
        location=u['location']
    )
    user.save()
    print(f"Created user: {user.username}")

# Disconnect when done
disconnect()
