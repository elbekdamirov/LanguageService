const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");
const Student = require("./student.model");
const Contract = require("./contract.model");
const Homework = require("./homework.model");

const StudentHomework = sequelize.define(
  "student_homework",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    answer: {
      type: DataTypes.TEXT,
    },
    status: {
      type: DataTypes.ENUM("submitted", "not_submitted", "late"),
    },
  },
  {
    freezeTableName: true,
  }
);

Homework.hasMany(StudentHomework);
StudentHomework.belongsTo(Homework);

Student.hasMany(StudentHomework);
StudentHomework.belongsTo(Student);

module.exports = StudentHomework;
