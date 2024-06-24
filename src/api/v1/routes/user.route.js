var express = require("express");
const UserController = require("../controllers/User/user.controller");
const UserRequest = require("../validations/user.validation");
var userRouter = express.Router();

userRouter.get(
    "/profile/preview/:id",
    UserRequest.getProfilePreviewRequest,
    UserController.getProfilePreview
);
userRouter.get(
    "/profile/:id",
    UserRequest.getProfileRequest,
    UserController.getProfile
);
userRouter.put(
    "/profile/:id",
    UserRequest.changeProfileInformationRequest,
    UserController.changeProfileInformation
);

module.exports = userRouter;
