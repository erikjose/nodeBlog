import ValidationsPost from '../validators/Post';
import Post from '../models/Post';
import User from '../models/User';
import File from '../models/File';
import Comment from '../models/Comment';

class PostController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const posts = await Post.findAll({
      attributes: ['id', 'title', 'content', 'createdAt', 'updatedAt', 'user_id'],
      order: ['id'],
      limit: 20,
      offset: (page - 1) * 20,
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
        {
          model: Comment,
          as: 'comments',
          attributes: ['id', 'content', 'createdAt', 'updatedAt'],
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'name', 'lastname', 'email'],
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
    ValidationsPost.index(req, res);

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

  async update(req, res) {
    ValidationsPost.index(req, res);

    const post = await Post.findByPk(req.params.id);

    if (!post) {
      return res.status(400).json({
        error: 'Post already exists.',
      });
    }

    if (post.user_id !== req.userId) {
      return res.status(404).json({
        error: 'This post does not belong to this user.',
      });
    }

    const {
      id, title, content, createdAt, updatedAt,
    } = await post.update(req.body);

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
      title,
      content,
      user,
      updatedAt,
      createdAt,
    });
  }

  async delete(req, res) {
    const post = await Post.findByPk(req.params.id);
    if (post.user_id !== req.userId) {
      return res.status(404).json({
        error: 'This post does not belong to this user.',
      });
    }
    if (!post) {
      return res.status(400).json({
        error: 'Post already exists.',
      });
    }
    post.destroy();
    return res.status(200).json({
      message: 'Post has been deleted',
    });
  }
}

export default new PostController();
