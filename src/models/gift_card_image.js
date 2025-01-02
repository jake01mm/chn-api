'use strict';

module.exports = (sequelize, DataTypes) => {
  const GiftCardImage = sequelize.define('GiftCardImage', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    image_url: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    tableName: 'GiftCardImages',
    underscored: true,
    paranoid: true
  });

  GiftCardImage.associate = function(models) {
    GiftCardImage.hasOne(models.GiftCard, {
      foreignKey: 'image_id',
      as: 'giftCard'
    });
  };

  return GiftCardImage;
}; 