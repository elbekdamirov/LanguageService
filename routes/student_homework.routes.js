const {
  create,
  findAll,
  findOne,
  update,
  remove,
} = require("../controllers/student_homework.controller");

const router = require("express").Router();

router.post("/", create);
router.get("/", findAll);
router.get("/:id", findOne);
router.patch("/:id", update);
router.delete("/:id", remove);

module.exports = router;
