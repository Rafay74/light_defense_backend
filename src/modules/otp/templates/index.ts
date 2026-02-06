export const emailTemplateForOTP = (otp_code: number) => {
  return ` 
 <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #2c3e50; margin-top: 0;">Your OTP Code</h2>
              <p>Your One-Time Password (OTP) code is:</p>
              <div style="background-color: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0; border-radius: 5px; border: 2px solid #ddd;">
                <h1 style="color: #2c3e50; margin: 0; font-size: 32px; letter-spacing: 5px; font-weight: bold;">${otp_code}</h1>
              </div>
              <p>This code will expire in <strong>15 minutes</strong>.</p>
              <p style="color: #666; font-size: 12px; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
                If you didn't request this code, please ignore this email.
              </p>
            </div>
          </body>
        </html>`;
};
