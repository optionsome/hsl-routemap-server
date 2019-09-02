const { getRoutePathStatus, initRoutePathStatus, setRoutePathStatus } = require('./store');

const knexConfig = require('../knexfile_jore');
// eslint-disable-next-line import/order
const knex = require('knex')(knexConfig);
const cleanup = require('./cleanup');

// Must cleanup knex, otherwise the process keeps going.
cleanup(() => {
  knex.destroy();
});

async function getPointsDate() {
  const { tag = '' } = await knex
    .withSchema('jorestatic')
    .first('tag')
    .from('intermediate_points');

  return tag;
}

async function getRealRoutePathStatus() {
  let routePathStatus = await getRoutePathStatus();
  const configDate = await getPointsDate();

  if (!routePathStatus) {
    routePathStatus = configDate ? 'READY' : 'EMPTY';
    await initRoutePathStatus(routePathStatus);
  }

  if (configDate && routePathStatus !== 'READY') {
    routePathStatus = await setRoutePathStatus('READY');
  }

  return routePathStatus;
}

async function getConfig() {
  const configDate = await getPointsDate();
  const routePathStatus = await getRealRoutePathStatus();

  return { target_date: configDate || '', status: routePathStatus };
}

async function generatePoints(date) {
  const currentStatus = await getRoutePathStatus();

  if (currentStatus === 'PENDING') {
    console.log('Routepath already in progress.');
    return false;
  }

  await setRoutePathStatus('PENDING');
  await knex.raw('SELECT * FROM jorestatic.create_intermediate_points(?)', [date]);
  await setRoutePathStatus('READY');

  return getRoutePathStatus();
}

module.exports = {
  generatePoints,
  getConfig,
};
