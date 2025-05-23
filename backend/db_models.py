"""
MongoDB object schemas for CS 422 Project 2: Study Group App.

This file defines MongoEngine models for storing users and study groups,
with support for geolocation (latitude/longitude).

"""

from mongoengine import *
from bson.objectid import ObjectId


def new_obj_id() -> str:
    return str(ObjectId())


class User(Document):
    """
    A user of the study group app.
    """
    meta = {'collection': 'users'}
    _id = StringField(primary_key=True, default=new_obj_id)
    username = StringField(required=True, unique=True)
