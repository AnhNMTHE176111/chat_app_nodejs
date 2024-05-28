var express = require("express");
var router = express.Router();
const usersRouter = require("./user.routes");
const productsRouter = require("./product.routes");
const authRouter = require("./auth.routes");

/* GET home page. */
router.get("/", function (req, res, next) {
    res.json("Chat App!!!");
});

router.use("/auth", authRouter);
router.use("/user", usersRouter);
router.use("/product", productsRouter);

module.exports = router;
