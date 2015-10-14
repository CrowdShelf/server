# Base Docker-image on Ubuntu
FROM    ubuntu:latest

MAINTAINER M.Y. Stein-Otto Svorstol <stein-otto@svorstol.com>

# Import MongoDB public GPG key AND create a MongoDB list file
RUN apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
RUN echo "deb http://repo.mongodb.org/apt/ubuntu "$(lsb_release -sc)"/mongodb-org/3.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-3.0.list

# Update apt-get sources AND install MongoDB + curl
RUN apt-get update && apt-get install -y mongodb-org curl

# Create the MongoDB data directory
RUN mkdir -p /data/db

# Expose port 27017 from the container to the host
EXPOSE 27017

# Environment varaible for the node-server
ENV MONGODB="mongodb://localhost:27017/test"

# Install NodeJS
RUN curl --silent --location https://deb.nodesource.com/setup_0.12 | sudo bash -
RUN apt-get update && apt-get install -y nodejs

# Copy project into Docker-folder /src
COPY . /src

# Server runs on port 3000
EXPOSE 3000

# Install dependencies and start server and database
CMD cd /src && sh start.sh