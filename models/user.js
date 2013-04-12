module.exports = function(Sequelize, DataTypes) {

  return Sequelize.define('user', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    first_name: { type: DataTypes.TEXT },
    last_name: { type: DataTypes.TEXT },
    email: { type: DataTypes.TEXT },
    password: { type: DataTypes.TEXT },
  }, {
    underscored: true,
    paranoid: true,
  });

};