import { urlsShorten, urlSearch, openUrl, deleteUrl } from "../controllers/urlsController.js";
import { urlValidation } from "../middlewares/urlValidation.js";
import { Router } from "express";

const router = Router();

router.post("/urls/shorten", urlValidation, urlsShorten);
router.get("/urls/:id", urlSearch);
router.get("/urls/open/:shortUrl", openUrl);
router.delete("/urls/:id", deleteUrl);

export default router;