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
      allowNull: false
    },
    user_type: {
      type: DataTypes.STRING(20),
      allowNull: false,
      comment: '用户类型：user/merchant/admin'
    },
    avatar_url: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    file_path: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: '文件在服务器上的物理路径'
    },
    content_type: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: '文件MIME类型'
    },
    file_size: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '文件大小（字节）'
    }
  }, {
    tableName: 'UserAvatars',
    underscored: true,
    paranoid: false,
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'user_type']
      }
    ]
  });

  return UserAvatar;
}; 