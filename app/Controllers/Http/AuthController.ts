import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import { registerSchema } from 'App/Schemas/AuthSchema'

export default class AuthController {
  public async register({ request, response }: HttpContextContract) {
    try {
      const payload = await request.validate(registerSchema)
      const user = await User.create(payload)
      return response.json({ user })
    } catch (error) {
      return response.badRequest({ message: error.messages })
    }
  }
  public async login({ auth, request, response }: HttpContextContract) {
    const email = request.input('email')
    const password = request.input('password')
    try {
      await auth.use('web').attempt(email, password)
      const user = await User.query().where('email', email).preload('role').first()
      return response.json({ login: true, user })
    } catch {
      return response.badRequest({ message: 'Invalid login credentials' })
    }
  }
  public async checkAuth({ auth, response }: HttpContextContract) {
    if (auth.user) {
      const user = await User.query().where('email', auth?.user?.email).preload('role').first()
      return response.json({ login: true, user })
    } else {
      return response.badRequest({ login: false })
    }
  }
  public async logout({ auth, response }: HttpContextContract) {
    await auth.logout()
    return response.json({ message: 'Logout successful' })
  }
}
