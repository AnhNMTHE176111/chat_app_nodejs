var express = require("express");
var router = express.Router();
const usersRouter = require("./user.route");
const authGoogle = require("./authGoogle.route");
const productsRouter = require("./product.routes");
const authRouter = require("./auth.route");

/* GET home page. */
router.get("/", function (req, res, next) {
    res.json("Thành công rồi cả nhà ơi!!!");
});

router.use("/auth/google", authGoogle);
router.use("/auth", authRouter);
router.use("/user", usersRouter);
router.use("/product", productsRouter);

module.exports = router;
