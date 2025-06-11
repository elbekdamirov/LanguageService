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
} = require("../controllers/admin.controller");
const adminJwtGuard = require("../middleware/guards/admin-jwt.guard");
const adminSelfGuard = require("../middleware/guards/admin-self.guard");

const router = require("express").Router();

router.get("/", adminJwtGuard, findAll);
router.post("/register", create);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh", refresh);
router.patch("/change-password", adminJwtGuard, changePassword);
router.get("/activate/:link", activate);
router.get("/:id", adminJwtGuard, adminSelfGuard, findOne);
router.patch("/:id", adminJwtGuard, adminSelfGuard, update);
router.delete("/:id", adminJwtGuard, adminSelfGuard, remove);

module.exports = router;
