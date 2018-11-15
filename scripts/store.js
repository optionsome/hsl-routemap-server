const uuidv1 = require('uuid/v1');
const camelCase = require('lodash/camelCase');
const snakeCase = require('lodash/snakeCase');
const config = require('../knexfile');
const knex = require('knex')(config);

function convertKeys(object, converter) {
  const obj = {};
  Object.keys(object).forEach(key => {
    obj[converter(key)] = object[key];
  });
  return obj;
}

async function migrate() {
  await knex.migrate.latest();
}

async function getBuilds() {
  const rows = await knex
    .select(
      'build.*',
      knex.raw("count(case when poster.status = 'PENDING' then 1 end)::integer as pending"),
      knex.raw("count(case when poster.status = 'FAILED' then 1 end)::integer as failed"),
      knex.raw("count(case when poster.status = 'READY' then 1 end)::integer as ready"),
    )
    .from('build')
    .whereNot('build.status', 'REMOVED')
    .leftJoin('poster', 'build.id', 'poster.build_id')
    .orderBy('build.created_at', 'desc')
    .groupBy('build.id');

  return rows.map(row => convertKeys(row, camelCase));
}

async function getBuild({ id }) {
  const buildRow = await knex
    .select('*')
    .from('build')
    .whereNot('build.status', 'REMOVED')
    .andWhere('build.id', id)
    .first();

  if (!buildRow) {
    const error = new Error(`Build ${id} not found`);
    error.status = 404;
    throw error;
  }

  const posterRows = await knex
    .select(
      'poster.id',
      'poster.status',
      'poster.component',
      'poster.props',
      'poster.created_at',
      'poster.updated_at',
      knex.raw(`json_agg(
                json_build_object(
                    'type', event.type,
                    'message', event.message,
                    'createdAt', event.created_at
                ) order by event.created_at
            ) as events`),
    )
    .from('poster')
    .whereNot('poster.status', 'REMOVED')
    .andWhere('poster.build_id', id)
    .leftJoin('event', 'event.poster_id', 'poster.id')
    .groupBy('poster.id');

  const build = convertKeys(buildRow, camelCase);
  const posters = posterRows.map(row => convertKeys(row, camelCase));
  return Object.assign({}, build, { posters });
}

async function addBuild({ title }) {
  const id = uuidv1();
  await knex('build').insert({ id, title });
  return { id };
}

async function updateBuild({ id, status }) {
  await knex('build')
    .where({ id })
    .update({ status });
  return { id };
}

async function removeBuild({ id }) {
  await knex('build')
    .where({ id })
    .update({ status: 'REMOVED' });
  return { id };
}

async function getPoster({ id }) {
  const row = await knex
    .select('*')
    .from('poster')
    .whereNot('poster.status', 'REMOVED')
    .andWhere('poster.id', id)
    .first();

  if (!row) {
    const error = new Error(`Poster ${id} not found`);
    error.status = 404;
    throw error;
  }
  return convertKeys(row, camelCase);
}

async function addPoster({ buildId, component, props }) {
  const id = uuidv1();
  await knex('poster').insert(
    convertKeys(
      {
        id,
        buildId,
        component,
        props,
      },
      snakeCase,
    ),
  );
  return { id };
}

async function updatePoster({ id, status }) {
  await knex('poster')
    .where({ id })
    .update({ status });
  return { id };
}

async function removePoster({ id }) {
  await knex('poster')
    .where({ id })
    .update({ status: 'REMOVED' });
  return { id };
}

async function addEvent({ posterId = null, buildId = null, type, message }) {
  await knex('event').insert(
    convertKeys(
      {
        posterId,
        buildId,
        type,
        message,
      },
      snakeCase,
    ),
  );
}

async function getConfig() {
  const configs = await knex('routepath_import_config')
    .select('*')
    .where({ name: 'default' });
  if (configs.length === 1) {
    return configs[0];
  }
  return null;
}

async function setDateConfig(date) {
  const oldConfig = await getConfig();
  if (oldConfig) {
    await knex('routepath_import_config')
      .where({ name: 'default' })
      .update({ target_date: date });
  } else {
    await knex('routepath_import_config').insert({
      name: 'default',
      status: 'EMPTY',
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
  migrate,
  getBuilds,
  getBuild,
  addBuild,
  updateBuild,
  removeBuild,
  getPoster,
  addPoster,
  updatePoster,
  removePoster,
  addEvent,
  setDateConfig,
  setStatusConfig,
  getConfig,
};
