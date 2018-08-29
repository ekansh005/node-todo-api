const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/model/Todo');

let id = '6b84605f950fef3740964792xxxx';

if (!ObjectID.isValid(id)) {
  console.log('Object ID is not valid');
}

// Todo.find({
//   _id: id,
// }).then((todos) => {
//   console.log('Todos:', todos);
// });
//
// Todo.findOne({
//   _id: id,
// }).then((todo) => {
//   console.log('Todo:', todo);
// });

Todo.findById(id).then((todo) => {
  console.log('Todo by Id:', todo);
});
