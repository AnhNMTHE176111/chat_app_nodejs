const express = require("express");
const UserController = require("../controllers/User/user.controller");
const UserRequest = require("../validations/user.validation");
const userRouter = express.Router();

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

userRouter.get(
    "/friends/:id",
    UserRequest.getFriendsRequest,
    UserController.getFriends
);

userRouter.get(
    "/friend-requests/:id",
    UserRequest.getFriendsRequest,
    UserController.getFriendsRequestList
);

userRouter.put(
    "/change-friend-status/:id",
    UserRequest.changeFriendStatusRequest,
    UserController.changeFriendStatus
);

userRouter.get(
    "/find-by-email/:email",
    UserRequest.findByEmailRequest,
    UserController.findByEmail
);

userRouter.put(
    "/add-friend/:id",
    UserRequest.addFriendRequest,
    UserController.addFriend
);

userRouter.get("/friend/:id", UserController.getFriendById);

module.exports = userRouter;
