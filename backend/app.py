"""
Server backend code made using Flask

Run using "python3 app.py" while in the backend directory

Used for storing/retrieving data between app and MongoDB

Authors: Derek Van Devender, Song Zhang
"""

import os
from flask import Flask, jsonify, request
# from flask_cors import CORS # I am NOT SURE, if this is needed yet...might have to "pip install flask-cors" to use this
from mongoengine import connect, DoesNotExist
from db_models import User, StudyGroup
from seeder import seed_db

app = Flask(__name__)
# CORS(app)  # This allows your frontend to access the backend or I think helps the Expo Go and Browser to better connect... but I am NOT SURE yet.

# Connect to MongoDB
db = os.getenv('db', 'mongodb://localhost:27017/studygroupapp')
connect(host=db)

# Populates the database with 3 default users IF database is empty
if User.objects.count() == 0:
    seed_db()


# Test Route
"""
@app.route('/users', methods=['GET'])
def list_users():
    users = User.objects()
    return jsonify([
        {
            "_id": u._id,
            "username": u.username,
            "location": u.location['coordinates'] if u.location else None
        }
        for u in users
    ])
"""


@app.route('/')
def index():
    """Returns simple API status message"""
    return jsonify({"message": "Flask API is running"})

@app.route('/register', methods=['POST'])
def register():
    """Registration not used or implemented for now"""
    return jsonify({})

@app.route('/login', methods=['POST'])
def login():
    """Authenticates a user login with their credentials
    3 sample users for prototype, no email/password login
    Current usernames are "Alice", "Bob", "Charlie"

    Request:
    {
      "user_selection": "user1"
    }
    
    Response:
    {
      "message": "Login successful as User 1",
      "user_id": "abc123"
    }
    """
    data = request.get_json()

    username = data['user_selection']

    user = User.objects(username=username).first()

    if user:
        return jsonify({
            "message": f"Login successful as {username}",
            "user_id": str(user._id)
        }), 200
    else:
        return jsonify({"message": f"User '{username}' not found."}), 404

@app.route('/users/<user_id>', methods=['GET'])
def user_profile(user_id):
    """Retrieves information (ex. their study group) about a user using their ID

    Response:
    {
      "user": {
        "_id": "abc123",
        "username": "user1",
        "location": {
          "longitude": 12.34567,
          "latitude": 12.34567
        },
        "current_study_group_id": "abc123"
      }
    }
    """
    try: 
        user = User.objects.get(_id=user_id)
    except DoesNotExist:
        return jsonify({"message": "User not found."}), 404
    loc_data = None
    if user.location:
        # MongoDB stores longitude first
        loc_data = {
            "longitude": user.location['coordinates'][0],
            "latitude": user.location['coordinates'][1]
        }
    return jsonify({
        "user": {
            "id": str(user._id),
            "username": user.username,
            "location": loc_data,
            "current_study_group_id": user.current_study_group_id
        }
    }), 200

@app.route('/study-groups', methods=['GET', 'POST'])
def study_group_collection():
    """Handles collection of study groups
    
    GET: Lists all study groups
    Response:
    [
      {
        "_id": "abc123",
        "name": "Topic 1",
      },
      {
        "_id": "abc123",
        "name": "Topic 2",
      }
    ]
    
    POST: Creates a new study group
    Request:
    {
      "name": "Topic 1",
      "description": "Text",
      "owner_id": "abc123",
      "max_members": 5
    }
    Response:
    {
      "message": "Study group created successfully.",
    }
    """
    if request.method == 'GET':
        groups = StudyGroup.objects.all()

        groups_list = []
        for group in groups:
            groups_list.append({
                "_id": str(group._id),
                "name": group.name
            })
        return jsonify(groups_list), 200
    elif request.method == 'POST':
        data = request.get_json()
        owner_id = data.get('owner_id')
        owner_user_object = User.objects.get(_id=owner_id)
        if not owner_user_object.current_study_group_id:
            study_group_location = owner_user_object.location

            new_group = StudyGroup(
                name=data.get('name'),
                description=data.get('description'),
                owner=owner_user_object,
                location=study_group_location,
                max_members=data.get('max_members')
            )
            new_group.save()
            new_group.members.append(owner_user_object)
            new_group.save()
            owner_user_object.current_study_group_id = new_group.id
            owner_user_object.save()
            return jsonify({"message": f"Study group created successfully.",}), 201
        else:
            return jsonify({"message": f"User is already associated with a study group.",}), 409
        

@app.route('/study-groups/<group_id>', methods=['GET', 'PATCH', 'DELETE'])
def study_group_item(group_id):
    """Handles singular study group

    GET: Retrieves information about a study group using their ID
    Response:
    {
      "study_group": {
        "_id": "abc123",
        "name": "Topic 1",
        "description": "Text",
        "owner_id": "abc123",
        "location": {
          "longitude": 12.34567,
          "latitude": 12.34567
        },
        "is_open": true,
        "max_members": 5,
        "current_members_count": 5,
        "members": [
          "abc123",
          "abc123"
        ],
      }
    }

    PATCH: Updates an existing study group's details
    Request:
    {
      "description": "Updated text"
    }
    Response:
    {
      "message": "Study group updated successfully."
    }
    
    DELETE: Deletes a study group
    Response:
    {
      "message": "Study group deleted successfully."
    }
    """
    try:
        group = StudyGroup.objects.get(_id=group_id)
    except DoesNotExist:
        return jsonify({"message": "Study group not found."}), 404
    if request.method == 'GET':
        return jsonify({
            "_id": group._id,
            "name": group.name,
            "description": group.description,
            "owner": str(group.owner.id),
            "location": group.location['coordinates'],
            "is_open": group.is_open,
            "max_members": group.max_members,
        })

    elif request.method == 'PATCH':
        data = request.get_json()
        # Update fields only if present in request
        group.name = data.get('name', group.name)
        group.description = data.get('description', group.description)
        group.is_open = data.get('is_open', group.is_open)
        group.max_members = data.get('max_members', group.max_members)

        if 'location' in data:
            group.location = [data['location']['longitude'], data['location']['latitude']]  # Format: [lng, lat]
        group.save()
        return jsonify({"message": "Study group has been updated."})

    elif request.method == 'DELETE':
        all_members = list(group.members)
        for member in all_members:
            member.current_study_group_id = ""
            member.save()
        group.delete()
        return jsonify({"message": "Study group has been deleted."})


@app.route('/study-groups/<group_id>/status', methods=['PATCH'])
def study_group_status(group_id):
    """Modifies the broadcast status of study group

    If active, shows up in list for users to see

    Request:
    {
      "is_open": true
    }
    Response:
    {
      "message": "Study group status updated successfully."
    }
    """
    try:
        group = StudyGroup.objects.get(_id=group_id)
    except DoesNotExist:
        return jsonify({"error": "Study group not found."}), 404
    data = request.get_json()
    group.is_open = data.get('is_open', group.is_open)
    group.save()
    return jsonify({"message": "Study group status updated successfully."})


@app.route('/study-groups/<group_id>/members/<user_id>', methods=['POST'])
def study_group_members_add(group_id, user_id):
    """Adds user to study group

    Response:
    {
      "message": "User added to study group successfully."
    }
    """
    try:
        group = StudyGroup.objects.get(_id=group_id)
    except DoesNotExist:
        return jsonify({"error": "Study group not found."}), 404
    try:
        user = User.objects.get(_id=user_id)
    except DoesNotExist:
        return jsonify({"error": "User not found."}), 404
    if user in group.members:
        return jsonify({"message": "User is already a member of this study group."}), 409
    if user.current_study_group_id:
        return jsonify({"message": "User is already a member of another study group."}), 409
    if len(group.members) >= group.max_members:
        return jsonify({"message": "Study group is full"}), 400
    user.current_study_group_id = group.id
    user.save()
    group.members.append(user)
    group.save()
    return jsonify({"message": f"User added to study group successfully."}), 201

@app.route('/study-groups/<group_id>/members/<user_id>', methods=['DELETE'])
def study_group_members_remove(group_id, user_id):
    """Removes user from study group

    Response:
    {
      "message": "User removed from study group successfully."
    }
    """
    try:
        group = StudyGroup.objects.get(_id=group_id)
    except DoesNotExist:
        return jsonify({"error": "Study group not found."}), 404
    try:
        user = User.objects.get(_id=user_id)
    except DoesNotExist:
        return jsonify({"error": "User not found."}), 404
    if user not in group.members:
        return jsonify({"message": "User is not a member of this study group."}), 404
    if user_id == group.owner.id:
        return jsonify({"message": "The owner cannot leave the study group, try deleting the group instead."}), 403
    group.members.remove(user)
    group.save()
    user.current_study_group_id = ""
    user.save()
    return jsonify({"message": "User removed from study group successfully."}), 200

if __name__ == '__main__':
    app.run(debug=True)
