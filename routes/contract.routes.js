const {
  create,
  findAll,
  findOne,
  update,
  remove,
  findByDate,
} = require("../controllers/contract.controller");
const adminJwtGuard = require("../middleware/guards/admin-jwt.guard");
const studentJwtGuard = require("../middleware/guards/student-jwt.guard");
const studentSelfGuard = require("../middleware/guards/student-self.guard");

const router = require("express").Router();

router.post("/", studentJwtGuard, create);
router.get("/", findAll);
router.post("/find-by-date", findByDate);
router.get("/:id", studentJwtGuard, studentSelfGuard, findOne);
router.patch("/:id", studentJwtGuard, update);
router.delete("/:id", adminJwtGuard, remove);

module.exports = router;
