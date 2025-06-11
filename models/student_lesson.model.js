const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");
const Student = require("./student.model");
const Contract = require("./contract.model");

const StudentLesson = sequelize.define(
  "student_lesson",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    is_there: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    reason: {
      type: DataTypes.TEXT,
    },
  },
  {
    freezeTableName: true,
  }
);

Contract.hasMany(StudentLesson);
StudentLesson.belongsTo(Contract);

Student.hasMany(StudentLesson);
StudentLesson.belongsTo(Student);

module.exports = StudentLesson;
