import express from "express";
import {
  addANote,
  updateANote,
  deleteANote,
  getNotes,
} from "../controllers/note.controller.js";
import { authentication } from "../middleware/user.middleware.js";

const noteRouter = express.Router();

//routes for user
noteRouter.get("/getallnotes", authentication, getNotes);
noteRouter.post("/add", authentication, addANote);
noteRouter.post("/update/:id", authentication, updateANote);
noteRouter.delete("/delete/:id", authentication, deleteANote);

export default noteRouter;
