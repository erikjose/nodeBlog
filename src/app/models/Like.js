import Sequelize, { Model } from 'sequelize';

class Like extends Model {
  static init(sequelize) {
    super.init({
      like: Sequelize.BOOLEAN,
      user_id: Sequelize.INTEGER,
      post_id: Sequelize.INTEGER,
    }, {
      sequelize,
    });

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', through: 'users', as: 'user' });
    this.belongsTo(models.Post, { foreignKey: 'post_id', through: 'posts', as: 'post' });
  }
}

export default Like;
