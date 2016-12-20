const logger = require('../../utils/logger');
const Result = require('../models/result-model');

class ResultsController {

  static approve(req, res, next) {
    const { ids } = req.body;

    Result.approve(ids)
    .then(([performanceId]) => {
      res.locals.jsonResp = { success: true };
      Result.checkAllDoneForPerformance(performanceId)
      .then(([done]) => {
        if (done) {
          logger.actionLog(`Starting to switch spots for performance ${performanceId}`);
          Result.switchSpotsForPerformance(performanceId)
          .then(() => logger.actionLog(`Done switching spots for performance ${performanceId}`))
          .catch((err) => logger.errorLog('Result.switchSpotsForPerformance', err));
        }
      })
      .catch((err) => {
        logger.errorLog('Results.approve: Result.checkAllDoneForPerformance', err);
      });
      next();
    })
    .catch((err) => {
      logger.errorLog('Results.approve: Result.approve', err);
      res.json({ success: false });
    });
  }

  static evaluate(req, res, next) {
    Result.update({
      id: req.body.id,
      needsApproval: true,
      firstComments: req.body.firstComments,
      secondComments: req.body.secondComments || '',
      winnerId: req.body.winnerId
    })
    .then(() => {
      logger.actionLog(`${req.user.name} evaulated result ${req.body.id}. ${req.body.winnerId} won`);
      res.locals.jsonResp = { success: true };
      next();
    })
    .catch((err) => {
      logger.errorLog('Results.evaluate', err);
      res.status(500).send({ success: false });
    });
  }

  static getForApproval(req, res, next) {
    Result.findAllForApproval(req.user)
    .then((results) => {
      res.locals.jsonResp = { results: results.map((result) => result.toJSON()) };
      next();
    })
    .catch((err) => {
      logger.errorLog('Results.getForApproval', err);
      res.status(500).send();
    });
  }

  static getForEvaluation(req, res, next) {
    return Result.findAllForEval(req.user.nameNumber)
      .then((results) => {
        res.locals.jsonResp = { results: results.map((result) => result.toJSON()) };
        next();
      })
      .catch((err) => {
        logger.errorLog('Results.showForEvaluation', err);
        res.status(500).send();
      });
  }

  static index(req, res, next) {
    Result.index()
    .then((performanceResultsMap) => {
      res.locals.jsonResp = { performanceResultsMap };
      next();
    })
    .catch((err) => {
      logger.errorLog('Results.index', err);
      res.render('static-pages/error', { user: req.user });
    });
  }

}

module.exports = ResultsController;
