import Like from '../models/Like';
import Post from '../models/Post';
import User from '../models/User';
import Notification from '../schemas/Notification';

class LikeController {
  async store(req, res) {
    const { like } = req.body;

    const post = await Post.findByPk(req.params.id);

    if (!post) {
      return res.status(400).json({
        error: 'Post already exists.',
      });
    }

    if (post.user_id !== req.userId) {
      return res.status(400).json({
        error: 'You are not the comment author.',
      });
    }

    const likeStore = await Like.create({
      like,
      user_id: req.userId,
      post_id: req.params.id,
    });

    const user = await User.findOne({
      where: { id: req.userId },
    });

    // Notificar o comentário
    await Notification.create({
      content: `${user.name} curtiu sua publicação.`,
      user: post.user_id,
    });

    return res.status(200).json(likeStore);
  }

  async delete(req, res) {}
}

export default new LikeController();