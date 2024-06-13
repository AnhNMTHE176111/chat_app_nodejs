const passport = require("passport");
const AuthGoogle = require("../controllers/Auth/authGoogle.controller");
const AuthRequest = require("../validations/auth.validation");
const router = require("express").Router();

/** Google Authentication: /auth/google */
router.get(
    "/",
    passport.authenticate("google", {
        scope: ["profile", "email"],
    })
);

router.get(
    "/callback",
    passport.authenticate("google", {
        session: false,
    }),
    AuthRequest.googleCallbackRequest,
    AuthGoogle.callback
);

module.exports = router;
