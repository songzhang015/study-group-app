# Backend Dockerfile for Study Group App
#
# Downloads all of the required dependencies for the backend
# and uses a prebuilt Python 3.12 image
# 
# Author: Song Zhang
# Last Modified: 05/07/2025

FROM python:3.12
WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 5000

ENV FLASK_APP=app.py
ENV FLASK_RUN_HOST=0.0.0.0

CMD ["flask", "run"]