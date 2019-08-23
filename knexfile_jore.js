const { PG_JORE_CONNECTION_STRING } = require('./constants');

if (!PG_JORE_CONNECTION_STRING) {
  throw new Error('PG_JORE_CONNECTION_STRING variable is not set');
}

module.exports = {
  client: 'pg',
  connection: PG_JORE_CONNECTION_STRING,
};
