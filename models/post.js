module.exports = function(Sequelize, DataTypes) {

  return Sequelize.define('post', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    title: { type: DataTypes.TEXT },
    slug: { type: DataTypes.TEXT },
    author: { type: DataTypes.TEXT },
    content: { type: DataTypes.TEXT },
  }, {
    underscored: true,
    paranoid: true,
    instanceMethods: {
      getHTML: function() { return Sequelize.exports.marked(this.content); }
    }
  });

};