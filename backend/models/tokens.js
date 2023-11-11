'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tokens extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(db) {
      this.belongsTo(db.users, { foreignKey: 'users_fk' });
    }
  }
  Tokens.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    token: DataTypes.STRING,
    users_fk: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Tokens',
  });
  return Tokens;
};