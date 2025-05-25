"""
Seeder file to populate the database with 3 default users
Ran automatically when server is started, but will only populate IF database is empty
"""

from db_models import User

def seed_db():
    # Clears existing users to avoid possible duplicates
    User.drop_collection()

    # Sample users for the prototype (username + location only)
    users = [
        {
            "username": "Alice",
            "location": {"type": "Point", "coordinates": [-122.4194, 37.7749]},  # San Francisco
        },
        {
            "username": "Bob",
            "location": {"type": "Point", "coordinates": [-118.2437, 34.0522]},  # Los Angeles
        },
        {
            "username": "Charlie",
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
