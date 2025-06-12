const {
  create,
  findAll,
  findOne,
  update,
  remove,
} = require("../controllers/student_lesson.controller");
const ownerJwtGuard = require("../middleware/guards/owner-jwt.guard");

const router = require("express").Router();

router.post("/", ownerJwtGuard, create);
router.get("/", ownerJwtGuard, findAll);
router.get("/:id", ownerJwtGuard, findOne);
router.patch("/:id", ownerJwtGuard, update);
router.delete("/:id", ownerJwtGuard, remove);

module.exports = router;
