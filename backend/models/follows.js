'use strict';
const {
  Model
} = require('sequelize');
const users = require('./users');
const pages = require('./pages');
module.exports = (sequelize, DataTypes) => {
  class follows extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(db) {
      this.belongsTo(db.users, { foreignKey: 'users_fk' });
      this.belongsTo(db.pages, { foreignKey: 'pages_fk' });
    }
  }
  follows.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    users_fk: DataTypes.INTEGER,
    pages_fk: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'follows',
  });
  return follows;
};