require('./config/config');
const express = require('express');
const _ = require('lodash');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./model/Todo');
const {User} = require('./model/User');

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  let newTodo = new Todo({
    text: req.body.text,
  });

  newTodo.save().then((doc) => {
    res.send(doc);
  }, (err) => {
    res.status(400).send(err);
  });
});

app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({todos});
  }, (err) => {
    res.status(400).send(err);
  });
});

app.get('/todos/:id', (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(404).send('Invalid ID');
  }
  Todo.findById(req.params.id).then((todo) => {
    todo ? res.send(todo) : res.status(404).send('Not Found');
  }, (e) => {
    res.status(400).send(e);
  });
});

app.delete('/todos/:id', (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(404).send('invalid id');
  }
  Todo.findByIdAndDelete(req.params.id).then((todo) => {
    todo ? res.send(todo) : res.status(404).send('not found');
  }, (e) => {
    res.status(400).send(e);
  });
});

app.patch('/todos/:id', (req, res) => {
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
  Todo.findByIdAndUpdate(req.params.id, {$set: body}, {new: true})
  .then((todo) => {
    todo ? res.send(todo) : res.status(404).send('not found');
  }).catch((e) => res.status(400).send(e));
});

app.post('/users', (req, res) => {
  let body = _.pick(req.body, ['email', 'password']);
  let newUser = new User(body);

  newUser.save().then((user) => {
    res.send(user);
  }).catch((e) => res.status(400).send(e));
});

app.listen(port, () => {
  console.log(`server started on port ${port}`);
});

module.exports = {app};
