"""
Seeder file to populate the database with 3 default users.

Ran automatically when server is started, but will only populate IF
the database is empty. Essentially, test users for utilizing the prototype
and will not be used when the app finishes development.

Provides just the barebones information to satisfy the schemas in "db_models.py"
located in the same directory as a canvas for users and developers to test
the app's functionality.

Author: Derek Van Devender
Last Modified: 05/27/2025
"""

from db_models import User

def seed_db():
    # Clears existing users to avoid possible duplicates
    User.drop_collection()

    # Sample users for the prototype (username + location only)
    users = [
        {
            "username": "Alice",
        },
        {
            "username": "Bob",
        },
        {
            "username": "Charlie",
        }
    ]

    # Save each user to the database
    for u in users:
        user = User(
            username=u['username'],
            current_study_group_id=""
        )
        user.save()
        print(f"Created user: {user.username}")
