const { SendEmailCommand } = require('@aws-sdk/client-ses');
const { AWS } = require('../config/aws');
const logger = require('../config/logger');

const sendEmail = async ({ from, to, subject, message }) => {
  const ses = AWS.getSESClient();

  try {
    const params = {
      Source: from,
      Destination: {
        ToAddresses: Array.isArray(to) ? to : [to],
      },
      Message: {
        Subject: {
          Data: subject,
        },
        Body: {
          Text: {
            Data: message,
          },
        },
      },
    };

    const command = new SendEmailCommand(params);
    const result = await ses.send(command);
    logger.info(
      'Email sent successfully',
      'EMAIL_SERVICE',
      'SEND_EMAIL_SUCCESS',
      result,
    );
  } catch (error) {
    logger.error(
      'Email trigerr Failed',
      'EMAIL_SERVICE',
      'SEND_EMAIL_FAILURE',
      error,
    );
  }
};

const NotificationService = {
  sendEmail,
};

module.exports = { NotificationService };
