'use strict';
const {
  Model
} = require('sequelize');
const threads = require('./threads');
const follows = require('./follows');
module.exports = (sequelize, DataTypes) => {
  class pages extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(db) {
      this.hasMany(db.threads, { foreignKey: 'pages_fk' });
      this.hasMany(db.follows, { foreignKey: 'pages_fk' });
    }
  }
  pages.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    category: DataTypes.STRING,
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'pages',
  });
  return pages;
};