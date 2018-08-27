const express = require('express');
const bodyParser = require('body-parser');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./model/Todo');
const {User} = require('./model/User');

const app = express();

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

app.listen(3000, () => {
  console.log('server started on port 3000');
});

module.exports = {app};
