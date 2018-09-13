const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');
const _ = require('lodash');

const {app} = require('./../server');
const {Todo} = require('./../model/Todo');
const {User} = require('./../model/User');
const {aTodos, populateTodos, aUsers, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

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
    const id = aTodos[0]._id.toHexString();
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
    const id = aTodos[0]._id.toHexString();
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
    const id = aTodos[0]._id.toHexString();
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
    const id = aTodos[1]._id.toHexString();
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

describe('GET /users/me', () => {
  it('should return user details if authenticated', (done) => {
    request(app)
    .get('/users/me')
    .set('x-auth', aUsers[0].tokens[0].token)
    .expect(200)
    .expect((res) => {
      expect(res.body._id).toBe(aUsers[0]._id.toHexString());
      expect(res.body.email).toBe(aUsers[0].email);
    })
    .end(done);
  });

  it('should return 401 if invalid token', (done) => {
    request(app)
    .get('/users/me')
    .set('x-auth', 'asdkljfhsdjfhl')
    .expect(401)
    .expect((res) => {
      expect(res.body).toEqual({});
    })
    .end(done);
  });

  it('should return 401 if NO token', (done) => {
    request(app)
    .get('/users/me')
    .expect(401)
    .expect((res) => {
      expect(res.body).toEqual({});
    })
    .end(done);
  });
});

describe('POST /users', () => {
  it('should create a user', (done) => {
    const oUser = {
      email: 'test@fromTest.com',
      password: 'somepassword',
    };
    request(app)
    .post('/users')
    .send(oUser)
    .expect(200)
    .expect((res) => {
      expect(res.header['x-auth']).toBeTruthy();

      User.findById(new ObjectID(res.body._id)).then((user) => {
        expect(user).toBeTruthy();
        expect(user.email).toBe(oUser.email);
        expect(user.password).not.toBe(oUser.password);
      });
    })
    .end(done);
  });

  it('should return validation error if request is Invalid', (done) => {
    const oUser = {
      email: 'asdf',
      password: 'asdf',
    };
    request(app)
    .post('/users')
    .send(oUser)
    .expect(400)
    .expect((res) => {
      expect(res.body).toBeTruthy();
      expect(res.body.errors).toBeTruthy();
    })
    .end(done);
  });

  it('should not create user if email is already in use', (done) => {
    const oUser = _.pick(aUsers[0], ['email', 'password']);
    request(app)
    .post('/users')
    .send(oUser)
    .expect(400)
    .expect((res) => {
      expect(res.body).toBeTruthy();
      expect(res.body.errmsg).toBeTruthy();
    })
    .end(done);
  });
});

describe('POST /users/login', () => {
  it('should provide x-auth token for valid credentials', (done) => {
    const oUser = _.pick(aUsers[1], ['email', 'password']);
    request(app)
    .post('/users/login')
    .send(oUser)
    .expect(200)
    .expect((res) => {
      expect(res.header['x-auth']).toBeTruthy();
    })
    .end((err, res) => {
      if (err) {
        return done(err);
      }
      User.findById(aUsers[1]._id).then((oUser) => {
        expect(oUser.tokens[0]).toMatchObject({
          access: 'auth',
          token: res.header['x-auth'],
        });
        done();
      }).catch((e) => done(e));
    });
  });

  it('should return 400 for invalid credentials', (done) => {
    request(app)
    .post('/users/login')
    .send({email: 'users2@test.com', password: 'someRandonPassword'})
    .expect(400)
    .expect((res) => {
      expect(res.header['x-auth']).toBeFalsy();

      User.findById(aUsers[1]._id).then((oUser) => {
        expect(oUser.tokens.length).toBe(0);
      }).catch((e) => done(e));
    })
    .end(done);
  });
});

describe('DELETE /users/me/token', () => {
  it('should delete token from user', (done) => {
    request(app)
    .delete('/users/me/token')
    .set('x-auth', aUsers[0].tokens[0].token)
    .send()
    .expect(200)
    .expect((res) => {
      expect(res.body).toMatchObject({});
      expect(res.header['x-auth']).toBeFalsy();

      User.findById(aUsers[0]._id).then((oUser) => {
        expect(oUser.tokens.length).toBe(0);
      }).catch((e) => done(e));
    })
    .end(done);
  });
});
