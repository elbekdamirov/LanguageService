const {
  create,
  findAll,
  findOne,
  update,
  remove,
} = require("../controllers/course.controller");
const ownerJwtGuard = require("../middleware/guards/owner-jwt.guard");
const ownerSelfGuard = require("../middleware/guards/owner-self.guard");

const router = require("express").Router();

router.post("/", ownerJwtGuard, create);
router.get("/", findAll);
router.get("/:id", ownerJwtGuard, findOne);
router.patch("/:id", ownerJwtGuard, update);
router.delete("/:id", ownerJwtGuard, remove);

module.exports = router;
