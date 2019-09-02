exports.up = async knex => {
  await knex.schema.createTable('routepath_status', table => {
    table.enu('status', ['READY', 'PENDING', 'EMPTY']);
  });
};

exports.down = async knex => {
  await knex.schema.dropTable('routepath_status');
};
