const email = require('../utils').email;
const { logger } = require('../utils');
const models = require('../models');
const Challenge = new models.Challenge();
const Performance = new models.Performance();

function ChallengersController() {
  this.create = (req, res) => {
    const { spotId } = req.body;
    const userId = req.user.nameNumber, performanceId = req.session.currentPerformance.id;

    logger.challengesLog(`${req.user.name} sent request to challenge ${spotId}`);
    return Challenge.create(userId, spotId, performanceId)
      .then((code) => {
        email.sendChallengeSuccessEmail({
          nameNumber: 'tareshawty.3', // TODO: actually email the real person
          performanceName: req.session.currentPerformance.name,
          spotId
        });
        logger.challengesLog(`${req.user.name} successfully challenged for ${spotId}`);
        res.json({ code });
      })
      .catch((err) => {
        logger.errorLog('Challenges.create', err);
        res.status(400).send(err);
      });
  };

  this.new = (req, res) => {
    const performanceId = req.session.currentPerformance && req.session.currentPerformance.id;
    const windowOpen = Performance.inPerformanceWindow(req.session.currentPerformance);

    Challenge.findAllChallengeablePeopleForUser(req.user, performanceId)
    .then((data) =>
      res.render('challenges/new', {
        user: req.user,
        challengeableUsers: windowOpen && data,
        performanceName: req.session.currentPerformance && req.session.currentPerformance.name
      })
    )
    .catch((err) => {
      logger.errorLog('Challenges.new', err);
      res.render('static-pages/error', { user: req.user });
    });
  };
}

module.exports = ChallengersController;
