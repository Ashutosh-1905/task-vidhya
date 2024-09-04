const express = require("express");
const { getAllUser, createUser, updateUser, deleteUser, loginUser, logoutUser } = require("../controllers/userController");

const router = express.Router();

router.get("/users", getAllUser);
router.post("/users", createUser);
router.put("/users/:id",updateUser);
router.delete("/users/:id", deleteUser);
router.post("/users/login", loginUser);
router.get("/users/logout", logoutUser);

module.exports = router;