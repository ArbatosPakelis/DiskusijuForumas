'use strict';
const {
  Model
} = require('sequelize');
const comments = require('./comments');
const users = require('./users');
const pages = require('./pages');
module.exports = (sequelize, DataTypes) => {
  class threads extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(db) {
      this.belongsTo(db.users, { foreignKey: 'users_fk' });
      this.belongsTo(db.pages, { foreignKey: 'pages_fk' });
      this.hasMany(db.comments, { foreignKey: 'threads_fk' });
    }
  }
  threads.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    name: DataTypes.STRING,
    upvotes: DataTypes.INTEGER,
    downvotes: DataTypes.INTEGER,
    users_fk: DataTypes.INTEGER,
    pages_fk: DataTypes.INTEGER,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'threads',
  });
  return threads;
};