var mongoose = require('mongoose');
var passport = require('passport');
var jwt = require('jsonwebtoken');
var User = require('../models/users');

/*
  TODO set req.user
  TODO set req.headers.bearer && check for bearer
  TODO set req.authorization
*/
function isAuthenticated (req, res, next) {
  let findToken = req.headers['cookie'].split(' ').filter((v, k) => {
   return v.split('=')[0] === 'token';
  });

  let token = findToken.length >= 1 ? findToken[0].split('=')[1].split(';')[0] : '';

  return jwt.verify(token, 'SecretKey', (err, user) => {
    if (err) return next(err);
    if (!user) return res.sendStatus('401', { message: 'Unauthorized'});
    return next();
  });
}

export = {
  isAuthenticated: isAuthenticated
};
