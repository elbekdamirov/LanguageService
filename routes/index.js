const router = require("express").Router();
const studentRotuer = require("./student.routes");
const ownerRouter = require("./owner.routes");
const adminRouter = require("./admin.routes");
const courseRouter = require("./course.routes");
const courseReviewRouter = require("./course_review.routes");
const contractRouter = require("./contract.routes");
const studentLessonRouter = require("./student_lesson.routes");
const paymentRouter = require("./payment.routes");
const homeworkRouter = require("./homework.routes");
const studentHomeworkRouter = require("./student_homework.routes");

router.use("/students", studentRotuer);
router.use("/owners", ownerRouter);
router.use("/admins", adminRouter);
router.use("/courses", courseRouter);
router.use("/course-reviews", courseReviewRouter);
router.use("/contracts", contractRouter);
router.use("/student-lesson", studentLessonRouter);
router.use("/payments", paymentRouter);
router.use("/homework", homeworkRouter);
router.use("/student-homework", studentHomeworkRouter);

module.exports = router;
