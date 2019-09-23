import Like from '../models/Like';
import Post from '../models/Post';
import User from '../models/User';
import Notification from '../schemas/Notification';

class LikeController {
  async store(req, res) {
    const { like } = req.body;

    const verifyLike = await Like.findOne({
      where: { user_id: req.userId, post_id: req.params.id },
    });

    if (verifyLike !== null) {
      return res.status(400).json({
        error: 'Have you enjoyed the post.',
      });
    }

    const post = await Post.findByPk(req.params.id);

    if (!post) {
      return res.status(400).json({
        error: 'Post already exists.',
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
      content: `${user.name} curtiu sua publicação ${post.title}.`,
      user: post.user_id,
    });

    return res.status(200).json(likeStore);
  }

  async delete(req, res) {
    const like = await Like.findOne({
      where: { user_id: req.userId, post_id: req.params.id },
    });

    if (like === null) {
      return res.status(400).json({
        error: "You didn't like this post.",
      });
    }

    like.destroy();
    return res.status(200).json({
      message: 'Like has been deleted',
    });
  }
}

export default new LikeController();