'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Sighting extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Sighting.belongsTo(models.MissingPet, {
        foreignKey: "missingPetId"
      });
      Sighting.belongsTo(models.User, {
        foreignKey: "reporterId"
      });
    }
  }

  Sighting.init({
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
    reporterId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Reporter ID harus diisi!"
        },
        notNull: {
          msg: "Reporter ID harus diisi!"
        }
      }
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Lokasi penampakan harus diisi!"
        },
        notNull: {
          msg: "Lokasi penampakan harus diisi!"
        }
      }
    },
    sightingDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Tanggal penampakan harus diisi!"
        },
        notNull: {
          msg: "Tanggal penampakan harus diisi!"
        }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'Sighting',
  });

  return Sighting;
};