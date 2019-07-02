exports.up = async knex => {
  await knex.schema.createTable('routepath_import_config', table => {
    table.string('name').primary();
    table.date('target_date').notNullable();
    table.enu('status', ['READY', 'PENDING', 'ERROR', 'EMPTY']);
    table.timestamps(true, true);
  });

  /* await knex('routepath_import_config').insert({
    name: 'default',
    target_date: knex.raw('NOW()'),
    status: 'READY',
    created_at: 'DEFAULT',
    updated_at: 'DEFAULT',
  }); */
};

exports.down = async knex => {
  await knex.schema.dropTable('routepath_import_config');
};
