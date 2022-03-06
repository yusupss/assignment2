'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Todo.belongsTo(models.User, { foreignKey: 'UserId' });
    }
  }
  Todo.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'title cannot be empty'
        },
        notEmpty: {
          msg: 'title cannot be empty'
        }
      }
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'description cannot be empty'
        },
        notEmpty: {
          msg: 'description cannot be empty'
        }
      }
    },
    due_date: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notNull: {
          msg: `due date can't be empty`
        },
        notEmpty: {
          msg: `due date can't be empty`
        },
        isAfter: {
          args: [new Date().toLocaleDateString()],
          msg: "due date can't before today"
        },
      }
    },
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Todo',
  });
  return Todo;
};