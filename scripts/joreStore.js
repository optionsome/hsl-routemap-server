const config = require('../knexfile_jore');
// eslint-disable-next-line import/order
const knex = require('knex')(config);
const cleanup = require('./cleanup');

// eslint-disable-next-line import/order

// Must cleanup knex, otherwise the process keeps going.
cleanup(() => {
  knex.destroy();
});

async function migrate() {
  return knex.migrate.latest()
}

async function generatePoints(date) {
  return knex.raw('select * from jore.create_intermediate_points(?,?)', [
    date,
    date
  ])
}

module.exports = {
  generatePoints,
  migrate,
};
