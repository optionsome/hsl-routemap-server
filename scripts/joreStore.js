const config = require('../knexfile_jore');
// eslint-disable-next-line import/order
const knex = require('knex')(config);
const cleanup = require('./cleanup');

const configI2 = require('../knexfile_jore');
// eslint-disable-next-line import/order
const knexI2 = require('knex')(configI2);

// Must cleanup knex, otherwise the process keeps going.
cleanup(() => {
  knex.destroy();
  knexI2.destroy();
});

async function migrate() {
  return Promise.all([await knex.migrate.latest(), await knexI2.migrate.latest()]);
}

async function generatePoints(date) {
  return Promise.all([
    knex.raw('select * from jore.create_intermediate_points(?,?)', [date, date]),
    knexI2.raw('select * from jore.create_intermediate_points(?,?)', [date, date]),
  ]);
}

module.exports = {
  generatePoints,
  migrate,
};
