exports.up = async knex => {
  const posterType = ['POSTER', 'ROUTEMAP'];

  await knex.schema.table('build', table => {
    table
      .enum('type', posterType)
      .defaultTo('POSTER')
      .notNullable();
  });
};

exports.down = async knex => {
  await knex.schema.table('build', table => {
    table.dropColumn('type');
  });
};
