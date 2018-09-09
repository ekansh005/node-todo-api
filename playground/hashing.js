// const {SHA256} = require('crypto-js');
// const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const password = 'abc123';
// bcrypt.genSalt(10, (err, salt) => {
//   console.log(`salt : ${salt}`);
//   bcrypt.hash(password, salt, (err, hash) => {
//     console.log(hash);
//   });
// });

const hashed = '$2a$10$B9/OK1jjTFnTLvh69.bq5u1H6X8uKJVK4FEvsZ6uTVSCiG6HKmJQa';
bcrypt.compare(password, hashed, (err, result) => {
  console.log(result);
});
// let data = {
//   id: 3,
// };
// let token = jwt.sign(data, 'secret');
// console.log(token);
// console.log(jwt.verify(token, 'secret'));

// let data = {
//   id: 3,
// };
// let response = {
//   data,
//   hash: SHA256(JSON.stringify(data) + 'secret').toString(),
// };
//
// response.data.id = 4;
// response.hash = SHA256(JSON.stringify(data)).toString();
//
// let checkHash = SHA256(JSON.stringify(data) + 'secret').toString();
//
// checkHash === response.hash ? console.log('matched') :
// console.log('not matched');
