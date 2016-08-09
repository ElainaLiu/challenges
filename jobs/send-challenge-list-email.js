const models = require('../models');
const Challenge = new models.Challenge();
const Manage = new models.Manage();
const { sendChallengeList } = require('../utils').email;
const { logger } = require('../utils');

const filterManageActions = (arr) => {
  const filtered = [];

  for (let i = 0; i < arr.length; i++) {
    const { name, spotid } = arr[i];
    let k = i + 1;

    while (k < arr.length && spotid === arr[k].spotid) {
      k += 1;
    }

    if (spotid === arr[k - 1].spotid && arr[k - 1].reason !== 'Closed Spot') {
      filtered.push({
        name,
        spotid,
        reason: arr[k - 1].reason
      });
    }
    i = k - 1;
  }

  return filtered;
};

const challengesToCSV = (challenges) =>
  challenges.map(({ challengee, challenger, challengeespot, challengerspot, spotopen }) =>
    [challengerspot, challenger, challengeespot, spotopen ? 'Open Spot' : challengee]
  );

const manageActionsTOCSV = (manageActions) =>
  filterManageActions(manageActions).map(({ name, reason, spotid }) =>
    [spotid, name, reason]
  );

const getChallengeCSV = (performanceId) =>
  Promise.all([Challenge.findAllForPerformanceCSV(performanceId), Manage.findAllForPerformanceCSV(performanceId)])
  .then((data) => {
    const challenges = challengesToCSV(data[0]).reduce((prev, curr) => `${prev}\n${curr.toString()}`, '');
    const manageActions = manageActionsTOCSV(data[1]).reduce((prev, curr) => `${prev}\n${curr.toString()}`, '');

    return new Buffer(`OSUMB Challenges\nChallenges\n${challenges}\n\nOpen Spots/Automatic Alternates\n${manageActions}`).toString('base64');
  })
  .then(challengeList => challengeList);

const sendChallengeListEmail = (performanceId) => {
  return getChallengeCSV(performanceId)
  .then(csv => {
    sendChallengeList('atareshawty@gmail.com', csv) // TODO: Actually email to band office
    .then((data) => {
      if (data.statusCode > 300) {
        throw data;
      }
      logger.jobsLog('Send Challenge List Email success', data);
    })
    .catch((err) => {
      logger.errorLog('Jobs.sendChallengeListEmail', err);
    });
  })
  .catch((err) => {
    logger.errorLog('Jobs.sendChallengeListEmail', err);
  });
};

module.exports = {
  filterManageActions,
  sendChallengeListEmail
};
