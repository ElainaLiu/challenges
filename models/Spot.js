const { db } = require('../utils');

const attributes = ['id', 'open', 'challengedCount'];

module.exports = class Spot {

  constructor(id, open, challengedCount) {
    this._id = id;
    this._open = open;
    this._challengedCount = challengedCount;
  }

  static get attributes() {
    return attributes;
  }

  static get idName() {
    return 'id';
  }

  static get tableName() {
    return 'spots';
  }

  // true is open, false is closed
  static setOpenClose(spotId, open) {
    return new Promise((resolve, reject) => {
      const sql = 'UPDATE spots SET open = $1 WHERE id = $2';

      db.query(sql, [open, spotId])
      .then(resolve)
      .catch(reject);
    });
  }

  get id() {
    return this._id;
  }

  get challengedCount() {
    return this._challengedCount;
  }

  get open() {
    return this._open;
  }
};
