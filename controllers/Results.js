const models = require('../models');
const Result = new models.Result();

function ResultsController() {
  this.approve = (req, res) => {
    const { ids } = req.body;

    Result.approve(ids)
    .then(() => res.json({ message: 'success!' }))
    .catch((err) => {
      console.error(err);
      res.json({ err });
    });
  };

  this.getForApproval = (req, res) => {
    Result.findAllForApproval()
    .then((results) => {
      res.render('resultsApprove', { user: req.user, currentPerformance: req.session.currentPerformance, results });
    })
    .catch((err) => {
      console.error(err);
      res.render('static-pages/error');
    });
  };

  this.evaluate = (req, res) => {
    Result.update({
      id: req.params.resultId,
      needsApproval: true,
      firstComments: req.body.firstComments,
      secondComments: req.body.secondComments,
      spotId: req.body.spotId,
      winnerId: req.body.winner
    })
    .then(() =>
      res.redirect('results/show-for-evaluation')
    )
    .catch((err) => {
      console.error(err);
      res.render('static-pages/error');
    });
  };

  this.showForEvaluation = (req, res) => {
    Result.findAllForEval(req.user.instrument, req.user.part, req.session.currentPerformance.id, req.user.nameNumber)
      .then((results) => {
        if (results.length === 0) {
          results = null; // eslint-disable-line no-param-reassign
        }

        res.render('results/show-for-evaluation', { user: req.user, results });
      })
      .catch((err) => {
        console.error(err);
        res.render('static-pages/error');
      });
  };

  this.showAll = (req, res) => {
    Result.findAllForPerformance(req.params.performanceId)
    .then(results => res.render('results/show', { user: req.user, results }))
    .catch(err => {
      console.error(err);
      res.render('static-pages/error', { user: req.user });
    });
  };
}

module.exports = ResultsController;
