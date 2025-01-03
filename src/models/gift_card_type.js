'use strict';

module.exports = (sequelize, DataTypes) => {
  const GiftCardType = sequelize.define('GiftCardType', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    note: {
      type: DataTypes.TEXT
    },
    image_url: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    tableName: 'GiftCardTypes',
    underscored: true,
    paranoid: true
  });

  GiftCardType.associate = function(models) {
    GiftCardType.hasMany(models.GiftCard, {
      foreignKey: 'type_id',
      as: 'giftCards'
    });
  };

  return GiftCardType;
}; 