'use strict';
const {
  Model
} = require('sequelize');
const follows = require('./follows');
const threads = require('./threads');
const comments = require('./comments');
const blacklists = require('./blacklists');
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
      this.hasMany(db.blacklists, { foreignKey: 'users_fk' });
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
    isDeleted: DataTypes.BOOLEAN,
    status: DataTypes.STRING,
    ForceRelogin: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'users',
  });
  return users;
};