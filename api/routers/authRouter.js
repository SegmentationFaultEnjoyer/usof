const { Router } = require('express');

const authRouter = Router();

const AuthController = require('../controllers/AuthController');

authRouter.get('/', AuthController.CheckAuth, AuthController.GetUserInfo);

authRouter.get('/logout', AuthController.CheckAuth, AuthController.LogOut);

authRouter.post('/login', AuthController.LogIn);

authRouter.post('/refresh', AuthController.Refresh);

authRouter.post('/register', AuthController.Register);

authRouter.route('/reset-password/:user_id/:token')
    .get(AuthController.GetResetForm)
    .post(AuthController.ChangePassword)

authRouter.post('/reset-password', AuthController.ResetPassword);

module.exports = authRouter;