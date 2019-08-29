const knexConfig = require('../knexfile_jore');
// eslint-disable-next-line import/order
const knex = require('knex')(knexConfig);
const cleanup = require('./cleanup');

// Must cleanup knex, otherwise the process keeps going.
cleanup(() => {
  knex.destroy();
});

async function migrate() {
  return knex.migrate.latest();
}

async function generatePoints(date) {
  return knex.raw('select * from jorestatic.run_intermediate_points(?)', [date]);
}

async function getConfig() {
  const config = await knex
    .withSchema('jorestatic')
    .first('*')
    .from('status');

  return config || null;
}

module.exports = {
  generatePoints,
  migrate,
  getConfig,
};
