const express = require('express');
const router = express.Router();
const ensureAuthenticated = require('../auth').ensureAuthenticated;
const ensureAdmin = require('../auth').ensureAdmin;
const ensureAuthAndNameNumberRoute = require('../auth').ensureAuthAndNameNumberRoute;
const passport = require('../auth').passport;

router.setup = function(app, controllers) {
  //Static Pages Controllers
  app.get('/', controllers.staticPages.home);
  app.get('/noAuth', controllers.staticPages.noAuth);

  //Performance Controller
  app.get('/performances', ensureAuthenticated, controllers.performance.showAll);

  //Sessions Controller
  app.get('/login', controllers.sessions.login);
  app.post('/login', passport.authenticate('local', {failureRedirect: '/login?auth=false'}), controllers.sessions.redirect);
  //Users Controller
  app.get('/users', ensureAdmin, controllers.users.showAll);
  app.get('/:nameNumber', ensureAuthAndNameNumberRoute, controllers.users.showProfile);

};

module.exports = router;
