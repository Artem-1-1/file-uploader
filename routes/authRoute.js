import { Router } from "express";
import auth from "../controllers/auth.js"

const router = Router();

router.get("/login", auth.getLogIn);
router.post("/login", auth.userValidateLogIn, auth.postLogIn);

router.get("/register", auth.getRegister);
router.post("/register", auth.userValidateRegister, auth.postRegister);

export default router;