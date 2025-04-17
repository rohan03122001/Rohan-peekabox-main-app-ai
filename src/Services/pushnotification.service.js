const admin = require('firebase-admin');
const serviceAccount = require('./path-to-your-serviceAccountKey.json');

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Function to send push notifications
const sendPushNotification = async (fcmToken, title, message) => {
  try {
    const payload = {
      notification: {
        title: title,
        body: message,
      },
    };

    const response = await admin.messaging().sendToDevice(fcmToken, payload);
    console.log('Push notification sent:', response);
  } catch (error) {
    console.error('Error sending push notification:', error);
  }
};
