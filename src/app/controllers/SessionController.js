import SessionValidators from '../validators/Session';
import Token from './TokenController';
import User from '../models/User';

class SessionController {
  async store(req, res) {
    SessionValidators.create(req, res);

    const { email, password } = req.body;

    const user = await User.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(401).json({
        error: 'User not found',
      });
    }

    if (!(await user.checkPassword(password))) {
      return res.status(401).json({
        error: 'Password does not match',
      });
    }

    const { id, name } = user;

    return res.json({
      user: {
        id,
        name,
        email,
      },
      token: Token.createTokenJwt(id),
    });
  }
}

export default new SessionController();
