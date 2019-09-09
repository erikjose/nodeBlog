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
}

Post.associate = function (models) {
  Post.belongsToMany(models.User, {
    foreignKey: {
      allowNull: false,
    },
  });
};

export default Post;
