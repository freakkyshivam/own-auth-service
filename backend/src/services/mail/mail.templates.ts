 

export function accountVerificationTemplate({
  name,
  otp,
}: {
  name?: string;
  otp: string;
}) {
  return {
    subject: "Verify your account – OTP code",
    text: `Your verification code is ${otp}.
This code will expire in 5 minutes.

If you did not request this, please ignore this email.`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2>Account Verification</h2>
        <p>Hello ${name ?? "User"},</p>
        <p>Your One-Time Password (OTP) for account verification is:</p>

        <div style="font-size: 24px; font-weight: bold; margin: 16px 0;">
          ${otp}
        </div>

        <p>This OTP is valid for <strong>5 minutes</strong>.</p>

        <p>If you did not request this verification, you can safely ignore this email.</p>

        <hr />
        <p style="font-size: 12px; color: #777;">
          This is an automated message. Please do not reply.
        </p>
      </div>
    `,
  };
}

export function welcomeTemplate({
  name,
}: {
  name?: string;
}) {
  return {
    subject: "Welcome to our platform 🎉",

    text: `Hello ${name ?? "User"},

Welcome! Your account has been successfully created.

We're excited to have you on board. You can now explore all features of our platform.

If you did not create this account, please contact our support team immediately.
`,

    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2>Welcome 🎉</h2>

        <p>Hello ${name ?? "User"},</p>

        <p>
          Your account has been <strong>successfully created</strong>.
          We're excited to have you on board!
        </p>

        <p>
          You can now explore all features and start using the platform right away.
        </p>

        <p>
          If you did not create this account, please contact our support team immediately.
        </p>

        <hr />

        <p style="font-size: 12px; color: #777;">
          This is an automated message. Please do not reply.
        </p>
      </div>
    `,
  };
}



export function passwordResetTemplate({
  name,
  otp,
}: {
  name?: string;
  otp: string;
}) {
  return {
    subject: "Password reset – OTP code",
     text: `Hello ${name ? ` ${name}` : "User"},

Your password reset OTP is ${otp}.
This code will expire in 5 minutes.

If you did not request this, please ignore this email.`,
     html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2>Password Reset</h2>

      <p>Hello ${name ? ` ${name}` : "User"},</p>

      <p>You requested to reset your password. Use the OTP below to proceed:</p>

      <div style="font-size: 24px; font-weight: bold; margin: 16px 0;">
        ${otp}
      </div>

      <p>This OTP is valid for <strong>5 minutes</strong>.</p>

      <p>If you did not request a password reset, you can safely ignore this email.</p>

      <hr />
      <p style="font-size: 12px; color: #777;">
        This is an automated message. Please do not reply.
      </p>
    </div>
  `,
  };
}

export function passwordResetAlertTemplate({
  name,
}: {
  name?: string;
}) {
  return {
    subject: "⚠️ Password Reset Successful",
    text: `Hello ${name ? name : "User"},

Your password has been successfully reset.

If you did not perform this action, please contact our support team immediately to secure your account.

This is an automated message. Please do not reply.`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #16a34a;">Password Reset Successful</h2>

        <p>Hello ${name ? name : "User"},</p>

        <p>
          Your password has been <strong>successfully reset</strong>.
          You can now log in using your new password.
        </p>

        <p>
          If you did <strong>not</strong> perform this action, please contact our
          support team immediately to protect your account.
        </p>

        <hr />

        <p style="font-size: 12px; color: #777;">
          This is an automated message. Please do not reply to this email.
        </p>
      </div>
    `,
  };
}

export function twoFactorEnableAlertTemplate({
  name,
}: {
  name?: string;
}) {
  return {
    subject: "🛡️ Two-Factor Authentication Enabled",
    text: `Hello ${name ? name : "User"},

Your account's Two-Factor Authentication (2FA) has been successfully enabled.

This adds an extra layer of security to your account. You will now need to provide both your password and a verification code from your authenticator app to sign in.

If you did not enable 2FA, please contact our support team immediately to secure your account.

This is an automated security message. Please do not reply.`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color:#16a34a;">Two-Factor Authentication Enabled</h2>

        <p>Hello ${name ? name : "User"},</p>

        <p>
          Your account's <strong>Two-Factor Authentication (2FA)</strong> has been
          <strong style="color:#16a34a;">successfully enabled</strong>.
        </p>

        <p>
          This adds an extra layer of security to your account. You will now need to provide both
          your password and a verification code from your authenticator app to sign in.
        </p>

        <div style="
          background-color: #f0fdf4;
          border-left: 4px solid #16a34a;
          padding: 16px;
          margin: 20px 0;
        ">
          <strong>Security Reminder:</strong> Keep your backup codes safe. You'll need them if you lose access to your authenticator app.
        </div>

        <p style="color:#dc2626;">
          If you did <strong>not</strong> enable 2FA, please contact our support team immediately.
        </p>

        <hr />

        <p style="font-size: 12px; color: #777;">
          This is an automated security message. Please do not reply.
        </p>
      </div>
    `,
  };
}

export function twoFactorDisableAlertTemplate({
  name,
}: {
  name?: string;
}) {
  return {
    subject: "⚠️ Two-Factor Authentication Disabled",
    text: `Hello ${name ? name : "User"},

Your account's Two-Factor Authentication (2FA) has been disabled.

Your account is now protected by password only. While this makes signing in easier, it reduces your account's security level.

If you did not disable 2FA, please re-enable it immediately and contact our support team.

This is an automated security message. Please do not reply.`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color:#dc2626;">Two-Factor Authentication Disabled</h2>

        <p>Hello ${name ? name : "User"},</p>

        <p>
          Your account's <strong>Two-Factor Authentication (2FA)</strong> has been
          <strong style="color:#dc2626;">disabled</strong>.
        </p>

        <p>
          Your account is now protected by password only. While this makes signing in easier,
          it reduces your account's security level.
        </p>

        <div style="
          background-color: #fef2f2;
          border-left: 4px solid #dc2626;
          padding: 16px;
          margin: 20px 0;
        ">
          <strong>Security Warning:</strong> Consider re-enabling 2FA to maintain the highest level of account security.
        </div>

        <p style="color:#dc2626;">
          If you did <strong>not</strong> disable 2FA, please re-enable it immediately and contact our support team.
        </p>

        <hr />

        <p style="font-size: 12px; color: #777;">
          This is an automated security message. Please do not reply.
        </p>
      </div>
    `,
  };
}

 

 export function generateNewBackupCodeVerifyOtpTemplate({
  otp,
  name,
}: {
  otp: string;
  name?: string;
}) {
  return {
    subject: "🔐 Verify OTP to Generate New Backup Codes",
    text: `Request to generate new backup codes 💻

Hello ${name ? name : "User"},

We received a request to generate new backup codes for your account.

To continue, please verify your identity using the One-Time Password (OTP) below:

OTP: ${otp}

This OTP is valid for a limited time. Do not share this code with anyone.

If you did not request new backup codes, please ignore this email or contact our support team immediately.

This is an automated security message. Please do not reply.`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color:#2563eb;">Verify OTP to Generate New Backup Codes</h2>

        <p>Hello ${name ? name : "User"},</p>

        <p>
          We received a request to <strong>generate new backup codes</strong> for your account.
        </p>

        <p>
          To proceed, please verify your identity using the One-Time Password (OTP) below:
        </p>

        <div style="
          background-color: #eff6ff;
          border-left: 4px solid #2563eb;
          padding: 16px;
          margin: 20px 0;
          font-size: 18px;
          font-weight: bold;
          letter-spacing: 2px;
          text-align: center;
        ">
          ${otp}
        </div>

        <p>
          This OTP is valid for a limited time. For your security, please do not share this code with anyone.
        </p>

        <p style="color:#dc2626;">
          If you did <strong>not</strong> request new backup codes, please ignore this email or contact our support team immediately.
        </p>

        <hr />

        <p style="font-size: 12px; color: #777;">
          This is an automated security message. Please do not reply.
        </p>
      </div>
    `,
  };
}


