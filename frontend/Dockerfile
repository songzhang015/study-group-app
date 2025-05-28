# Frontend Dockerfile for Study Group App
#
# Downloads all of the required dependencies for the frontend
# and uses a prebuilt Node.js image
# 
# Author: Song Zhang
# Last Modified: 05/27/2025

FROM node:18-alpine
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
EXPOSE 3000

CMD ["npm", "start"]