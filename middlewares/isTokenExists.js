const { AuthService } = require('../service');

module.exports = async (req, res, next) => {
  const { body, headers, cookies } = req;
  const token = cookies.token || headers['authorization'] || headers['x-access-token'] || body.token;
  const refreshToken = cookies.refreshToken;
  if (token) {
    try {
      await AuthService.verifyToken(token);
      next();
    } catch (e) {
      if (e.name === 'TokenExpiredError' && refreshToken) {
        const decoded = await AuthService.verifyRefreshToken(refreshToken);
        const token = await AuthService.refreshToken(decoded);
        res.cookie('token', token);
        return next();
      }
      console.error(e);
      next(e)
    }
  } else {
    return next({
      status: 404,
      message: 'No token provided.'
    });
  }
}