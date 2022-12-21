import { signUp, signIn, signOut } from "../controllers/signController.js";
import { signUpValidation, signInValidation } from "../middlewares/signValidation.js";
import { Router } from "express";

const router = Router();

router.post("/signUp", signUpValidation, signUp);
router.post("/signIn", signInValidation,signIn);
router.post("/signOut" ,signOut);


export default router;