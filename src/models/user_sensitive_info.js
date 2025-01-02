'use strict';

module.exports = (sequelize, DataTypes) => {
  const UserSensitiveInfo = sequelize.define('UserSensitiveInfo', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    first_name: DataTypes.STRING(50),
    last_name: DataTypes.STRING(50),
    bank_name: DataTypes.STRING(100),
    bank_account: DataTypes.STRING(100),
    is_approved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    tableName: 'UserSensitiveInfo',
    underscored: true,
    paranoid: true
  });

  UserSensitiveInfo.associate = function(models) {
    UserSensitiveInfo.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });
  };

  return UserSensitiveInfo;
}; 