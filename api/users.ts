import express = require('express');
import mongoose = require('mongoose')
import passport = require('passport');
import jwt = require('jsonwebtoken');
import * as cookieParser from 'cookie-parser';

let User = require('../models/users');
let router = express.Router();

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
    console.log(user);
    if(err) return next(err);
    if(user) {
      let token = user.generateJWT();
      // cookieParser
      console.log(cookieParser);
      return res.json({ token: token });
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
