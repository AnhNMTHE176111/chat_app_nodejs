var express = require("express");
var router = express.Router();
const usersRouter = require("./user.route");
const authGoogle = require("./authGoogle.route");
const productsRouter = require("./product.routes");
const authRouter = require("./auth.route");
const messageRouter = require("./message.route");
const { verifyJWT } = require("../middlewares/authorization.middleware");
const conversationRouter = require("./conversation.route");

/* GET home page. */
router.get("/", function (req, res, next) {
    res.json("Thành công rồi cả nhà ơi!!!");
});

router.use("/auth/google", authGoogle);
router.use("/auth", authRouter);

/** Private routes */
router.use(verifyJWT);
router.use("/user", usersRouter);
router.use("/product", productsRouter);
router.use("/message", messageRouter);
router.use("/conversation", conversationRouter);

module.exports = router;
