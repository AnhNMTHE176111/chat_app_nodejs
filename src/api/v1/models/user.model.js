const { default: mongoose } = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            trim: true,
            required: true,
            maxLength: 32,
            unique: true,
            match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
        },
        password: {
            type: String,
            trim: true,
            required: true,
        },
        role: {
            type: [String],
            trim: true,
            enum: ["admin", "normal"],
            default: ["normal"],
        },
        username: {
            type: String,
            trim: true,
            maxLength: 32,
            unique: true,
            match: /^[a-zA-Z0-9]([._-](?![._-])|[a-zA-Z0-9]){3,18}[a-zA-Z0-9]$/,
            required: true,
        },
        fullName: {
            type: String,
            trim: true,
            maxLength: 64,
            required: false,
        },
        lastOnline: {
            type: Date,
        },
        isOnline: {
            type: Boolean,
            default: false,
        },
        isReported: {
            type: Boolean,
            default: false,
        },
        isBlocked: {
            type: Boolean,
            default: false,
        },
        avatar: {
            type: String,
            trim: true,
        },
        friends: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        avatar: String,

        /** Access Token */
        accessToken: String,
        tokenExpireAt: Date,

        /** Refresh Token */
        refreshToken: String,
        refreshTokenExpireAt: Date,

        /** Acitvation Email */
        verificationToken: String,
        verificationStatus: {
            type: Boolean,
            default: false,
        },

        /** Reset Password Token */
        passwordResetToken: String,
        passwordResetExpires: Date,
    },
    {
        timestamps: true,
    }
);

UserSchema.statics.findOneByEmail = async function ({ email }) {
    const user = await this.findOne({ email });
    if (!user) {
        throw new Error("Email has not been registered!");
    }
    return user;
};

const User = mongoose.model("User", UserSchema);
module.exports = User;
