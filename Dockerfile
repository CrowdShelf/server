# Base Docker-image on centos
FROM    ubuntu:latest

MAINTAINER M.Y. Stein-Otto Svorstol <stein-otto@svorstol.com>

# Import MongoDB public GPG key AND create a MongoDB list file
RUN apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
RUN echo "deb http://repo.mongodb.org/apt/ubuntu "$(lsb_release -sc)"/mongodb-org/3.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-3.0.list

# Update apt-get sources AND install MongoDB + curl
RUN apt-get update && apt-get install -y mongodb-org curl

# Create the MongoDB data directory
RUN mkdir -p /data/db

# Expose port 27017 from the container to the host so you can modify it if you want with a shell or whatever
EXPOSE 27017

# Set usr/bin/mongod as the dockerized entry-point application
ENTRYPOINT ["/usr/bin/mongod"]

# Replace shell with bash so we can source files
RUN rm /bin/sh && ln -s /bin/bash /bin/sh

# NVM and node
ENV NVM_DIR /usr/local/nvm
ENV NODE_VERSION stable

RUN curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.29.0/install.sh | bash \
    && source $NVM_DIR/nvm.sh \
    && nvm install $NODE_VERSION \
    && nvm alias default $NODE_VERSION \
    && nvm use default

ENV NODE_PATH $NVM_DIR/v$NODE_VERSION/lib/node_modules
ENV PATH      $NVM_DIR/v$NODE_VERSION/bin:$PATH


# Copy project into Docker-folder /src
COPY . /src
# Install dependencies
RUN cd /src && nvm use default && npm install

# Server runs on 3000
EXPOSE 3000

# CMD for starting server 
CMD ["node", "/src/index.js"]

