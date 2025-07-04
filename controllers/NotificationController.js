import Notification from "../models/NotificationModel.js"
import UserModel from "../models/UserModel.js";
import admin from "../config/firebase.js"

// Helper: Send FCM push notification to users
async function sendPushToUsers(userIds, notification) {
  const users = await UserModel.find({ _id: { $in: userIds } });
  const tokens = users.flatMap(user => user.deviceTokens || []);
  if (tokens.length === 0) return;

  const message = {
    notification: {
      title: notification.title,
      body: notification.message,
    },
    tokens: tokens,
  };

  try {
    const result = await admin.messaging().sendEachForMulticast(message);
    console.log(result.responses);
    
  } catch (err) {
    console.error('Error sending FCM push:', err);
  }
}

// Admin: Send notification to user(s) or all
export const sendNotification = async (req, res) => {
  try {
    const { title, message, recipients, isForAll } = req.body;
    let notificationData = { title, message, isForAll: !!isForAll };

    if (!isForAll) {
      if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
        return res.status(400).json({ message: 'Recipients required unless sending to all.' });
      }
      notificationData.recipients = recipients;
    }

    const notification = await Notification.create(notificationData);

    // Send push notification via FCM
    if (notificationData.isForAll) {
      const allUsers = await UserModel.find({}, '_id');
      await sendPushToUsers(allUsers.map(u => u._id), notification);
    } else {
      await sendPushToUsers(recipients, notification);
    }

    res.status(201).json({ message: 'Notification sent.', notification });
  } catch (err) {
    res.status(500).json({ message: 'Error sending notification', error: err.message });
  }
};

// User: Get notifications for the logged-in user
export const getUserNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    const notifications = await Notification.find({
      $or: [
        { isForAll: true },
        { recipients: userId }
      ]
    }).sort({ createdAt: -1 });
    res.json({ notifications });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching notifications', error: err.message });
  }
};

// User: Mark a notification as read
export const markAsRead = async (req, res) => {
  try {
    const userId = req.user._id;
    const { notificationId } = req.body;
    const notification = await Notification.findById(notificationId);
    if (!notification) return res.status(404).json({ message: 'Notification not found' });
    if (!notification.readBy.includes(userId)) {
      notification.readBy.push(userId);
      await notification.save();
    }
    res.json({ message: 'Notification marked as read' });
  } catch (err) {
    res.status(500).json({ message: 'Error marking as read', error: err.message });
  }
}; 