"""
Basic Flask Backend

Run using "python app.py" while in backend directory

Access using:
http://localhost:5000/

Used for storing data between app and MongoDB
Currently not connected to mobile app
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
from mongoengine import connect
from db_models import User, StudyGroup

app = Flask(__name__)
CORS(app)  # Should make all the frontend (Expo Go) to access this API. I THINK...

# Connect to MongoDB (local instance)
connect(db='flask_database', host='localhost', port=27017)






#My Test Route
@app.route('/users', methods=['GET'])
def list_users():
    users = User.objects()
    return jsonify([
        {
            "id": u._id,
            "username": u.username,
            "location": u.location['coordinates'] if u.location else None
        }
        for u in users
    ])












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
    # TODO
    return jsonify({})

@app.route('/users/<user_id>', methods=['GET'])
def user_profile(user_id):
    """Retrieves information (ex. their study group) about a user using their ID

    Response:
    {
      "user": {
        "id": "abc123",
        "username": "user1",
        "location": {
          "latitude": 12.34567,
          "longitude": 12.34567
        },
        "current_study_group_id": "abc123"
      }
    }
    """
    # TODO
    return jsonify({})

@app.route('/study-groups', methods=['GET', 'POST'])
def study_group_collection():
    """Handles collection of study groups
    
    GET: Lists all study groups
    Response:
    [
      {
        "id": "abc123",
        "name": "Topic 1",
      },
      {
        "id": "abc123",
        "name": "Topic 2",
      }
    ]
    
    POST: Creates a new study group
    Request:
    {
      "name": "Topic 1",
      "description": "Text",
      "owner_id": "abc123",
      "location": {
        "latitude": 12.34567,
        "longitude": 12.34567
      },
      "max_members": 5
    }
    Response:
    {
      "message": "Study group created successfully",
    }
    """
    # TODO
    if request.method == 'GET':
        return jsonify({})
    elif request.method == 'POST':
        return jsonify({})

@app.route('/study-groups/<group_id>', methods=['GET', 'PATCH', 'DELETE'])
def study_group_item(group_id):
    """Handles singular study group

    GET: Retrieves information about a study group using their ID
    Response:
    {
      "study_group": {
        "id": "abc123",
        "name": "Topic 1",
        "description": "Text",
        "owner_id": "abc123",
        "location": {
          "latitude": 12.34567,
          "longitude": 12.34567
        },
        "is_active": true,
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
      "message": "Study group updated successfully"
    }
    
    DELETE: Deletes a study group
    Response:
    {
      "message": "Study group deleted successfully"
    }
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
    """Modifies the broadcast status of study group

    If active, shows up in list for users to see

    Request:
    {
      "is_active": true
    }
    Response:
    {
      "message": "Study group status updated successfully"
    }
    """
    # TODO
    return jsonify({})

@app.route('/study-groups/<group_id>/members', methods=['POST'])
def study_group_members_add(group_id, user_id):
    """Adds user to study group

    Response:
    {
      "message": "User added to study group successfully"
    }
    """
    # TODO
    return jsonify({})

@app.route('/study-groups/<group_id>/members/<user_id>', methods=['DELETE'])
def study_group_members_remove(group_id, user_id):
    """Removes user from study group
    
    Response:
    {
      "message": "User removed from study group successfully"
    }
    """
    # TODO
    return jsonify({})

if __name__ == '__main__':
    app.run(debug=True)
