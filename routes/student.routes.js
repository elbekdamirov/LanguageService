const {
  create,
  findAll,
  findOne,
  remove,
  update,
  activate,
  changePassword,
  login,
  logout,
  refresh,
  findByDate,
  findCancelled,
} = require("../controllers/student.controller");
const studentJwtGuard = require("../middleware/guards/student-jwt.guard");
const studentSelfGuard = require("../middleware/guards/student-self.guard");

const router = require("express").Router();

router.get("/", studentJwtGuard, findAll);
router.post("/register", create);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh", refresh);
router.post("/find-by-date", findByDate);
router.post("/find-cancelled", findCancelled);
router.patch("/change-password", studentJwtGuard, changePassword);
router.get("/activate/:link", activate);
router.get("/:id", studentJwtGuard, studentSelfGuard, findOne);
router.patch("/:id", studentJwtGuard, studentSelfGuard, update);
router.delete("/:id", studentJwtGuard, studentSelfGuard, remove);

module.exports = router;
