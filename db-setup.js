var connection = new Mongo('localhost:27017').getDB('test');
db.createCollection('Users');
db.createCollection('Books');
db.createCollection('Crowds'); 


