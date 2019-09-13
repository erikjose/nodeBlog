import ValidationsUser from '../validators/User';
import Token from './TokenController';
import User from '../models/User';
import File from '../models/File';

class UserController {
  async index(req, res) {
    const user = await User.findOne({
      where: { id: req.params.id },
      attributes: ['id', 'name', 'lastname', 'email', 'avatar_id'],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['name', 'path', 'url'],
        },
      ],
    });

    return res.json(user);
  }

  async store(req, res) {
    ValidationsUser.createUser(req, res);

    const userExists = await User.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (userExists) {
      return res.status(400).json({
        error: 'Email already exists.',
      });
    }

    const {
      id, email, name, lastname, createdAt, updatedAt,
    } = await User.create(req.body);

    return res.json({
      id,
      name,
      lastname,
      email,
      token: Token.createTokenJwt(id),
      createdAt,
      updatedAt,
    });
  }

  async update(req, res) {
    ValidationsUser.updateUser(req, res);

    const { email, oldPassword } = req.body;
    // User no banco
    const user = await User.findByPk(req.userId);

    if (email !== user.email) {
      const userExists = await User.findOne({
        where: {
          email,
        },
      });

      if (userExists) {
        return res.status(400).json({
          error: 'User already exists.',
        });
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({
        error: 'Password does not match',
      });
    }

    const {
      id, name, lastname, createdAt, updatedAt,
    } = await user.update(req.body);

    return res.json({
      id,
      name,
      lastname,
      email,
      token: Token.createTokenJwt(id),
      createdAt,
      updatedAt,
    });
  }
}

export default new UserController();
