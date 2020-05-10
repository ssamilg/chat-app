const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');
const passportConfig = require('../passport')

const { validateBody, schemas } = require('../helpers/RouteHelpers');
const UserController = require('../controllers/UserController');

const passportLogin = passport.authenticate('local', { session: false });
const passportJwt = passport.authenticate('jwt', { session: false });

router.route('/signUp')
  .post(validateBody(schemas.authSchema), UserController.signUp);

router.route('/login')
  .post(validateBody(schemas.authSchema), passportLogin,  UserController.login);

router.route('/secret')
  .get(passportJwt, UserController.secret);

  module.exports = router;