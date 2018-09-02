// const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

let data = {
  id: 3,
};
let token = jwt.sign(data, 'secret');
console.log(token);
console.log(jwt.verify(token, 'secret'));

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
