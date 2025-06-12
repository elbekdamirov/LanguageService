const {
  create,
  findAll,
  findOne,
  update,
  remove,
  findPaymentsByStudent,
} = require("../controllers/payment.controller");
const adminJwtGuard = require("../middleware/guards/admin-jwt.guard");
const studentJwtGuard = require("../middleware/guards/student-jwt.guard");

const router = require("express").Router();

router.post("/", studentJwtGuard, create);
router.get("/", studentJwtGuard, findAll);
router.post("/by-student", findPaymentsByStudent);
router.get("/:id", studentJwtGuard, findOne);
router.patch("/:id", studentJwtGuard, update);
router.delete("/:id", adminJwtGuard, remove);

module.exports = router;
