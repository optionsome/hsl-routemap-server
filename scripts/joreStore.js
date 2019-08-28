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
  return knex.raw('select * from jore.create_intermediate_points(?,?)', [date, date]);
}

async function getConfig() {
  const config = await knex.raw('select * from jore.create_intermediate_points(?,?)', []);
  return config || null;
}

async function setDateConfig(date) {
  const oldConfig = await getConfig();
  if (oldConfig) {
    await knex('routepath_import_config')
      .where({ name: 'default' })
      .update({
        target_date: date,
        status: 'PENDING',
      });
  } else {
    await knex('routepath_import_config').insert({
      name: 'default',
      status: 'PENDING',
      target_date: date,
    });
  }
  return getConfig();
}

async function setStatusConfig(status) {
  const oldConfig = await getConfig();
  if (oldConfig) {
    await knex('routepath_import_config')
      .where({ name: 'default' })
      .update({ status });
  } else {
    await knex('routepath_import_config').insert({ status, name: 'default' });
  }
  return getConfig();
}

module.exports = {
  generatePoints,
  migrate,
  setDateConfig,
  setStatusConfig,
  getConfig,
};
