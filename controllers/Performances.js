const models = require('../models');
const Performance = new models.Performance();
const Result = new models.Result();

function PerformanceController() {
  this.getResults = (req, res) => {
    Result.findAllForPerformance(req.params.performanceId)
      .then((results) => res.render('resultsForPerformance', { results }))
      .catch((err) => {
        console.error(err);
        res.render('error');
      });
  };

  this.showAll = (req, res) => {
    Performance.findAll('MMMM Do, h:mm:ss a')
      .then((performances) => res.json(performances))
      .catch(() => res.render('error'));
  };
}

module.exports = PerformanceController;
