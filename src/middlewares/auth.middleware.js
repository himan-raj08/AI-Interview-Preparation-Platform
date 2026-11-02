const jwt = require("jsonwebtoken");
const tokenblacklistModel = require("../models/blackList.model");

async function authUser(req, res, next) {

    const token = req.cookies.token;

    console.log("TOKEN FROM COOKIE:", token);

    if (!token) {
        console.log("❌ TOKEN NOT PROVIDED");

        return res.status(401).json({
            message: "Token not provided"
        });
    }

    const isTokenBlackListed =
        await tokenblacklistModel.findOne({ token });

    console.log("BLACKLISTED:", !!isTokenBlackListed);

    if (isTokenBlackListed) {
        console.log("❌ TOKEN BLACKLISTED");

        return res.status(401).json({
            message: "token is invalid"
        });
    }

    try {

        const decoded =
            jwt.verify(token, process.env.JWT_SECRET);

        console.log("✅ TOKEN VALID:", decoded);

        req.user = decoded;

        next();

    } catch (error) {

        console.log("❌ JWT ERROR:", error.message);

        return res.status(401).json({
            message: "INVALID TOKEN"
        });
    }
}

module.exports = authUser;