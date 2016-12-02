import * as mongoose from 'mongoose';
import * as passport from 'passport';
import * as User from '../models/User';
import * as jwt from 'jsonwebtoken';
import * as acl from 'acl';
import Permission from '../config/permission';
import * as colors from 'colors';

/*
  TODO set req.user √
  TODO access control list for user roles √
  - npm i --save acl √
  - https://www.npmjs.com/package/acl
  TODO
  gem install travis -v 1.8.4 --no-rdoc --no-ri √
  or google heroku
  TODO
  npm i --save dotenv @types/dotenv √
*/

function isAuthenticated (req, res, next) {
  console.log('checking authentication'.yellow);
  let token = '';

  if(req.headers['authorization']) {
    token = req.headers.authorization.split('Bearer ')[1];
  }

  if(req.headers['cookie'] && req.headers['cookie'].indexOf('token') > -1) {

    let findToken = req.headers['cookie'].split(' ').filter((v, k) => {
     return v.split('=')[0] === 'token';
    });
    token = findToken.length >= 1 ? findToken[0].split('=')[1].split(';')[0] : '';
  }

  if(token === '') return res.status(204).end();

  return jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return next(err);
    if (!user) return res.status(204).end();
    req.user = user;
    req.headers.authorization = `Bearer ${token}`;
    return next();
  });
}

function checkAcl (req, res, next) {
  console.log('methods.checkAcl - verifying token'.yellow);
  let userId = '';
  let token = '';
  let method = req.method.toLowerCase();
  let path = req._parsedUrl.pathname.split('/')[1];

  //TODO
  //might need hoisted methods to control more specific requests
  //path is only predictable if the name of the resource MATCHES the mongo collection name
  //i.e. the resource

  if(req.headers['authorization']) {
    token = req.headers.authorization.split('Bearer ')[1];
  }

  if(req.headers['cookie']) {
    let findToken = req.headers['cookie'].split(' ').filter((v, k) => {
     return v.split('=')[0] === 'token';
    });
    token = findToken.length >= 1 ? findToken[0].split('=')[1].split(';')[0] : '';
  }

  if(token === '') return res.status(204).send({message: 'No token.'});

  //headers bearer value must be set to token during this req.
  //TODO this secret should be generated better and placed in .env
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return next(err);
    if (!user) return res.status(401).end();
    //jwt returns a decrypted user
    userId = user.id;
    req.user = user;
    req.headers.authorization = `Bearer ${token}`;

    console.log('\n-==checkAcl and get user with jwt.verification==-\n'.cyan);
    console.log('userId: '.yellow, user.id);
    console.log('username: '.yellow, user.username);
    console.log(`Checking ${method} method for userId: ${userId} on ${path}`.cyan);

    //Permission check
    Permission.backend.isAllowed(userId, path, method, (err, allowed) => {
      let _color = (allowed ? 'true'.green : 'false'.red);
      console.log(`Allowed = `.cyan + _color);
      if(err) return res.status(401).end();
      if(!allowed) return res.status(401).end();
      if(allowed) return next();
    });
  });
}

const methods = {
  isAuthenticated: isAuthenticated,
  checkAcl: checkAcl
}

export default methods;
