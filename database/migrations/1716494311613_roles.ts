import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import Roles from 'App/Enum/Roles'

export default class extends BaseSchema {
  protected tableName = 'roles'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name', 50).notNullable()
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at').defaultTo(this.now()) // without defaultTo is the same as timestamps()
      table.timestamp('updated_at')
    })

    this.defer(async (db) => {
      await db.table(this.tableName).multiInsert([
        {
          id: Roles.ADMIN,
          name: 'Admin',
        },
        {
          id: Roles.USER,
          name: 'User',
        },
      ])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
