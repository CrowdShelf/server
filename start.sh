# Start db
mongod --smallfiles --port 27017  &

# Install dependencies and start server
npm install
npm start
