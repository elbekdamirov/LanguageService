const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");

const Student = sequelize.define(
  "student",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    full_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(15),
      validate: {
        is: /^\d{2}-\d{3}-\d{2}-\d{2}$/,
      },
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    birth_date: {
      type: DataTypes.DATEONLY,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    hashed_password: {
      type: DataTypes.STRING,
    },
    hashed_token: {
      type: DataTypes.STRING,
    },
  },
  {
    freezeTableName: true,
  }
);

module.exports = Student;
