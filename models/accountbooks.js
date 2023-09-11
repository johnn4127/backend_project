'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class AccountBooks extends Model {
    static associate(models) {
      // Define the association with the Accounts and Books models
      AccountBooks.belongsTo(models.Accounts, { foreignKey: 'accountId' });
      AccountBooks.belongsTo(models.Books, { foreignKey: 'bookId' });
    }
  }

  AccountBooks.init({
    accountId: DataTypes.INTEGER,
    bookId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'AccountBooks',
  });

  return AccountBooks;
};


