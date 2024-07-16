const { default: mongoose } = require("mongoose");

const friendSchema = new mongoose.Schema({
    friend_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    sender_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    status: {
        type: String,
        trim: true,
        enum: ["accept", "reject", "pending"],
        default: "pending",
    },
});

const UserSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            trim: true,
            required: true,
            maxLength: 32,
            unique: true,
            match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
            index: true,
        },
        friends: [friendSchema],
        password: {
            type: String,
            trim: true,
            required: false,
        },
        role: {
            type: String,
            trim: true,
            enum: ["admin", "normal"],
            default: "normal",
        },
        username: {
            type: String,
            trim: true,
            maxLength: 32,
            unique: false,
            match: /^[a-zA-Z0-9]([._-](?![._-])|[a-zA-Z0-9]){3,18}[a-zA-Z0-9]$/,
            required: false,
            default: null,
        },
        fullName: {
            type: String,
            trim: true,
            maxLength: 32,
            minLength: 3,
            required: true,
        },
        lastOnline: {
            type: Date,
        },
        isOnline: {
            type: Boolean,
            default: false,
        },
        avatar: {
            type: String,
            trim: true,
        },
        background: {
            type: String,
            trim: true,
        },
        dateOfBirth: {
            type: String,
            trim: true,
        },
        phone: {
            type: String,
            match: /^([0|84])+([0-9]{9})\b$/,
            trim: true,
        },
        address: {
            type: String,
            trim: true,
        },
        gender: {
            type: String,
            trim: true,
            enum: ["male", "female", "other"],
            default: "male",
        },
        description: {
            type: String,
            trim: true,
        },
        authProvider: {
            type: String,
            enum: ["local", "google", "facebook"],
            required: true,
            default: "local",
        },
        publicInformation: {
            type: Boolean,
            default: false,
        },

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
