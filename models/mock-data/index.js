// const config = require('../../config/config');
// const xlsx = require('node-xlsx');
// const bcrypt = require('bcrypt');

const fakeChallengeList = require('./fakeChallengeList.js');
const fakeResults = require('./fakeResults.js');
const fakeSpots = require('./fakeSpots.js');
const fakeUsers = require('./fakeUsers.js');

//the order of columns in execl file is Spot, Name, Instrument, Part, Name.#, Eligible, squadLeader, admin, password
// function getUsersFromExcelFile(filePath) {
//   const path = filePath || config.db.fakeUserDataPath;
//   const parseObj = xlsx.parse(path);
//   const userArr = [];
//   let UserObj = {};
//
//   parseObj[0].data.forEach((e, index) => {
//     //first line of file is column names
//     if (index !== 0) {
//       UserObj = {};
//       UserObj.name = e[1];
//       UserObj.spotId = e[0];
//       UserObj.instrument = e[2];
//       UserObj.part = e[3];
//       UserObj.nameNumber = e[4];
//       UserObj.eligible = e[5];
//       UserObj.squadLeader = e[6];
//       UserObj.admin = e[7];
//       if (UserObj.spotId.match(/[A-Z]+|[1-9]+/g)[1] > 12) {
//         UserObj.alternate = true;
//       } else {
//         UserObj.alternate = false;
//       }
//       UserObj.password = bcrypt.hashSync(e[8], bcrypt.genSaltSync(1)); // eslint-disable-line no-sync
//       userArr.push(UserObj);
//     }
//   });
//   return userArr;
// }
//
// function getSpotsFromExcelFile(filePath) {
//   const path = filePath || config.db.fakeSpotDataPath;
//   const parseObj = xlsx.parse(path);
//   const spotArr = [];
//   let spotObj = {};
//
//   parseObj[0].data.forEach((e, index) => {
//     if (index !== 0) {
//       spotObj = {};
//       spotObj.id = e[0];
//       spotObj.open = e[1];
//       spotObj.challengedAmount = e[2];
//       spotArr.push(spotObj);
//     }
//   });
//   return spotArr;
// }
//
// function getFakeResults(filePath) {
//   const path = filePath || config.db.fakeResultsDataPath;
//   const parseObj = xlsx.parse(path);
//   const resultsArray = [];
//   let resultObj;
//
//   parseObj[0].data.forEach((e, i) => {
//     if (i !== 0) {
//       resultObj = {};
//       resultObj.firstNameNumber = e[0];
//       resultObj.secondNameNumber = e[1];
//       resultObj.PerformanceId = e[2];
//       resultObj.SpotId = e[3];
//       resultObj.winnerId = e[4];
//       resultObj.comments1 = e[5];
//       resultObj.comments2 = e[6];
//       resultObj.pending = false;
//       resultsArray.push(resultObj);
//     }
//   });
//   return resultsArray;
// }
//
// function getMockChallengesList(filePath) {
//   const path = filePath || config.db.fakeChallengeListPath;
//   const parseObj = xlsx.parse(path);
//   const challengeList = [];
//   let challengeObj = {};
//
//   parseObj[0].data.forEach((e) => {
//     challengeObj = {};
//     challengeObj.UserNameNumber = e[1];
//     challengeObj.PerformanceId = 1;
//     challengeObj.SpotId = e[2];
//     challengeList.push(challengeObj);
//   });
//   return challengeList;
// }

module.exports = {
  // getUsersFromExcelFile,
  // getSpotsFromExcelFile,
  // getMockChallengesList,
  // getFakeResults,
  fakeChallengeList,
  fakeResults,
  fakeUsers,
  fakeSpots
};
