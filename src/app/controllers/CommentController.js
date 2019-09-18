import CommentValidations from '../validators/Comment';
import Comment from '../models/Comment';
import User from '../models/User';
import Post from '../models/Post';
import Notification from '../schemas/Notification';

class CommentController {
  async store(req, res) {
    CommentValidations.index(req, res);

    const { content } = req.body;

    const comment = await Comment.create({
      content,
      user_id: req.userId,
      post_id: req.params.id,
    });

    const cmt = await Comment.findOne({
      where: {
        id: comment.id,
      },
      attributes: ['id', 'content', 'createdAt', 'updatedAt'],
      include: [
        {
          model: Post,
          as: 'post',
          attributes: ['id', 'title', 'content', 'createdAt', 'updatedAt'],
          include: [
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
        },
      ],
    });

    const userPost = await Post.findOne({
      where: { id: req.params.id },
    });

    // Notificar o comentário
    await Notification.create({
      content: `Sua publicação ${userPost.title} recebeu um novo comentário.`,
      user: userPost.user_id,
    });

    return res.status(200).json(cmt);
  }

  async update(req, res) {
    CommentValidations.index(req, res);

    const post = await Post.findByPk(req.params.id);

    const comt = await Comment.findByPk(req.params.comment);

    if (!post) {
      return res.status(400).json({
        error: 'Post already exists.',
      });
    }

    if (!comt) {
      return res.status(400).json({
        error: 'Comment already exists.',
      });
    }

    await comt.update(req.body);

    const comment = await Comment.findOne({
      where: {
        id: comt.id,
      },
      attributes: ['id', 'content', 'createdAt', 'updatedAt'],
      include: [
        {
          model: Post,
          as: 'post',
          attributes: ['id', 'title', 'content', 'createdAt', 'updatedAt'],
          include: [
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
        },
      ],
    });

    return res.json(comment);
  }
}

export default new CommentController();
