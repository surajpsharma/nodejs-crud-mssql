const { body, validationResult } = require("express-validator");
const {
  createUser,
  getAllUsers,
  getUserById,
  getUserByEmail,
  updateUser,
  deleteUser,
} = require("../models/userModel");

const validateUser = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Invalid email format"),
];

const ensureEmailCheck = async (email, excludeId = null) => {
  const existing = await getUserByEmail(email);
  if (!existing) {
    return null;
  }

  if (excludeId && existing.id === Number(excludeId)) {
    return null;
  }

  return existing;
};

const createUserHandler = [
  ...validateUser,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email } = req.body;
      const duplicate = await ensureEmailCheck(email);
      if (duplicate) {
        return res.status(400).json({ error: "Email already exists" });
      }

      const newUser = await createUser({ name, email });
      res.status(201).json(newUser);
    } catch (error) {
      console.error("Failed to create user:", error.message);
      res.status(500).json({ error: "Server error" });
    }
  },
];
//all user
const getAllUsersHandler = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    console.error("Failed to fetch users:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

//user by id
const getUserByIdHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await getUserById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Failed to fetch user:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

const updateUserHandler = [
  ...validateUser,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const { name, email } = req.body;
      const duplicate = await ensureEmailCheck(email, id);
      if (duplicate) {
        return res.status(400).json({ error: "Email already exists" });
      }

      // Update user
      const updatedUser = await updateUser(id, { name, email });
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(updatedUser);
    } catch (error) {
      console.error("Failed to update user:", error.message);
      res.status(500).json({ error: "Server error" });
    }
  },
];
//delete user
const deleteUserHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await deleteUser(id);
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Failed to delete user:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  createUserHandler,
  getAllUsersHandler,
  getUserByIdHandler,
  updateUserHandler,
  deleteUserHandler,
};
