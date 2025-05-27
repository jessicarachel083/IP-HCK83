'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Comment.belongsTo(models.MissingPet, {
        foreignKey: "missingPetId"
      });
      Comment.belongsTo(models.User, {
        foreignKey: "userId"
      });
    }
  }

  Comment.init({
    missingPetId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Missing Pet ID harus diisi!"
        },
        notNull: {
          msg: "Missing Pet ID harus diisi!"
        }
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "User ID harus diisi!"
        },
        notNull: {
          msg: "User ID harus diisi!"
        }
      }
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Komentar harus diisi!"
        },
        notNull: {
          msg: "Komentar harus diisi!"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Comment',
  });

  return Comment;
};