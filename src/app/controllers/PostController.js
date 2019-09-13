import Post from '../models/Post';
import User from '../models/User';
import File from '../models/File';

class PostController {
  async index(req, res) {
    const posts = await Post.findAll({
      attributes: ['id', 'title', 'content', 'createdAt', 'updatedAt'],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'lastname', 'email'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['name', 'path', 'url'],
            },
          ],
        },
      ],
    });

    return res.json({
      posts,
    });
  }

  async store(req, res) {
    const { title, content } = req.body;

    const post = await Post.create({
      title,
      content,
      user_id: req.userId,
    });

    const {
      id, title: titlePost, content: contentPost, updatedAt, createdAt,
    } = post;

    const user = await User.findOne({
      where: {
        id: req.userId,
      },
      attributes: ['id', 'name', 'lastname', 'email', 'avatar_id'],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['name', 'path', 'url'],
        },
      ],
    });

    return res.json({
      id,
      titlePost,
      contentPost,
      user,
      updatedAt,
      createdAt,
    });
  }
}

export default new PostController();
