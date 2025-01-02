'use strict';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      unique: true
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    phone_number: {
      type: DataTypes.STRING(20),
    },
    password: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    email_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    role: {
      type: DataTypes.ENUM('admin', 'user', 'merchant'),
      defaultValue: 'user'
    },
    is_online: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    status: {
      type: DataTypes.ENUM('active', 'suspended', 'deleted'),
      defaultValue: 'active'
    }
  }, {
    tableName: 'Users',
    underscored: true,
    paranoid: true,
    indexes: [
      {
        unique: true,
        fields: ['email']
      },
      {
        unique: true,
        fields: ['username']
      },
      {
        unique: true,
        fields: ['uuid']
      }
    ]
  });

  User.beforeCreate((user, _) => {
    if (!user.uuid) {
      user.uuid = DataTypes.UUIDV4();
    }
  });

  User.associate = function(models) {
    User.hasOne(models.UserAvatar, {
      foreignKey: 'user_id',
      as: 'avatar'
    });
    User.hasOne(models.UserSensitiveInfo, {
      foreignKey: 'user_id',
      as: 'sensitiveInfo'
    });
    User.hasMany(models.VerificationCode, {
      foreignKey: 'user_id',
      as: 'verificationCodes'
    });
  };

  return User;
}; 