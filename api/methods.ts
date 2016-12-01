import * as mongoose from 'mongoose';
import * as passport from 'passport';
import * as User from '../models/User';
import * as jwt from 'jsonwebtoken';
import * as acl from 'acl';
import Permission from '../config/permission';
import * as colors from 'colors';
/*
  TODO set req.user ???
  TODO set req.headers.bearer && check for bearer √
  TODO set req.authorization??
  TODO access control list for user roles √
  - npm i --save acl
  - npm i --save express-session ??
  - https://www.npmjs.com/package/acl
*/

function isAuthenticated (req, res, next) {
  let findToken = req.headers['cookie'].split(' ').filter((v, k) => {
   return v.split('=')[0] === 'token';
  });

  let token = findToken.length >= 1 ? findToken[0].split('=')[1].split(';')[0] : '';
  console.log('verifying token'.yellow);
  return jwt.verify(token, 'SecretKey', (err, user) => {
    if (err) return next(err);
    if (!user) return res.status(401).send({ message: 'Unauthorized'});
    req.headers.bearer = token;
    return next();
  });
}

function checkAcl (req, res, next) {
  let userId = '';
  let method = req.method.toLowerCase();

  //TODO
  //might need hoisted methods to control more specific requests
  //path is only predictable if the name of the resource MATCHES the mongo collection name
  //i.e. the resource

  let path = req._parsedUrl.pathname.split('/')[1];

  let findToken = req.headers['cookie'].split(' ').filter((v, k) => {
   return v.split('=')[0] === 'token';
  });
  let token = findToken.length >= 1 ? findToken[0].split('=')[1].split(';')[0] : '';

  //headers bearer value must be set to token during this req.
  req.headers.bearer = token;

  //TODO this secret should be generated better and placed in .env
  jwt.verify(token, 'SecretKey', (err, user) => {
    //jwt returns a decrypted user
    userId = user.id;

    console.log('\n-==checkAcl and get user with jwt.verification==-\n'.cyan);
    console.log('userId: '.yellow, user.id);
    console.log('username: '.yellow, user.username);

    if (err) return next(err);
    if (!user) return res.status(401).send({ message: 'Unauthorized'});
    console.log(`Checking ${method} method for userId: ${userId} on ${path}`.cyan);

    //Permission check
    Permission.backend.isAllowed(userId, path, method, (err, allowed) => {
      let _color = (allowed ? 'true'.green : 'false'.red);
      console.log(`Allowed = `.cyan + _color);
      if(err) return res.status(401).send({message: 'Permission check failed.'});
      if(!allowed) return res.status(401).send({message: 'Unauthorized request.'})
      if(allowed) return next();
    });
  });
}

const methods = {
  isAuthenticated: isAuthenticated,
  checkAcl: checkAcl
}

export default methods;
