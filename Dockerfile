# Base Docker-image on centos
FROM    centos:centos6
# Enable EPEL for Node.js
RUN     rpm -Uvh http://download.fedoraproject.org/pub/epel/6/i386/epel-release-6-8.noarch.rpm
# Install Node.js and npm
RUN     yum install -y npm

# Install Mongodb
RUN 	yum -y install mongodb-server; yum clean all 

# Copy project into Docker-folder /src
COPY . /src
# Install dependencies
RUN cd /src; npm install

# Server runs on 3000
EXPOSE 3000

# CMD for starting server 
CMD ["node", "/src/index.js"] 
