const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../model/Todo');

const aSeed = [{
  _id: new ObjectID(),
  text: '1st todo',
}, {
  _id: new ObjectID(),
  text: '2nd todo',
  completed: true,
  completedAt: 123,
}];
beforeEach((done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(aSeed);
  }).then(() => done());
});

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    let text = 'some test todo';

    request(app)
    .post('/todos')
    .send({text})
    .expect(200)
    .expect((res) => {
      expect(res.body.text).toBe(text);
    })
    .end((err, res) => {
      if (err) {
        return done(err);
      }
      Todo.find({text}).then((todos) => {
        expect(todos.length).toBe(1);
        expect(todos[0].text).toBe(text);
        done();
      }).catch((err) => done(err));
    });
  });

  it('should NOT create todo when data is not complete', (done) => {
    request(app)
    .post('/todos')
    .send({})
    .expect(400)
    .end((err, res) => {
      if (err) {
        return done(err);
      }
      Todo.find().then((todos) => {
        expect(todos.length).toBe(2);
        done();
      }).catch((e) => done(e));
    });
  });
});

describe('GET /todos', () => {
  it('should list all todos', (done) => {
    request(app)
    .get('/todos')
    .expect(200)
    .expect((res) => {
      expect(res.body.todos.length).toBe(2);
    })
    .end(done);
  });
});

describe('GET /todos/:id', () => {
  it('should fetch one todo by id', (done) => {
    const id = aSeed[0]._id.toHexString();
    request(app)
    .get(`/todos/${id}`)
    .expect(200)
    .expect((res) => {
      expect(res.body._id).toBe(id);
    })
    .end(done);
  });

  it('should return 404 if object id is not found', (done) => {
    const id = new ObjectID().toHexString();
    request(app)
    .get(`/todos/${id}`)
    .expect(404)
    .end(done);
  });

  it('should return 404 when passed non id', (done) => {
    request(app)
    .get('/todos/1234')
    .expect(404)
    .end(done);
  });
});

describe('DELETE /todos/:id', () => {
  it('should delete a valid todo', (done) => {
    const id = aSeed[0]._id.toHexString();
    request(app)
    .delete(`/todos/${id}`)
    .expect(200)
    .expect((res) => {
      expect(res.body._id).toBe(id);
    })
    .end((err, res) => {
      if (err) {
        return done(err);
      }
      Todo.findById(id).then((todo) => {
        expect(todo).toBeFalsy();
        done();
      }).catch((e) => done(e));
    });
  });

  it('should return 404 if todo is not Found', (done) => {
    const id = new ObjectID().toHexString();
    request(app)
    .delete(`/todos/${id}`)
    .expect(404)
    .end(done);
  });

  it('should return 404 if id is not valid', (done) => {
    request(app)
    .delete(`/todos/1234`)
    .expect(404)
    .end(done);
  });
});

describe('PATCH /todos/:id', () => {
  it('should update todo', (done) => {
    const id = aSeed[0]._id.toHexString();
    request(app)
    .patch(`/todos/${id}`)
    .send({
      text: 'updated',
      completed: true,
    })
    .expect(200)
    .expect((res) => {
      expect(res.body.text).toBe('updated');
      expect(res.body.completed).toBe(true);
      expect(typeof res.body.completedAt).toBe('number');
    })
    .end(done);
  });

  it('should clear completedAt when todo is not completed', (done) => {
    const id = aSeed[1]._id.toHexString();
    request(app)
    .patch(`/todos/${id}`)
    .send({
      text: 'updated second',
    })
    .expect(200)
    .expect((res) => {
      expect(res.body.text).toBe('updated second');
      expect(res.body.completed).toBe(false);
      expect(res.body.completedAt).toBeNull();
    })
    .end(done);
  });
});
