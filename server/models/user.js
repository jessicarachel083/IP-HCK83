'use strict';
const { Model } = require('sequelize');
var bcrypt = require("bcryptjs");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.MissingPet, {
        foreignKey: "userId"
      });
      User.hasMany(models.Sighting, {
        foreignKey: "reporterId"
      });
      User.hasMany(models.Comment, {
        foreignKey: "userId"
      });
    }
  }

  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          msg: "Username harus diisi!"
        },
        notNull: {
          msg: "Username harus diisi!"
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      isEmail: true,
      validate: {
        notEmpty: {
          msg: "Email harus diisi!"
        },
        notNull: {
          msg: "Email harus diisi!"
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true, // OAuth users don't have passwords
      validate: {
        len: {
          args: [5],
          msg: "Password minimal 5 karakter!"
        }
      }
    },
    oauthProvider: {
      type: DataTypes.STRING,
      allowNull: true // 'google', 'facebook', etc.
    },
    oauthId: {
      type: DataTypes.STRING,
      allowNull: true // ID from OAuth provider
    },
    profilePicture: {
      type: DataTypes.STRING,
      allowNull: true // URL from social media
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'User',
  });

  User.beforeCreate((instance) => {
    // Only hash password if it exists (regular users, not OAuth)
    if (instance.password) {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(instance.password, salt);
      instance.password = hash;
    }
  });

  return User;
};