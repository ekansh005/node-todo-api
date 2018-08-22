const {MongoClient, ObjectID} = require('mongodb');
const assert = require('assert');

const connectionString = 'mongodb://localhost:27017';
const dbName = 'TodoApp';

MongoClient.connect(connectionString, (err, client) => {
  assert.equal(null, err);
  console.log('connected to Database');

  const db = client.db(dbName);

  db.collection('Todos').find().toArray().then((docs) => {
    console.log(JSON.stringify(docs, undefined, 2));
  }, (err) => {
    assert.equal(null, err);
  });
});
