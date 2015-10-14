# Start db
mongod --smallfiles --port 27017 --dbpath /data/db  &
# Insert needed collections
mongo "loalhost:27017/test" --eval 'db.test.createCollection("Books");'
mongo "loalhost:27017/test" --eval 'db.test.createCollection("Crowds");'
mongo "loalhost:27017/test" --eval 'db.test.createCollection("Users");'

# Install dependencies and start server
npm install
npm start
