const { Router } = require("express");

const {
    registerController,
    loginuserController,
    logoutUserController,
    getMeController
} = require("../controllers/auth.controller");

const middleware = require("../middlewares/auth.middleware");

const authRouter = Router();

authRouter.post("/register", registerController);

authRouter.post("/login", loginuserController);

authRouter.post(
    "/logout",
    middleware,
    logoutUserController
);

authRouter.get(
    "/get-me",
    middleware,
    getMeController
);

module.exports = authRouter;