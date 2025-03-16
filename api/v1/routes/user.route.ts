import {Router} from "express";
const router: Router = Router();

import * as controller from "../controllers/user.controller";

router.get("/register", controller.register);

router.post("/login", controller.login);

router.get("/detail/:id", controller.detail);

export const userRoutes: Router = router;