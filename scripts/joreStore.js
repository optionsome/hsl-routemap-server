const config = require('../knexfile_jore');
// eslint-disable-next-line import/order
const knex = require('knex')(config);
const cleanup = require('./cleanup');

// Must cleanup knex, otherwise the process keeps going.
cleanup(() => {
  knex.destroy();
});

async function generatePoints(date) {
  return knex.raw('select * from jorestatic.create_intermediate_points(?)', [date]);
}

async function getPointGenerationDate() {
  return knex.raw('select tag from jorestatic.intermediate_points order by tag desc limit 1');
}
module.exports = {
  generatePoints,
  getPointGenerationDate
};
