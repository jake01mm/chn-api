'use strict';

module.exports = (sequelize, DataTypes) => {
  const VerificationCode = sequelize.define('VerificationCode', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    code: {
      type: DataTypes.STRING(6),
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('Withdrawal', 'password_reset', 'register'),
      allowNull: false
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    tableName: 'VerificationCodes',
    underscored: true,
    timestamps: true,
    updatedAt: false,
    paranoid: true
  });

  VerificationCode.associate = function(models) {
    VerificationCode.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });
  };

  return VerificationCode;
}; 