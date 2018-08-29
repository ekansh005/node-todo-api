const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./model/Todo');
const {User} = require('./model/User');

const app = express();
const port = process.env.PORT || 3000;

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
    res.status(404).send(e);
  });
});

app.listen(port, () => {
  console.log(`server started on port ${port}`);
});

module.exports = {app};
