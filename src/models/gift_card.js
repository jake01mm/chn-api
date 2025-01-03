'use strict';

module.exports = (sequelize, DataTypes) => {
  const GiftCard = sequelize.define('GiftCard', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    type_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    country: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    min: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00
    },
    max: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00
    },
    nairarate: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0.00
    }
  }, {
    tableName: 'GiftCards',
    underscored: true,
    paranoid: true,
    indexes: [
      {
        fields: ['type_id']
      },
      {
        fields: ['country']
      }
    ]
  });

  GiftCard.associate = function(models) {
    GiftCard.belongsTo(models.GiftCardType, {
      foreignKey: 'type_id',
      as: 'type'
    });
  };

  return GiftCard;
}; 