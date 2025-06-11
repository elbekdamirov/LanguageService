const router = require("express").Router();
const studentRotuer = require("./student.routes");
const ownerRouter = require("./owner.routes");
const adminRouter = require("./admin.routes");

router.use("/students", studentRotuer);
router.use("/owners", ownerRouter);
router.use("/admins", adminRouter);

module.exports = router;
