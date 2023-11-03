'use strict';
const {
  Model
} = require('sequelize');
const users = require('./users');
const threads = require('./threads');
module.exports = (sequelize, DataTypes) => {
  class comments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(db) {
      this.belongsTo(db.users, { foreignKey: 'users_fk' });
      this.belongsTo(db.threads, { foreignKey: 'threads_fk' });
    }
  }
  comments.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    content: DataTypes.STRING,
    upvotes: DataTypes.INTEGER,
    downvotes: DataTypes.INTEGER,
    users_fk: DataTypes.INTEGER,
    threads_fk: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'comments',
  });
  return comments;
};