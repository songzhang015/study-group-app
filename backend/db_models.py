"""
MongoDB object schemas for CS 422 Project 2: Study Group App.

This file defines MongoEngine models for storing users and study groups,
with support for geolocation (latitude/longitude).

"""

from mongoengine import *
from bson.objectid import ObjectId


#this function generates a new unique string ID, using MongoDBs built-in ObjectId.
def new_obj_id() -> str:
    return str(ObjectId())


class User(Document):
    """
    A user of the study group app.
    """
    meta = {'collection': 'users'}
    _id = StringField(primary_key=True, default=new_obj_id)
    username = StringField(required=True, unique=True)
    location = PointField(required=False)  # [longitude, latitude]
    current_study_group_id = StringField(required=False)
    # joined_groups = ListField(ReferenceField('StudyGroup')) # Going to comment this out for now, to match app.py


class StudyGroup(Document):
    """
    A study group that users can create, host, and join.
    """
    # Metadata for MongoEngine sets the collection name and indexes location data
    meta = {
        'collection': 'studygroups',  # Stores documents in "studygroups" MongoDB collection
        'indexes': [
            {'fields': ['$location'], '2dsphere': True} #Supposed to allow geospatial queries on the 'location'
        ]
    }

    # Unique ID for each study group, stored as a string
    _id = StringField(primary_key=True, default=new_obj_id)
    name = StringField(required=True)
    # Optional description of the group
    description = StringField()
    course_code = StringField(required=True)

    # Refers to the User document who is the host of this group
    host = ReferenceField('User', required=True)

    # Geolocation of the study group (longitude, latitude), stored using GeoJSON format
    location = PointField(required=True)

    # Scheduled start to the end time of the study session
    start_time = DateTimeField(required=True)
    end_time = DateTimeField(required=True)

    # Maximum number of allowed members in the group. Does it even need a limit???
    max_members = IntField(default=10)
    # Whether the group is open to new members joining
    is_open = BooleanField(default=True)

    #Lists of User references who have joined this study group???
    members = ListField(ReferenceField('User'))

    @property
    def duration(self):
        """Duration in minutes."""
        if self.start_time and self.end_time:
            return (self.end_time - self.start_time).total_seconds() / 60
        return None
