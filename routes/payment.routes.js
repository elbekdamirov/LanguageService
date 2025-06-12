const {
  create,
  findAll,
  findOne,
  update,
  remove,
  findPaymentsByStudent,
} = require("../controllers/payment.controller");

const router = require("express").Router();

router.post("/", create);
router.get("/", findAll);
router.post("/by-student", findPaymentsByStudent);
router.get("/:id", findOne);
router.patch("/:id", update);
router.delete("/:id", remove);

module.exports = router;
