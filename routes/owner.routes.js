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
} = require("../controllers/owner.controller");
const ownerJwtGuard = require("../middleware/guards/owner-jwt.guard");
const ownerSelfGuard = require("../middleware/guards/owner-self.guard");

const router = require("express").Router();

router.get("/", ownerJwtGuard, findAll);
router.post("/register", create);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh", refresh);
router.patch("/change-password", ownerJwtGuard, changePassword);
router.get("/activate/:link", activate);
router.get("/:id", ownerJwtGuard, ownerSelfGuard, findOne);
router.patch("/:id", ownerJwtGuard, ownerSelfGuard, update);
router.delete("/:id", ownerJwtGuard, ownerSelfGuard, remove);

module.exports = router;
