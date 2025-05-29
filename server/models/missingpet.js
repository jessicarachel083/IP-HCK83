'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class MissingPet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      MissingPet.belongsTo(models.User, {
        foreignKey: "userId"
      });
      MissingPet.hasMany(models.Sighting, {
        foreignKey: "missingPetId"
      });
      MissingPet.hasMany(models.Comment, {
        foreignKey: "missingPetId"
      });
    }
  }

  MissingPet.init({
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
    petName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Nama hewan harus diisi!"
        },
        notNull: {
          msg: "Nama hewan harus diisi!"
        }
      }
    },
    petType: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Jenis hewan harus diisi!"
        },
        notNull: {
          msg: "Jenis hewan harus diisi!"
        }
      }
    },
    breed: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Ras hewan harus diisi!"
        },
        notNull: {
          msg: "Ras hewan harus diisi!"
        }
      }
    },
    color: {
      type: DataTypes.STRING,
      allowNull: true // Keep as optional for filtering
    },
    petPhoto: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Foto hewan harus diupload!"
        },
        notNull: {
          msg: "Foto hewan harus diupload!"
        }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true // AI-generated, not from form
    },
    lastSeenLocation: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Lokasi terakhir terlihat harus diisi!"
        },
        notNull: {
          msg: "Lokasi terakhir terlihat harus diisi!"
        }
      }
    },
    lastSeenDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Tanggal terakhir terlihat harus diisi!"
        },
        notNull: {
          msg: "Tanggal terakhir terlihat harus diisi!"
        }
      }
    },
    contactInfo: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Informasi kontak harus diisi!"
        },
        notNull: {
          msg: "Informasi kontak harus diisi!"
        }
      }
    },
    status: {
      type: DataTypes.ENUM('missing', 'found', 'closed'),
      allowNull: false,
      defaultValue: 'missing'
    }
  }, {
    sequelize,
    modelName: 'MissingPet',
  });

  return MissingPet;
};