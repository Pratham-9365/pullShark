import express from "express";
import redirectUser from "../controllers/auth/redirect.js";
import exchangeToken from "../controllers/auth/exchangecode.js";
const authRouter = express.Router();

authRouter.get("/redirect", redirectUser);
authRouter.get("/exchange/:code", exchangeToken);

export default authRouter;