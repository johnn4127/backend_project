'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Histories extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Histories.belongsTo(models.Accounts, {
        foreignKey:'account_id'
      });
      Histories.belongsTo(models.Books, {
        foreignKey:'book_id'
      });
    }
  }
  Histories.init({
    account_id: DataTypes.INTEGER,
    book_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Histories',
  });
  return Histories;
};