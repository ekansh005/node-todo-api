const {MongoClient, ObjectID} = require('mongodb');
const assert = require('assert');

const connectionString = 'mongodb://localhost:27017';
const dbName = 'TodoApp';

MongoClient.connect(connectionString, (err, client) => {
  assert.equal(null, err);
  console.log('connected to Database');

  const db = client.db(dbName);

  // db.collection('Todos').deleteOne({text: 'eat lunch'})
  // .then((result) => {
  //   assert(1, result.n);
  //   console.log(result);
  // });

db.collection('Todos').findOneAndDelete({completed: false})
.then((result) => {
  console.log(result);
}, (err) => {
  assert.equal(null, err);
});

  // client.close();
});
