const OTPPurpose = {
  SIGNUP: 'SIGNUP',
  FORGOT_PASSWORD: 'FORGOT_PASSWORD',
};

const Environments = {
  PRODUCTION: 'PRODUCTION',
  STAGING: 'STAGING',
};

const TokenTypes = {
  ACCESS: 'ACCESS',
  REFRESH: 'REFRESH',
};

const AuthTypes = {
  USER: 'USER',
  STORE: 'STORE',
  ADMIN: 'ADMIN',
};

const AuthConfig = {
  [AuthTypes.USER]: {
    accessToken: 'user_access_token',
    refreshToken: 'user_refresh_token',
    refreshPath: '/api/user/auth/refresh',
  },
  [AuthTypes.STORE]: {
    accessToken: 'store_access_token',
    refreshToken: 'store_refresh_token',
    refreshPath: '/api/store/auth/refresh',
  },
  [AuthTypes.ADMIN]: {
    accessToken: 'admin_access_token',
    refreshToken: 'admin_refresh_token',
    refreshPath: '/api/internal/auth/refresh',
  },
};

const OrderStatus = {
  PENDING: 'PENDING',
  PAYMENT_COMPLETED: 'PAYMENT_COMPLETED',
  EXPIRED: 'EXPIRED',
  ERRORED: 'ERRORED',
  REFUNDED: 'REFUNDED',
  PICKED_UP_DELIVERY: 'PICKED_UP_DELIVERY',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
};

const OrderType = {
  DELIVERY: 'DELIVERY',
  PICKUP: 'PICKUP',
};

const CONSTANTS = {
  OTPPurpose,
  Environments,
  TokenTypes,
  AuthTypes,
  AuthConfig,
  OrderStatus,
  OrderType,
};

module.exports = { CONSTANTS };
