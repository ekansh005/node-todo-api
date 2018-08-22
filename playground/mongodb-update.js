const {MongoClient, ObjectID} = require('mongodb');
const assert = require('assert');

const connectionString = 'mongodb://localhost:27017';
const dbName = 'TodoApp';

MongoClient.connect(connectionString, (err, client) => {
  assert.equal(null, err);
  console.log('connected to Database');

  const db = client.db(dbName);

  // db.collection('Todos').findOneAndUpdate({
  //   _id: new ObjectID('5b7dcd2404223d31e05a22f3'),
  // }, {
  //   $set: {completed: true},
  // }, {returnOriginal: false})
  // .then((result) => {
  //   console.log(result);
  // }, (err) => {
  //   assert.equal(null, err);
  // });

  db.collection('Users').findOneAndUpdate({
    _id: new ObjectID('5b7c82050fb88d46543f99e6'),
  }, {
    $inc: {age: 1},
  }, {
    returnOriginal: false,
  })
  .then((result) => {
    console.log(result);
  }, (err) => {
    assert.equal(null, err);
  });

  // client.close();
});
