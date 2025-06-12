const {
  create,
  findAll,
  findOne,
  update,
  remove,
} = require("../controllers/course_review.controller");
const studentJwtGuard = require("../middleware/guards/student-jwt.guard");

const router = require("express").Router();

router.post("/", studentJwtGuard, create);
router.get("/", studentJwtGuard, findAll);
router.get("/:id", studentJwtGuard, findOne);
router.patch("/:id", studentJwtGuard, update);
router.delete("/:id", studentJwtGuard, remove);

module.exports = router;
