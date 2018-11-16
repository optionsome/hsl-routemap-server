if (!process.env.PG_JORE_CONNECTION_STRING_i2) {
  throw new Error('PG_JORE_CONNECTION_STRING_i2 variable is not set');
}

module.exports = {
  client: 'pg',
  connection: process.env.PG_JORE_CONNECTION_STRING_i2,
};
