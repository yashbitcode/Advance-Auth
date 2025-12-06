const { Router } = require("express");
const { register } = require("../controllers/Auth.controllers");
const router = Router();

router.route("/register").post(register);

module.exports = router;