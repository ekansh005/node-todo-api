const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../model/Todo');
const {User} = require('./../../model/User');

const aUserIds = [new ObjectID(), new ObjectID()];
const aUsers = [{
  _id: aUserIds[0],
  email: 'user1@test.com',
  password: 'userOnePass',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: aUserIds[0], access: 'auth'}, process.env.JWT_SECRET)
    .toString(),
  }],
}, {
  _id: aUserIds[1],
  email: 'user2@test.com',
  password: 'userTwoPass',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: aUserIds[1], access: 'auth'}, process.env.JWT_SECRET)
    .toString(),
  }],
}];

const aTodos = [{
  _id: new ObjectID(),
  text: '1st todo',
  _creator: aUserIds[0],
}, {
  _id: new ObjectID(),
  text: '2nd todo',
  completed: true,
  completedAt: 123,
  _creator: aUserIds[1],
}];

const populateTodos = (done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(aTodos);
  }).then(() => done());
};

const populateUsers = (done) => {
  User.remove({}).then(() => {
    let aPromises = [];
    for (let i = 0; i < aUsers.length; i++) {
      aPromises.push(new User(aUsers[i]).save());
    }
    return Promise.all(aPromises);
  }).then(() => done());
};

module.exports = {
  aTodos,
  populateTodos,
  aUsers,
  populateUsers,
};
