import express = require('express');
import mongoose = require('mongoose')
import passport = require('passport');
import jwt = require('jsonwebtoken');
import * as cookieParser from 'cookie-parser';

let User = require('../models/users');
let router = express.Router();

router.get('/:id', function(req, res, next) {
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
    res.send("Registration Complete. Please login.");
  });
});

router.post('/Login/Local', function(req, res, next) {
  if(!req.body.username || !req.body.password) return res.status(400).send("Please fill out every field");
  passport.authenticate('local', function(err, user, info) {
    console.log('--= Passport Auth =--');
    if(err) return next(err);
    if(user) {
      let token = user.generateJWT();
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
    	res.send("You are not authenticated.")
    }
  }); // end of facebook cb

export = router;
