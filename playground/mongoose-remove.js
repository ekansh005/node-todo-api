const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/model/Todo');

// Todo.remove({}).then((result) => {
//   console.log(result);
// });

Todo.findOneAndRemove('5b8b2492c6d865c51810f265').then((todo) => {
  console.log(todo);
});
