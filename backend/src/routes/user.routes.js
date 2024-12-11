import express from "express";
import {
  register,
  login,
  logout,
  deleteUser,
  getUserProfile,
  updateUserProfile,
} from "../controllers/user.controller.js";
import { authentication } from "../middleware/user.middleware.js";

const userRouter = express.Router();

//routes for user
userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.post("/logout", logout);
userRouter.delete("/:id", authentication, deleteUser);
userRouter.get("/me", authentication, getUserProfile); // New /me route
userRouter.patch("/:userId/update", authentication, updateUserProfile); // New /me route

export default userRouter;
