import express from "express";

import controller from "./usersController";

const router: express.Router = express.Router();

router.get("/", controller.getUsers);

export default router;
