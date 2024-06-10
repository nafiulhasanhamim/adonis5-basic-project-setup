import { string } from '@ioc:Adonis/Core/Helpers'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import User from './User'

type TokenType = 'PASSWORD_RESET' | 'VERIFY_EMAIL'

export default class Token extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number | null

  @column()
  public type: string

  @column()
  public token: string

  @column()
  public expiresAt: DateTime | null | string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  public static async generateVerifyEmailToken(user: User) {
    const token = string.generateRandom(64)

    await Token.expireTokens(user, 'verifyEmailTokens')
    const record = await user.related('tokens').create({
      type: 'VERIFY_EMAIL',
      expiresAt: DateTime.now().plus({ hours: 24 }).toSQL(),
      token,
    })

    return record.token
  }

  public static async generatePasswordResetToken(user: User | null) {
    const token = string.generateRandom(64)

    if (!user) {
      return token
    }

    await Token.expireTokens(user, 'passwordResetTokens')
    const record = await user.related('tokens').create({
      type: 'PASSWORD_RESET',
      expiresAt: DateTime.now().plus({ hours: 1 }).toSQL({ includeOffset: false }),
      token,
    })

    return record.token
  }

  public static async expireTokens(
    user: User,
    relationName: 'verifyEmailTokens' | 'passwordResetTokens'
  ) {
    await user.related(relationName).query().delete()
  }

  public static async getTokenUser(token: string, type: TokenType) {
    const record = await Token.query()
      .preload('user')
      .where('token', token)
      .where('type', type)
      .where('expires_at', '>', DateTime.now().toSQL())
      .orderBy('createdAt', 'desc')
      .first()

    return record?.user
  }

  public static async verify(token: string, type: TokenType) {
    const record = await Token.query()
      .where('token', token)
      .where('expires_at', '>', DateTime.now().toSQL())
      .where('type', type)
      .first()

    return !!record
  }
}
