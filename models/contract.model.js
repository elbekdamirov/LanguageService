const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");
const Course = require("./course.model");
const Student = require("./student.model");

const Contract = sequelize.define(
  "contract",
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
    start_time: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    end_time: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    total_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("ENDED", "ACTIVE", "PENDING"),
    },
  },
  {
    freezeTableName: true,
  }
);

Course.hasMany(Contract);
Contract.belongsTo(Course);

Student.hasMany(Contract);
Contract.belongsTo(Student);

module.exports = Contract;
