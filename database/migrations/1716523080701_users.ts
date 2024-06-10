import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import Roles from 'App/Enum/Roles'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('first_name', 255).notNullable()
      table.string('last_name', 255).notNullable()
      table.string('email', 255).notNullable().unique()
      table.string('password', 180).notNullable()
      table.integer('role_id').unsigned().references('id').inTable('roles').defaultTo(Roles.USER)
      table.boolean('is_email_verified').notNullable().defaultTo(false)
      table.boolean('is_suspended').notNullable().defaultTo(false)
      table.string('remember_me_token').nullable()

      /**
       * Uses timestampz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at').defaultTo(this.now()) // without defaultTo is the same as timestamps()
      table.timestamp('updated_at')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
