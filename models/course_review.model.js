const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");
const Course = require("./course.model");
const Student = require("./student.model");

const CourseReview = sequelize.define(
  "course_review",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    rating: {
      type: DataTypes.ENUM("1", "2", "3", "4", "5"),
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  }
);

Course.hasMany(CourseReview);
CourseReview.belongsTo(Course);

Student.hasMany(CourseReview);
CourseReview.belongsTo(Student);

module.exports = CourseReview;
