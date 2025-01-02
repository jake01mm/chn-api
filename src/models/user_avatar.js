'use strict';

module.exports = (sequelize, DataTypes) => {
  const UserAvatar = sequelize.define('UserAvatar', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    avatar_url: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    tableName: 'UserAvatars',
    underscored: true,
    paranoid: true,
    indexes: [
      {
        unique: true,
        fields: ['user_id']
      }
    ]
  });

  UserAvatar.associate = function(models) {
    UserAvatar.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });
  };

  return UserAvatar;
}; 