module.exports = function(Sequelize, DataTypes) {

  return Sequelize.define('post', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    title: { type: DataTypes.TEXT },
    slug: { type: DataTypes.TEXT },
    author: { type: DataTypes.TEXT },
    content: { type: DataTypes.TEXT },
    config: { type: DataTypes.TEXT },
    published_at: { type: DataTypes.DATE }
  }, {
    underscored: true,
    paranoid: true,
    instanceMethods: {
      getHTML: function() { return Sequelize.exports.marked(this.content); },
      getConfig: function() {
        var config = JSON.parse(this.config);
        for (var i in config) {
          if (config[i] === 'true') {
            config[i] = true;
          }
          if (config[i] === 'false') {
            config[i] = false;
          }
        }
        return config;
      }
    }
  });

};