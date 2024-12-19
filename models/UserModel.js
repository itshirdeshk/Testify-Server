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
    examId: {
      type: Schema.Types.ObjectId,
      ref: "Exam",
    },
    subExamId: {
      type: Schema.Types.ObjectId,
      ref: "SubExam",
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

const UserModel = mongoose.model("User", UserSchema);

export default UserModel;
