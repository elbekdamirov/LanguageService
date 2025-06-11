const router = require("express").Router();
const studentRotuer = require("./student.routes");

router.use("/students", studentRotuer);

module.exports = router;
