const express = require("express");
const userController = require("../../controllers/userController");

const router = express.Router();

router.post("/login", userController.login);
router.post("/register", userController.register);
router.get("/profile", userController.getUsers);
router.delete("/users", userController.deleteUser);

module.exports = router;
