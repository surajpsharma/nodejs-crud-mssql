const express = require("express");
const router = express.Router();
const {
  createUserHandler,
  getAllUsersHandler,
  getUserByIdHandler,
  updateUserHandler,
  deleteUserHandler,
} = require("../controllers/userController");

router.post("/users", createUserHandler);
router.get("/users", getAllUsersHandler);
router.get("/users/:id", getUserByIdHandler);
router.put("/users/:id", updateUserHandler);
router.delete("/users/:id", deleteUserHandler);

module.exports = router;
