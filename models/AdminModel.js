import mongoose from "mongoose";

const { Schema } = mongoose;

const AdminSchema = new Schema(
  {
    name: {
      type: String,
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
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

const AdminModel = mongoose.model("Admin", AdminSchema);

export default AdminModel;
