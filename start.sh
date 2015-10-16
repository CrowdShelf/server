# Start db
mongod --smallfiles --port 27017 --dbpath /data/db  &

# Insert needed collections
mongo "loalhost:27017/test" db-setup.js

# Install dependencies and start server
npm install
npm start
