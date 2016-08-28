const bcrypt = require('bcrypt');

const Models = require('../models');
const { logger } = require('../utils');
const Challenge = new Models.Challenge();
const Manage = new Models.Manage();
const Performance = new Models.Performance();
const Result = new Models.Result();
const Spot = new Models.Spot();
const User = new Models.User();

function UsersController() {
  this.changePassword = (req, res) => {
    const { oldPassword, newPassword } = req.body;

    if (bcrypt.compareSync(oldPassword, req.user.password)) { // eslint-disable-line no-sync
      User.changePassword(req.user.nameNumber, newPassword)
      .then(() => {
        req.user.new = false;
        res.json({ success: true });
      })
      .catch((err) => {
        logger.errorLog('Users.changePassword', err);
        res.json({ success: false, error: true });
      });
    } else {
      res.json({ success: false, error: false });
    }
  };

  this.closeSpot = (req, res) => {
    const { nameNumber, performanceId, spotId } = req.body;
    const manageAttributes = {
      performanceId,
      userNameNumber: nameNumber,
      reason: 'Closed Spot',
      spotId,
      voluntary: false
    };

    Promise.all([Manage.create(manageAttributes), Spot.setOpenClose(spotId, false)])
    .then(() => {
      logger.adminActionLog(`close spot (${spotId}) for ${nameNumber} for performance id: ${performanceId}`);
      res.json({ success: true });
    })
    .catch((err) => {
      logger.errorLog('Users.close', err);
      res.status(500).send();
    });
  };

  this.manage = (req, res) => {
    const { nameNumber, performanceId, reason, spotId, voluntary } = req.body;
    const manageAttributes = {
      performanceId,
      userNameNumber: nameNumber,
      reason,
      spotId,
      voluntary
    };

    //If the manage was voluntarily taken by the user (elected to open spot), they're now eligible to challenge
    Promise.all([Manage.create(manageAttributes), Spot.setOpenClose(spotId, true)])
    .then(() => {
      logger.adminActionLog(`open spot (${spotId}) for ${nameNumber} for performance id: ${performanceId}. reason: ${manageAttributes.reason}`);
      res.json({ success: true });
    })
    .catch((err) => {
      logger.errorLog('Users.manage', err);
      res.status(500).send();
    });
  };

  this.search = (req, res) => {
    User.search(req.query.q)
    .then(users => res.json(users))
    .catch(err => res.status(500).json({ message: err }));
  };

  this.settings = (req, res) => {
    res.render('users/settings', { user: req.user });
  };

  this.show = (req, res) => {
    const performanceId = req.session.currentPerformance && req.session.currentPerformance.id;

    if (req.user.admin) {
      Performance.findNextOrOpenWindow()
      .then((performance) => {
        res.render('users/admin', { user: req.user, performance: Performance.format(performance) });
      })
      .catch((err) => {
        logger.errorLog('Users.show', err);
        res.render('static-pages/error', { user: req.user });
      });
    } else {
      Promise.all([
        Challenge.findForUser(req.user.nameNumber),
        Result.findAllForUser(req.user.nameNumber),
        Performance.findNextOrOpenWindow(),
        User.canChallengeForPerformance(req.user, performanceId)
      ])
        .then(data => {
          const canChallenge = data[3], challenge = data[0], performance = data[2], results = data[1];

          res.render('users/show', {
            canChallenge,
            challenge,
            results,
            performance: Performance.format(performance),
            user: req.user
          });
        })
        .catch((err) => {
          logger.errorLog('Users.show', err);
          res.render('static-pages/error', { user: req.user });
        });
    }
  };

  this.showIndividualManage = (req, res) => {
    Promise.all([User.findForIndividualManage(req.params.nameNumber), Performance.findNextOrOpenWindow()])
    .then((data) => {
      res.render('users/individual-manage', {
        managedUserCurrent: data[0][0],
        managedUserOld: data[0].slice(1),
        performance: data[1],
        user: req.user
      });
    })
    .catch((err) => {
      logger.errorLog('Users.showIndividualManage', err);
      res.render('static-pages/error', { user: req.user });
    });
  };

  this.showManage = (req, res) => {
    res.render('users/manage', { user: req.user });
  };
}

module.exports = UsersController;
