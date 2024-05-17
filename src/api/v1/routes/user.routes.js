var express = require("express");
var router = express.Router();

router.get("/", function (req, res, next) {
    res.json("GET HTTP from Product Route");
});

module.exports = router;
 