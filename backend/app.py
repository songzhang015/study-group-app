"""
Basic Flask Backend

Run using "python app.py" while in backend directory

Access using:
http://localhost:5000/

Used for storing data between app and MongoDB
Currently not connected to mobile app
"""

from flask import Flask, jsonify, request
from pymongo import MongoClient

app = Flask(__name__)

client = MongoClient('localhost', 27017)
db = client.flask_database

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
    """Authenticates a user login with their credentials"""
    # TODO
    return jsonify({})

@app.route('/users/<user_id>', methods=['GET'])
def user_profile(user_id):
    """Retrieves information (ex. their study group) about a user using their ID"""
    # TODO
    return jsonify({})

@app.route('/study-groups', methods=['GET', 'POST'])
def study_group_collection():
    """
    Handles collection of study groups
    
    GET: Lists all study groups
    
    POST: Creates a new study group
    """
    # TODO
    if request.method == 'GET':
        return jsonify({})
    elif request.method == 'POST':
        return jsonify({})

@app.route('/study-groups/<group_id>', methods=['GET', 'PATCH', 'DELETE'])
def study_group_item(group_id):
    """
    Handles singular study group

    GET: Retrieves information about a study group using their ID

    PATCH: Updates an existing study group's details

    DELETE: Deletes a study group
    """
    try:
        group = StudyGroup.objects.get(_id=group_id)
    except DoesNotExist:
        return jsonify({"error": "Study group not found"}), 404

    if request.method == 'GET':
        # Serialize and return group info
        return jsonify({
            "id": group._id,
            "name": group.name,
            "description": group.description,
            "course_code": group.course_code,
            "host": str(group.host.id) if group.host else None,
            "location": group.location['coordinates'],
            "start_time": group.start_time.isoformat(),
            "end_time": group.end_time.isoformat(),
            "is_open": group.is_open,
            "max_members": group.max_members,
        })

    elif request.method == 'PATCH':
        data = request.get_json()
        # Update fields only if present in request
        group.name = data.get('name', group.name)
        group.description = data.get('description', group.description)
        group.course_code = data.get('course_code', group.course_code)
        group.is_open = data.get('is_open', group.is_open)
        group.max_members = data.get('max_members', group.max_members)

        if 'location' in data:
            group.location = data['location']  # Exact [lng, lat]???
        if 'start_time' in data:
            group.start_time = data['start_time']
        if 'end_time' in data:
            group.end_time = data['end_time']

        try:
            group.save()
            return jsonify({"message": "Study group has been updated"})
        except ValidationError as e:
            return jsonify({"error": str(e)}), 400

    elif request.method == 'DELETE':
        group.delete()
        return jsonify({"message": "Study group has been deleted"})







@app.route('/study-groups/<group_id>/status', methods=['PATCH'])
def study_group_status(group_id):
    """
    Modifies the broadcast status of study group
    
    If active, shows up in list for users to see

    Something like a boolean called "is_active" in study group item
    """
    # TODO
    return jsonify({})

@app.route('/study-groups/<group_id>/members', methods=['POST'])
def study_group_members_add(group_id):
    """Adds user to study group"""
    # TODO
    return jsonify({})

@app.route('/study-groups/<group_id>/members/<user_id>', methods=['DELETE'])
def study_group_members_remove(group_id, user_id):
    """Removes user from study group"""
    # TODO
    return jsonify({})

if __name__ == '__main__':
    app.run(debug=True)
