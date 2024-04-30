var express = require("express"); // File is a CommonJS module; it may be converted to an ES module.ts(80001)
var router = express.Router();

router.get("/", function (req, res, next) {
    res.json("GET HTTP from Product Route");
});

module.exports = router;
