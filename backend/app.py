"""
The Backend Server for CS 422 Project 2: Study Group App

This file contains all the API routes designed using RESTful specifications.

These API routes allow the user interface of the application to communicate
with our database (MongoDB) by sending and receiving requests to and from
the server.

Authors: Derek Van Devender, Song Zhang
Last Modified: 05/27/2025
"""

import os
from flask import Flask, jsonify, request
from flask_cors import CORS # Might have to "pip install flask-cors" to use this
from mongoengine import connect, DoesNotExist, PointField
from db_models import User, StudyGroup
from seeder import seed_db

app = Flask(__name__)
CORS(app)  # This allows your frontend to access the backend or I think helps the Expo Go and Browser to connect

# Connect to MongoDB
db = os.getenv('db', 'mongodb://localhost:27017/studygroupapp')
connect(host=db)

# Populates the database with 3 default users IF database is empty
if User.objects.count() == 0:
    seed_db()


@app.route('/', methods=['GET'])
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

@app.route('/users', methods=['GET'])
def list_users():
    """Gets a list of all users"""
    users = User.objects()
    return jsonify([
        { "username": u.username }
        for u in users
    ])

@app.route('/users/<user_id>', methods=['GET'])
def user_profile(user_id):
    """Retrieves information (ex. their study group) about a user using their ID

    Response:
    {
      "user": {
        "_id": "abc123",
        "username": "user1",
        "current_study_group_id": "abc123"
      }
    }
    """
    try: 
        user = User.objects.get(_id=user_id)
    except DoesNotExist:
        return jsonify({"message": "User not found."}), 404
    return jsonify({
        "user": {
            "id": str(user._id),
            "username": user.username,
            "current_study_group_id": user.current_study_group_id
        }
    }), 200

@app.route('/study-groups', methods=['GET', 'POST'])
def study_group_collection():
    """Handles collection of study groups, note Location is [longitude, latitude]
    
    GET: Lists all study groups
    Response:
    [
      {
        "_id": "abc123",
        "name": "Topic 1",
        "current_members_count": "5",
        "max_members": "5",
        "location": [12.34567, 12.34567]
      {
        "_id": "abc123",
        "name": "Topic 2",
        "current_members_count": "5",
        "max_members": "5",
        "location": [12.34567, 12.34567]
      }
    ]
    
    POST: Creates a new study group
    Request:
    {
      "name": "Topic 1",
      "description": "Text",
      "_id": "abc123",
      "max_members": 5,
      "location": [12.34567, 12.34567]
    }
    Response:
    {
      "message": "Study group created successfully.",
      "group_id": "abc123"
    }
    """
    if request.method == 'GET':
        groups = StudyGroup.objects.all()

        groups_list = []
        for group in groups:
            groups_list.append({
                "_id": str(group._id),
                "name": group.name,
                "current_members_count": len(group.members),
                "max_members": group.max_members,
                "location": group.location['coordinates']
            })
        return jsonify(groups_list), 200
    elif request.method == 'POST':
        data = request.get_json()
        _id = data.get('_id') # ID of user to add them to group
        owner_user_object = User.objects.get(_id=_id)
        group_location = data.get('location')
        if not owner_user_object.current_study_group_id:
            new_group = StudyGroup(
                name=data.get('name'),
                description=data.get('description'),
                owner=owner_user_object,
                location=group_location,
                max_members=data.get('max_members')
            )
            new_group.save()
            new_group.members.append(owner_user_object)
            new_group.save()
            owner_user_object.current_study_group_id = new_group.id
            owner_user_object.save()
            return jsonify({"message": f"Study group created successfully.",
                            "group_id": str(new_group.id)}), 201
        else:
            return jsonify({"message": f"User is already associated with a study group.",}), 409
        

@app.route('/study-groups/<group_id>', methods=['GET', 'PATCH'])
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
        "location": [12.34567, 12.34567],
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
      "description": "Updated text",
      "location": [12.34567, 12.34567]
    }
    Response:
    {
      "message": "Study group updated successfully."
    }
    """
    try:
        group = StudyGroup.objects.get(_id=group_id)
    except DoesNotExist:
        return jsonify({"message": "Study group not found."}), 404
    if request.method == 'GET':
        member_ids = [str(member._id) for member in group.members]
        return jsonify({
            "_id": group._id,
            "name": group.name,
            "description": group.description,
            "owner": str(group.owner.id),
            "location": group.location['coordinates'],
            "max_members": group.max_members,
            "current_members_count": len(group.members),
            "members": member_ids
        })

    elif request.method == 'PATCH':
        data = request.get_json()
        # Update fields only if present in request
        group.name = data.get('name', group.name)
        group.description = data.get('description', group.description)
        group.max_members = data.get('max_members', group.max_members)

        if 'location' in data:
            new_location = data.get('location')
            group.location = new_location
        group.save()
        return jsonify({"message": "Study group has been updated."})

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
    group.members.remove(user)
    group.save()
    user.current_study_group_id = ""
    user.save()
    if not group.members:
        group.delete()
    return jsonify({"message": "User removed from study group successfully."}), 200

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0")
