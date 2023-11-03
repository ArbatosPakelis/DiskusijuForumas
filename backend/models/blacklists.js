'use strict';
const {
  Model
} = require('sequelize');
const users = require('./users');
module.exports = (sequelize, DataTypes) => {
  class blacklists extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(db) {
      this.belongsTo(db.users, { foreignKey: 'users_fk' });
    }
  }
  blacklists.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    device: DataTypes.STRING,
    users_fk: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'blacklists',
  });
  return blacklists;
};