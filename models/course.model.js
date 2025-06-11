const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");
const Owner = require("./owner.model");

const Course = sequelize.define(
  "course",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    language: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    level: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
    },
  },
  {
    freezeTableName: true,
  }
);

Owner.hasMany(Course);
Course.belongsTo(Owner);

module.exports = Course;
