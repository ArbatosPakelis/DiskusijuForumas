'use strict';
const {
  Model
} = require('sequelize');
const follows = require('./follows');
const threads = require('./threads');
const comments = require('./comments');
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(db) {
      this.hasMany(db.follows, { foreignKey: 'users_fk' });
      this.hasMany(db.threads, { foreignKey: 'users_fk' });
      this.hasMany(db.comments, { foreignKey: 'users_fk' });
      this.hasMany(db.Tokens, { foreignKey: 'users_fk' });
      this.hasMany(db.pages, { foreignKey: 'users_fk' });
    }
  }
  users.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    status: DataTypes.STRING,
    ForceRelogin: DataTypes.BOOLEAN,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'users',
  });
  return users;
};