import jwt from 'jsonwebtoken';
import auth from '../../config/auth';

class TokenController {
  createTokenJwt(id) {
    return jwt.sign({ id }, auth.secret, {
      expiresIn: auth.expiresIn,
    });
  }
}

export default new TokenController();
