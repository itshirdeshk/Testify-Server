import mongoose from "mongoose";
const { Schema } = mongoose;

const NotificationSchema = new Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  recipients: [{ type: Schema.Types.ObjectId, ref: 'User' }], // Empty means all users
  isForAll: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  readBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

const Notification = mongoose.model('Notification', NotificationSchema); 
export default Notification;