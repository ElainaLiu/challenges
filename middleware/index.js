const moment = require('moment');

const Models = require('../models');
const Performance = new Models.Performance();

function currentPerformanceWithinTimeFrame(performance) {
  const now = new Date().toJSON();

  return moment(performance.closeAt).add({ days: 1 }).isBefore(moment(now));
}

const currentPerformance = (req, res, next) => {
  Performance.findCurrent()
  .then((performance) => {
    const now = moment(), { openat, closeat } = performance;

    if (moment(openat).isBefore(now) && now.isBefore(moment(closeat))) {
      req.session.currentPerformance = performance;
    }
    next();
  })
  .catch((err) => {
    console.error('Current Performance Middleware', err);
    next();
  });
};

/* eslint-disable consistent-return */
const refreshCurrentPerformance = (req, res, next) => {
  if (
    req.session &&
    req.session.currentPerformance &&
    !currentPerformanceWithinTimeFrame(req.session.currentPerformance)
  ) {
    Performance.findCurrent()
    .then((performance) => {
      req.session.currentPerformance = performance;
      next();
    })
    .catch((err) => {
      console.error('Refresh Current Performance Error', err);
    });
  } else {
    return next();
  }
};

module.exports = {
  currentPerformance,
  refreshCurrentPerformance
};
