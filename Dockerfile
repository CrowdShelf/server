# Base Docker-image on Ubuntu
FROM    ubuntu:latest

MAINTAINER M.Y. Stein-Otto Svorstol <stein-otto@svorstol.com>

# Import MongoDB public GPG key AND create a MongoDB list file
RUN apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
RUN echo "deb http://repo.mongodb.org/apt/ubuntu "$(lsb_release -sc)"/mongodb-org/3.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-3.0.list

# Update apt-get sources AND install MongoDB + curl + git
RUN apt-get update && apt-get install -y mongodb-org git curl

# Create the MongoDB data directory
RUN mkdir -p /data/db

# Expose MongoDB port 27017
EXPOSE 27017

# Environment variable for the node-server
ENV MONGODB="mongodb://localhost:27017/test"

# Install NodeJS
RUN curl --silent --location https://deb.nodesource.com/setup_0.12 | sudo bash -
RUN apt-get update && apt-get install -y nodejs

# Git-clone project
git clone https://github.com/CrowdShelf/server.git

# Server runs on port 3000
EXPOSE 3000

# Install dependencies and start server and database
CMD cd /server && sh start.sh