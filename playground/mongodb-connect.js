const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const connectionString = 'mongodb://localhost:27017';
const dbName = 'TodoApp';

MongoClient.connect(connectionString, (err, client) => {
  assert.equal(null, err);
  console.log('Connected to Database');

  const db = client.db(dbName);

  db.collection('Todos').insertOne({
    text: 'my second task',
    completed: true,
  }, (err, result) => {
    assert.equal(null, err);
    console.log('1 record inserted');
  });

  // db.collection('Users').insertOne({
  //   name: 'ekansh',
  //   age: 28,
  //   location: 'france',
  // }, (err, result) => {
  //   assert.equal(null, err);
  //   console.log(result.ops);
  // });

  client.close();
});
