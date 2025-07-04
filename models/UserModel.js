import mongoose from "mongoose";

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: Number,
      unique: true,
    },
    isUserVerified: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: true,
    },
    otp: {
      type: Number,
      required: true,
    },
    otpCreatedAt: {
      type: Date,
      required: true,
    },
    profilePicture: {
      type: String,
    },
    exam: {
      type: Schema.Types.ObjectId,
      ref: "Exam",
    },
    subExam: {
      type: Schema.Types.ObjectId,
      ref: "SubExam",
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    tokenInvalidBefore: {
      type: Date,
      default: null,
    },
    deviceTokens: [{ type: String }], // FCM device tokens for push notifications
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

const UserModel = mongoose.model("User", UserSchema);

export default UserModel;
