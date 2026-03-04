import { Router } from "express";
import auth from "../controllers/auth.js"

const router = Router();

router.get("/login", auth.LogIn);

router.get("/register", auth.getSignUp);

export default router;