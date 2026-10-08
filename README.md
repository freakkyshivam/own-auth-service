# Authify — Authentication Infrastructure for Developers

> **Domain:** [authify.in](https://authify.in)  
> **Tagline:** Authentication infrastructure for developers.

Authify provides secure authentication building blocks so developers can focus on their products instead of rebuilding auth from scratch. Built with a security-first design implementing passwordless OTP login, session management, refresh token rotation, and device-aware session control.

> The current focus is on **real-world auth problems** like OTP abuse, session hijacking, replay prevention, and multi-device control.

---

## 🚀 Live Demo & Documentation
- **Frontend App:** <https://otpbasedauth.vercel.app/> ([authify.in](https://authify.in))
- **Backend API (Render):** <https://otp-based-auth-system.onrender.com>
- **Postman API Documentation:** <https://documenter.getpostman.com/view/47278131/2sBXVbGDPJ>

*Note: Free-tier hosting on Render may experience a cold-start delay on the initial request.*

---

## 🔐 Core Implemented Features (Working Today)

- **Email OTP Authentication:** High-entropy OTPs with Redis expiry (5-minute TTL) & attempt bounding.
- **Redis-Backed OTP Storage:** OTPs are stored strictly in Redis with automatic TTL expiration.
- **JWT Access & Refresh Token Flow:** Short-lived access tokens paired with rotated refresh tokens.
- **Refresh Token Rotation:** Automatically revokes and rotates refresh tokens upon renewal to prevent replay attacks.
- **Session Management with Device & IP Tracking:** Inspect browser, platform, and IP metadata for every active session.
- **Granular Session Revocation:** Terminate individual sessions or revoke all other remote sessions instantly.
- **Secure Cookies:** Production-ready `httpOnly`, `sameSite`, and secure cookies isolating tokens from XSS.
- **Rate Limiting:** Sliding-window Redis rate limiters to prevent OTP brute-forcing and email exhaustion.
- **Queued Email Delivery:** Asynchronous mail processing queue for fast and non-blocking OTP delivery.
- **TOTP Two-Factor Authentication:** Standard RFC 6238 TOTP compatible with Google Authenticator, Microsoft Authenticator, and Authy.
- **Argon2-Hashed Backup Codes:** Single-use emergency recovery codes.
- **Clean Monorepo Separation:** Decoupled backend and frontend architecture.

---

## 🧭 Product Roadmap ("Built to become your authentication layer")

Authify is evolving into a comprehensive developer-first identity infrastructure platform:

- **OAuth & Social Logins** *(Roadmap)*: Sign-in with Google, GitHub, Apple, and custom OIDC providers.
- **Developer SDKs** *(Coming soon)*: Lightweight packages for React, Next.js, Node.js, Python, and Go.
- **Authentication Dashboard** *(Coming soon)*: Dedicated developer portal for tenant management, user search, and audit logs.
- **Multi-Tenant MFA & Passkeys** *(Roadmap)*: WebAuthn, FIDO2 biometric keys, and SMS fallbacks alongside RFC TOTP.
- **Organizations & Multi-Tenancy** *(Roadmap)*: Team workspaces, member invites, domain-level routing, and tenant isolation.
- **Role-Based Access Control (RBAC)** *(Roadmap)*: Granular permission hierarchies and authorization middleware.
- **Webhooks & Event Stream** *(Roadmap)*: Signed real-time webhook events for user signups, logins, and revocations.

---

## 🧠 Authentication Flow (High Level)

1. **User requests OTP:** Client submits email.
2. **OTP Generation:** 6-digit cryptographic OTP stored in Redis with 5-minute TTL.
3. **Queued Email Dispatch:** Email worker delivers OTP asynchronously via SMTP.
4. **OTP Verification:** User submits OTP; validated against Redis with attempt counting.
5. **Session & Tokens:** Access token + refresh token issued, session record created with IP and device metadata.
6. **Token Rotation:** Refresh token rotation on renewal automatically invalidates prior refresh tokens.

---

## 🛡️ Security Decisions (WHY, not WHAT)

- **Redis for OTPs:**  
  OTPs are temporary secrets — storing them in DB is slow and unnecessary.
- **Refresh Token Rotation:**  
  Prevents replay attacks if a refresh token leaks.
- **Session Table with Device Info:**  
  Enables session visibility, selective logout, and anomaly detection.
- **httpOnly Cookies:**  
  Protects tokens from XSS attacks.
- **Rate Limiting:**  
  Stops OTP brute-force and email abuse.

---

## 🧱 Tech Stack

### Backend
- Node.js + TypeScript
- Express
- Redis (ioredis / node-redis)
- JWT
- Drizzle ORM
- PostgreSQL
- Nodemailer + BullMQ
- Docker (local setup)

### Frontend
- React 19 + TypeScript
- Vite
- Tailwind CSS
- Shadcn UI
- Lucide React
- Axios & React Router

### Deployment
- Backend: **Render**
- Frontend: **Vercel**

---

<<<<<<< HEAD
## ℹ️ History
This project was started around November 2025 as a security-first OTP authentication system and has been positioned and rebranded as **Authify** ([authify.in](https://authify.in)).
=======
## Roadmap (V2 — Starting September 2026)

- OAuth provider support for third-party apps (login with this service)
- API key generation for organizations
- Multi-tenant architecture for using this as an auth-as-a-service
- Webhook support for auth events
- Admin dashboard for organization management
 

---
## ℹ️ This project was migrated from an earlier repository. Commit history prior to migration is not available here.

 

>>>>>>> 89e27523075a945c8b7d36e5ae4686fc2e26014f
