const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('threads', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    upvotes: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    downvotes: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    lastEditDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    Pages_FK: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Users_FK: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'threads',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
