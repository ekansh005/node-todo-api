require('./config/config');
const express = require('express');
const _ = require('lodash');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./model/Todo');
const {User} = require('./model/User');
const {authenticate} = require('./middleware/authenticate');

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.post('/todos', authenticate, (req, res) => {
  let newTodo = new Todo({
    text: req.body.text,
    _creator: req.user._id,
  });

  newTodo.save().then((doc) => {
    res.send(doc);
  }, (err) => {
    res.status(400).send(err);
  });
});

app.get('/todos', authenticate, (req, res) => {
  Todo.find({
    _creator: req.user._id,
  }).then((todos) => {
    res.send({todos});
  }, (err) => {
    res.status(400).send(err);
  });
});

app.get('/todos/:id', authenticate, (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(404).send('Invalid ID');
  }
  Todo.findOne({
    _id: req.params.id,
    _creator: req.user._id,
  }).then((todo) => {
    todo ? res.send(todo) : res.status(404).send('Not Found');
  }, (e) => {
    res.status(400).send(e);
  });
});

app.delete('/todos/:id', authenticate, (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(404).send('invalid id');
  }
  Todo.findOneAndRemove({
    _id: req.params.id,
    _creator: req.user._id,
  }).then((todo) => {
    todo ? res.send(todo) : res.status(404).send('not found');
  }, (e) => {
    res.status(400).send(e);
  });
});

app.patch('/todos/:id', authenticate, (req, res) => {
  let body = _.pick(req.body, ['text', 'completed']);
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(404).send('invalid id');
  }
  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }
  Todo.findOneAndUpdate({
    _id: req.params.id,
    _creator: req.user._id,
  }, {$set: body}, {new: true})
  .then((todo) => {
    todo ? res.send(todo) : res.status(404).send('not found');
  }).catch((e) => res.status(400).send(e));
});

app.post('/users', (req, res) => {
  let body = _.pick(req.body, ['email', 'password']);
  let user = new User(body);

  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send(user);
  }).catch((e) => res.status(400).send(e));
});

app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

app.post('/users/login', (req, res) => {
  let body = _.pick(req.body, ['email', 'password']);
  User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
    });
  }).catch((e) => {
    res.status(400).send();
  });
});

app.delete('/users/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.send();
  }).catch((e) => res.status(400).send());
});

app.listen(port, () => {
  console.log(`server started on port ${port}`);
});

module.exports = {app};
