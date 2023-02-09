import express from "express";
import * as userController from "../controllers/user conroller";
import * as doctorController from "../controllers/doctor Controller"
import validate from "../handlers/validation";
import { SaveUser } from "../middlewares/validator";
import isLoggedIn from "../middlewares/auth";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "اهلا بالعالم" });
});

///user routes
router.post("/account/signup", validate(SaveUser), userController.register);
router.post("/account/signin", userController.login);
router.get("/account/me", isLoggedIn, userController.me);
router.get("/account/profile", isLoggedIn, userController.getProfile);

//doctor routes
router.get("/doctors", doctorController.index);

export default router;
