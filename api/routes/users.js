const express = require("express");
const { register, login, logout, updateUser, checkSession, refreshToken } = require("../controllers/users");
const router = express.Router();


router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.put("/updateUser", updateUser);
router.get("/check-session", checkSession);
router.get("/refresh", refreshToken);




module.exports = router
