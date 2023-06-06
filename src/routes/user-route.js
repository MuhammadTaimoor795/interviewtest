const { registerUser, loginUser } = require("../controller/user-controller");

const router = require("express").Router();
const { schemas, validationSchema } = require("../middleware/joivalidation");
router.post("/register", validationSchema(schemas.User.create), registerUser);

// User login
router.post("/login", validationSchema(schemas.User.login), loginUser);

module.exports = router;
