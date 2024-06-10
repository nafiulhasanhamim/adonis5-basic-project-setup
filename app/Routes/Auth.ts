import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('/register', 'AuthController.register')
  Route.post('/login', 'AuthController.login')
  Route.get('/check', 'AuthController.checkAuth')
  Route.post('/logout', 'AuthController.logout')
}).prefix('/api/auth')
