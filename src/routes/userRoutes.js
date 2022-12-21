import { userUrls } from "../controllers/userController.js";
import { Router } from "express";

const router = Router();

router.get("/users/me", userUrls);

export default router;