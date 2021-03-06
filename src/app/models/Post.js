import Sequelize, { Model } from 'sequelize';

class Post extends Model {
  static init(sequelize) {
    super.init(
      {
        title: Sequelize.STRING,
        content: Sequelize.TEXT,
        user_id: Sequelize.INTEGER,
      },
      {
        sequelize,
      },
    );
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', through: 'users', as: 'user' });
    this.hasMany(models.Comment, { as: 'comments' });
    this.hasMany(models.Like, { as: 'likes' });
  }
}

export default Post;
