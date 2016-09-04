const { db } = require('../utils');

const attributes = ['id', 'name', 'openAt', 'closeAt', 'performDate'];

let cachedCurrentPerformance;

class Performance {

  constructor(id, name, openAt, closeAt, performDate) {
    this._id = id;
    this._name = name;
    this._openAt = new Date(openAt);
    this._closeAt = new Date(closeAt);
    this._performDate = new Date(performDate);
  }

  static get Attributes() {
    return attributes;
  }

  static get idName() {
    return 'id';
  }

  static get tableName() {
    return 'performances';
  }

  static create(name, performDate, openAt, closeAt) {
    const sql = 'INSERT INTO performances (name, performDate, openAt, closeAt) VALUES ($1, $2, $3, $4) RETURNING id, closeAt';

    if (
      Number.isNaN(Date.parse(openAt)) ||
      Number.isNaN(Date.parse(closeAt)) ||
      Number.isNaN(Date.parse(performDate))
    ) {
      return Promise.reject();
    } else {
      return db.query(
        sql,
        [name, performDate, openAt, closeAt],
        instanceFromRowPerformanceWithoutId(name, openAt, closeAt, performDate)
      );
    }
  }

  static findAll() {
    const sql = 'SELECT * FROM performances';

    return db.query(sql, [], instanceFromRowPerformance);
  }

  static findCurrent() {
    if (cachedCurrentPerformance && Date.now() < cachedCurrentPerformance.closeAt) {
      return Promise.resolve(cachedCurrentPerformance);
    }
    const sql = 'SELECT * FROM performances WHERE now() < closeAt ORDER BY openAt ASC LIMIT 1';

    return db.query(sql, [], instanceFromRowPerformance)
    .then((currentPerformance) => {
      cachedCurrentPerformance = currentPerformance;
      return currentPerformance;
    });
  }

  get closeAt() {
    return this._closeAt;
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  get openAt() {
    return this._openAt;
  }

  inPerformanceWindow() {
    return this._openAt < Date.now() && Date.now() < this._closeAt;
  }

  toJSON() {
    return {
      closeAt: this._closeAt.toISOString(),
      id: this._id,
      name: this._name,
      openAt: this._openAt.toISOString(),
      performDate: this._performDate.toISOString(),
      windowOpen: this.inPerformanceWindow()
    };
  }

}

const instanceFromRowPerformance = ({ id, name, openat, closeat, performdate }) =>
  new Performance(id, name, openat, closeat, performdate);

const instanceFromRowPerformanceWithoutId = (name, openAt, closeAt, performDate) =>
  ({ id }) => new Performance(id, name, openAt, closeAt, performDate);

module.exports = Performance;
