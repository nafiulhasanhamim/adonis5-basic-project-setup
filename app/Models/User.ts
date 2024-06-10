import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import {
  column,
  beforeSave,
  BaseModel,
  belongsTo,
  BelongsTo,
  hasMany,
  HasMany,
} from '@ioc:Adonis/Lucid/Orm'
import Role from './Role'
import Token from './Token'
import { search } from 'adosearch'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public firstName: string

  @column()
  public lastName: string
  
  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public rememberMeToken: string | null

  @column()
  public roleId: number

  @column()
  public isEmailVerified: boolean

  @column()
  public isSuspended: boolean

  @belongsTo(() => Role)
  public role: BelongsTo<typeof Role>

  @hasMany(() => Token)
  public tokens: HasMany<typeof Token>

  @hasMany(() => Token, {
    onQuery: (query) => query.where('type', 'PASSWORD_RESET'),
  })
  public passwordResetTokens: HasMany<typeof Token>

  @hasMany(() => Token, {
    onQuery: (query) => query.where('type', 'VERIFY_EMAIL'),
  })
  public verifyEmailTokens: HasMany<typeof Token>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  public static search = search(this, ['firstName', 'lastName', 'email'])
}
