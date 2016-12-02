import express = require('express');
import * as mongoose from 'mongoose';
import * as passport from 'passport';
import * as jwt from 'jsonwebtoken';
import * as session from 'express-session';
import * as acl from 'acl';
import Permission from '../config/permission';
import methods from './methods';
import User from '../models/User';
let router = express.Router();

router.get('/users/:id', function(req, res, next) {
  User.findOne(req.params._id).select('-passwordHash -salt').then((user) => {
    return res.status(200).send({"user": user});
  }).catch((err) => {
    return res.status(404).send({err: 'User not found.'})
  });
});

router.get('/currentuser', methods.isAuthenticated, function(req, res, next) {
  User.findOne({_id: req.user._id}).select('-passwordHash -salt').then((user) => {
    return res.send({"user": user});
  }).catch((err) =>{
    return res.status(100).send({"message": `Unauthorized`, err: err})
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
    console.log(user.username);
    //add acl role
    Permission.backend.addUserRoles(user._id.toHexString(), 'user');
    res.status(200).send({message: "Registration complete."});
  });
});

router.post('/Login/Local', function(req, res, next) {
  if(!req.body.username || !req.body.password) return res.status(400).send("Please fill out every field");
  passport.authenticate('local', function(err, user, info) {
    console.log('--= Passport Auth =--');
    if(err) return next(err);
    if(user) {
      let token = user.generateJWT();

      //set cookie for token
      req.session.regenerate(function(err) {
        console.log('testing for unexp server cookie');
      });

      req.session.save(function(err) {
        console.log('session saved');
        console.log('session err:', err);
      });
      
      console.log('token granted for: ', user.username);
      return res.json({ token: token, _id: user._id});
    }
      return res.status(400).send(info);
  })(req, res, next);
});

router.get('/Logout/Local', function(req, res, next) {
  req.logout();

  req.session.destroy((err) => {
    if (err) return res.status(500).send({message: 'still authenticated, please try again.'});
    req.user = null;
    return res.redirect('/');
  });
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
