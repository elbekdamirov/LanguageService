const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");
const Student = require("./student.model");
const Contract = require("./contract.model");

const Payment = sequelize.define(
  "payment",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
    },
    method: {
      type: DataTypes.ENUM("CARD", "CASH", "ONLINE"),
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
    },
  },
  {
    freezeTableName: true,
  }
);

Contract.hasMany(Payment);
Payment.belongsTo(Contract);

Student.hasMany(Payment);
Payment.belongsTo(Student);

module.exports = Payment;
