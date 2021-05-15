import * as createError from 'http-errors';

import {
  EMAIL_VERIFICATION,
  RESET_PASSWORD,
} from '../../utils/constants';
import OTP from './OTPModel';

export default class AuthService {
  public async verifyOTP(req) {
    const actions: any = {
      verify: EMAIL_VERIFICATION,
      reset: RESET_PASSWORD,
    };
    const requestToken = req.body.otp || req.params.otp;
    const requestType = req.body.type || req.params.type;

    if (!requestToken) {
      throw createError(400, { message: 'OTP is required.' });
    }

    const otp = await OTP.findOne(
      { token: requestToken, action: actions[requestType] },
    ).populate('user');

    if (!otp) {
      throw createError(400, {
        message: 'Invalid OTP.',
        code: 'invalid_otp',
      });
    }

    if (otp.expiryDate.valueOf() < Date.now()) {
      throw createError(400, {
        message: 'OTP has expired.',
        code: 'expired_otp',
      });
    }

    const user = otp.user;
    await otp.remove();

    return user;
  }
}
