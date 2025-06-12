const {
  create,
  findAll,
  findOne,
  update,
  remove,
} = require("../controllers/student_homework.controller");
const studentJwtGuard = require("../middleware/guards/student-jwt.guard");
const studentSelfGuard = require("../middleware/guards/student-self.guard");

const router = require("express").Router();

router.post("/", studentJwtGuard, studentSelfGuard, create);
router.get("/", studentJwtGuard, findAll);
router.get("/:id", studentJwtGuard, studentSelfGuard, findOne);
router.patch("/:id", studentJwtGuard, studentSelfGuard, update);
router.delete("/:id", studentJwtGuard, studentSelfGuard, remove);

module.exports = router;
