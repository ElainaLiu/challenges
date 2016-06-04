const path = require('path');
const moment = require('moment');

module.exports = {
  db: {
    postgres: process.env.DATABASE_URL || 'postgres://localhost:5432/challenges_dev',
    userDataPath: path.join(__dirname, '../models/mock-data/UserData.xlsx'),
    fakeUserDataPath: path.join(__dirname, '../models/mock-data/FakeUsers.xlsx'),
    fakeSpotDataPath: path.join(__dirname, '../models/mock-data/Spots.xlsx'),
    fakeChallengeListPath: path.join(__dirname, '../models/mock-data/MockChallengeList.xlsx'),
    fakeNoConflictChallengeListPath: path.join(__dirname, '../models/mock-data/NoConflictChallenges.xlsx'),
    fakeSpotFullChallengeListPath: path.join(__dirname, '../models/mock-data/SpotFullChallenges.xlsx'),
    wrongPersonChallengeListPath: path.join(__dirname, '../models/mock-data/WrongPersonChallenges.xlsx'),
    fakeResultsDataPath: path.join(__dirname, '../models/mock-data/Results.xlsx')
  },
  passport: {
    secret: process.env.PASSPORT_SECRET || 'keyboard cat'
  },
  server: {
    port: process.env.PORT || 3000
  },
  test: {
    mockPerformances: [
      { name: 'Bowling Green Game', openAt: moment().startOf('day').add().format('YYYY-MM-DD HH:mm:ss'), closeAt: moment().startOf('day').add({ days: 1, hours: 3 }).format('YYYY-MM-DD HH:mm:ss') },
      { name: 'Buckeye Invite', openAt: moment().startOf('month').add().format('YYYY-MM-DD HH:mm:ss'), closeAt: moment().startOf('month').add({ days: 1, hours: 3 }).format('YYYY-MM-DD HH:mm:ss') }
    ]
  }
};
