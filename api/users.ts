import * as express from 'express';
import * as mongoose from 'mongoose';
import * as passport from 'passport';
import * as jwt from 'jsonwebtoken';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import * as acl from 'acl';
import Permission from '../config/permission';
//TODO method to retrieve user if requested

import User from '../models/User';
let router = express.Router();

router.get('/users/:id', function(req, res, next) {
  User.findOne(req.params._id).select('-passwordHash -salt').then((user) => {
    return res.status(200).send({user: user});
  }).catch((err) => {
    return res.status(404).send({err: 'User not found.'})
  });
});

router.post('/Register', function(req, res, next) {
  let user = new User();
  user.username = req.body.username;
  user.email = req.body.email;
  user.setPassword(req.body.password);
  user.save(function(err, user) {
    if(err) return next(err);
    console.log('-==new User==-');
    console.log(user);
    //add acl role
    Permission.backend.addUserRoles(user._id.toHexString(), 'user');
    res.status(200).send({message: "Registration complete."});
  });
});

router.post('/Login/Local', function(req, res, next) {
  if(!req.body.username || !req.body.password) return res.status(400).send("Please fill out every field");
  passport.authenticate('local', function(err, user, info) {
    console.log('--= Passport Auth =--');
    console.log('err:', err);
    console.log('user:', user);
    console.log('info:', info);
    if(err) return next(err);
    if(user) {
      //TODO setting session here for express
      let token = user.generateJWT();
      console.log('token granted:', token);

      //setting client headers cookie value
      res.cookie('token', token);
      return res.json({ token: token, _id: user._id});
    }
      return res.status(400).send(info);
  })(req, res, next);
});

router.get('/auth/facebook', passport.authenticate('facebook', { scope: [ 'email' ] }));

router.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/#/account' }),
  function(req, res) {
    if(req.isAuthenticated()) {
      let token = { token : req.user.generateJWT() };
      console.log(token.token);
      res.redirect('/#/Token/' + token.token);
    } else {
    	res.send("You are not authenticated.");
    }
  }); // end of facebook cb

export = router;
