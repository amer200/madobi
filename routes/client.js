const express = require("express");
const { signup, login, editProfile } = require("../controllers/client");
const clientMiddleware = require("../middlewares/client");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.put("/edit-profile", clientMiddleware.isAuth, editProfile);

module.exports = router;