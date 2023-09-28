var DataTypes = require("sequelize").DataTypes;
var _comments = require("./comments");
var _follows = require("./follows");
var _pages = require("./pages");
var _threads = require("./threads");
var _users = require("./users");

function initModels(sequelize) {
  var comments = _comments(sequelize, DataTypes);
  var follows = _follows(sequelize, DataTypes);
  var pages = _pages(sequelize, DataTypes);
  var threads = _threads(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);


  return {
    comments,
    follows,
    pages,
    threads,
    users,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
