const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");
const StudentLesson = require("./student_lesson.model");

const Homework = sequelize.define(
  "homework",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(50),
    },
    description: {
      type: DataTypes.TEXT,
    },
  },
  {
    freezeTableName: true,
  }
);

StudentLesson.hasMany(Homework);
Homework.belongsTo(StudentLesson);

module.exports = Homework;
