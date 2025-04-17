const crypto = require('crypto');

function generateOTP(length = 6) {
  const digits = '0123456789';
  const digitLength = digits.length;
  const maxByte = 256 - (256 % digitLength); // To avoid modulo bias

  let otp = '';
  while (otp.length < length) {
    const randomBytes = crypto.randomBytes(1);
    const randomNum = randomBytes[0];

    // Avoid modulo bias by rejecting values above maxByte
    if (randomNum < maxByte) {
      otp += digits[randomNum % digitLength];
    }
  }

  return otp;
}

const validateOTP = (inputOTP, storedOTP) => {
  if (inputOTP !== storedOTP) {
    return {
      valid: false,
      message: 'Invalid OTP',
    };
  }

  return {
    valid: true,
    message: 'OTP validated successfully',
  };
};

const CryptoUtil = {
  generateOTP,
  validateOTP,
};

module.exports = { CryptoUtil };
