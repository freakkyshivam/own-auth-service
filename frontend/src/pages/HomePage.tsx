import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
  Shield,
  Zap,
  Lock,
  ChevronRight,
  Github,
  Twitter,
  Linkedin,
  ShieldCheck,
  FileKey,
  Users,
  MonitorSmartphone,
  ArrowRight,
  Sparkles,
  Key,
  Clock,
  Smartphone,
  QrCode,
  RotateCw,
  Terminal,
  Code2,
  Copy,
  Check,
  Layers,
  Network,
  Cpu,
  ArrowUpRight,
} from 'lucide-react';
import { FaDiscord } from 'react-icons/fa';
import { useAuth } from '@/auth/useAuth';
import { type User } from '@/types/types';
import { getLocalUser } from '@/utils/getLocalUser';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [activeCodeTab, setActiveCodeTab] = useState<'sdk' | 'curl'>('sdk');

  const navigate = useNavigate();
  const { user } = useAuth();
  const UserInfo: User | null = user ?? getLocalUser();

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 8);
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  // 100% Truthful: Only features that are actually implemented in the codebase
  const implementedFeatures = [
    {
      icon: Shield,
      title: 'Email OTP Authentication',
      description:
        'Time-based one-time passwords stored in Redis with 5-minute TTL, strict attempt limits, and brute-force throttling.',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: ShieldCheck,
      title: 'Passwordless & Email Verification',
      description:
        'Email-verified onboarding with async queue-driven delivery to keep registration response times low.',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: RotateCw,
      title: 'Refresh Token Rotation',
      description:
        'JWT access and refresh token lifecycle. Automatically invalidates reused or expired refresh tokens to neutralize replay attacks.',
      color: 'from-fuchsia-500 to-purple-500',
    },
    {
      icon: MonitorSmartphone,
      title: 'Device-Aware Session Management',
      description:
        'Tracks client IP, browser, and OS metadata for every login. Inspect active sessions and terminate remote devices on demand.',
      color: 'from-teal-500 to-sky-500',
    },
    {
      icon: Smartphone,
      title: 'TOTP Two-Factor Authentication',
      description:
        'Standard RFC 6238 time-based 2FA compatible with Google Authenticator, Microsoft Authenticator, and Authy.',
      color: 'from-rose-500 to-orange-500',
    },
    {
      icon: FileKey,
      title: 'Argon2 Backup Codes',
      description:
        'Single-use emergency recovery codes securely hashed with Argon2 if an authenticator device is lost.',
      color: 'from-yellow-500 to-amber-500',
    },
    {
      icon: Zap,
      title: 'Redis-Backed Rate Limiting',
      description:
        'Sliding-window rate limiters protecting against brute-force attacks and email exhaustion on all auth endpoints.',
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: Lock,
      title: 'Secure Session Cookies',
      description:
        'Production-safe httpOnly, sameSite, secure cookie settings preventing XSS and cross-site token leakage.',
      color: 'from-purple-500 to-pink-500',
    },
  ];

  // Architectural highlights based on actual implementation
  const technicalHighlights = [
    { label: 'Primary Auth', value: 'Email OTP', icon: Shield },
    { label: 'Token Lifecycle', value: 'JWT + Rotation', icon: RotateCw },
    { label: 'Session Store', value: 'Redis Cached', icon: Zap },
    { label: 'Device Control', value: 'IP & Agent Aware', icon: MonitorSmartphone },
  ];

  // Roadmap & Future Direction (clearly labeled as Coming Soon / Roadmap)
  const roadmapItems = [
    {
      title: 'OAuth & Social Logins',
      status: 'Roadmap',
      description: 'Single-click authentication with Google, GitHub, Apple, and custom OpenID Connect providers.',
      badgeColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
      icon: Network,
    },
    {
      title: 'Developer SDKs',
      status: 'Coming soon',
      description: 'First-party lightweight libraries for React, Next.js, Node.js, Python, and Go.',
      badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      icon: Code2,
    },
    {
      title: 'Authentication Dashboard',
      status: 'Coming soon',
      description: 'Dedicated developer console for tenant metrics, user inspection, and security policies.',
      badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      icon: Layers,
    },
    {
      title: 'Multi-Tenant MFA',
      status: 'Roadmap',
      description: 'Passkeys, WebAuthn/FIDO2 hardware keys, and SMS fallbacks alongside RFC TOTP.',
      badgeColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
      icon: Key,
    },
    {
      title: 'Organizations & Multi-Tenancy',
      status: 'Roadmap',
      description: 'Team workspaces, member invitations, role delegation, and domain-level tenant routing.',
      badgeColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
      icon: Users,
    },
    {
      title: 'Role-Based Access Control (RBAC)',
      status: 'Roadmap',
      description: 'Fine-grained permissions, custom application roles, and declarative route guard middleware.',
      badgeColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
      icon: Shield,
    },
    {
      title: 'Webhooks & Event Stream',
      status: 'Roadmap',
      description: 'Signed real-time webhook deliveries for user registration, login attempts, and session revocations.',
      badgeColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
      icon: Cpu,
    },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const pattern = useMemo(
    () =>
      Array.from({ length: 64 }, () =>
        Math.random() > 0.5 ? 'bg-gray-900' : 'bg-white'
      ),
    []
  );

  const [demoCode] = useState(() =>
    Math.floor(100000 + Math.random() * 900000).toString()
  );

  const sdkSnippet = `// Conceptual SDK Preview (Roadmap)
import { Authify } from '@authify/node';

const authify = new Authify({
  secretKey: process.env.AUTHIFY_SECRET_KEY
});

// Authenticate session & retrieve verified user
const user = await authify.users.get(userId);`;

  const curlSnippet = `# Live REST API (Available Now)
# Verify registration OTP
curl -X POST https://otp-based-auth-system.onrender.com/api/auth/register/verify-otp \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "developer@authify.in",
    "otp": "481920"
  }'`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-950 via-gray-900 to-black text-white overflow-hidden">
      {/* Hero Section */}
      <div className="relative">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-48 h-48 sm:w-72 md:w-96 sm:h-72 md:h-96 bg-blue-600 rounded-full mix-blend-lighten filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-20 sm:top-40 right-5 sm:right-20 w-48 h-48 sm:w-72 md:w-96 sm:h-72 md:h-96 bg-purple-600 rounded-full mix-blend-lighten filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-10 sm:bottom-20 left-1/4 sm:left-1/3 w-48 h-48 sm:w-72 md:w-96 sm:h-72 md:h-96 bg-pink-600 rounded-full mix-blend-lighten filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
          <div className="absolute top-1/2 right-1/4 w-40 h-40 sm:w-56 md:w-72 sm:h-56 md:h-72 bg-cyan-500 rounded-full mix-blend-lighten filter blur-3xl opacity-15 animate-blob animation-delay-3000"></div>
        </div>

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-size-[2rem_2rem] sm:bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>

        <div className="relative max-w-7xl mx-auto flex flex-col items-center justify-center text-center py-20 md:py-36 px-6">
          <div
            className={`inline-block mb-6 transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'
            }`}
          >
            <span className="px-4 py-2 bg-linear-to-r from-blue-600/20 to-purple-600/20 text-blue-300 rounded-full text-sm font-semibold border border-blue-500/30 inline-flex items-center gap-2 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 animate-pulse text-blue-400" />
              Authify • authify.in
            </span>
          </div>

          <h1
            className={`text-5xl sm:text-6xl md:text-8xl font-black mb-8 tracking-tight transition-all duration-1000 delay-150 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'
            }`}
          >
            <span className="bg-linear-to-r from-white via-blue-100 to-indigo-200 bg-clip-text text-transparent">
              Authentication infrastructure
            </span>
            <br />
            <span className="bg-linear-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent animate-gradient">
              for developers.
            </span>
          </h1>

          <p
            className={`text-lg sm:text-xl md:text-2xl text-gray-300 max-w-3xl mb-12 leading-relaxed transition-all duration-1000 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'
            }`}
          >
            Authify provides secure authentication building blocks so developers can focus on their products instead of rebuilding auth from scratch.
          </p>

          <div
            className={`flex flex-wrap gap-4 justify-center mb-16 transition-all duration-1000 delay-500 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'
            }`}
          >
            {UserInfo ? (
              <Button
                size="lg"
                onClick={() => handleNavigation('/dashboard')}
                className="bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 transition-all duration-300 text-lg px-10 py-6 group border border-blue-400/20 cursor-pointer"
              >
                Open Dashboard
                <ChevronRight className="ml-2 h-6 w-6 group-hover:translate-x-2 transition-transform" />
              </Button>
            ) : (
              <Button
                size="lg"
                onClick={() => handleNavigation('/register')}
                className="bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 transition-all duration-300 text-lg px-10 py-6 group border border-blue-400/20 cursor-pointer"
              >
                Try Authify
                <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-2 transition-transform" />
              </Button>
            )}
            <Button
              onClick={() =>
                (window.location.href =
                  'https://documenter.getpostman.com/view/47278131/2sBXVbGDPJ')
              }
              size="lg"
              className="bg-white/5 backdrop-blur-sm border-2 border-white/10 text-white hover:bg-white/10 hover:border-white/20 hover:scale-105 transition-all duration-300 text-lg px-10 py-6 shadow-xl cursor-pointer"
            >
              View Documentation
              <ArrowUpRight className="ml-2 h-5 w-5 text-gray-400" />
            </Button>
          </div>

          {/* Technical Architecture Highlights */}
          <div
            className={`grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 w-full max-w-5xl transition-all duration-1000 delay-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            {technicalHighlights.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="bg-linear-to-br from-white/5 to-white/0 backdrop-blur-sm border border-white/10 rounded-2xl p-5 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300 group text-left"
                >
                  <Icon className="h-6 w-6 text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
                  <div className="text-xl md:text-2xl font-bold bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-1 font-mono">
                    {stat.value}
                  </div>
                  <div className="text-xs md:text-sm text-gray-400">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Developer-First Code Section */}
      <div className="relative max-w-6xl mx-auto px-6 py-20">
        <div className="bg-linear-to-br from-gray-900/90 via-gray-900/60 to-black/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-white/10 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs font-mono font-semibold border border-blue-500/20 mb-3">
                <Terminal className="h-3.5 w-3.5" />
                Developer-First Architecture
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                Clean integration. Minimal friction.
              </h2>
              <p className="text-sm md:text-base text-gray-400 mt-1 max-w-xl">
                Authify is architected for clean developer integration. Check our upcoming SDK interface design alongside our current live REST API endpoints.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start md:self-auto bg-black/40 p-1 rounded-xl border border-white/10">
              <button
                onClick={() => setActiveCodeTab('sdk')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeCodeTab === 'sdk'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Conceptual SDK (Roadmap)
              </button>
              <button
                onClick={() => setActiveCodeTab('curl')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeCodeTab === 'curl'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Live REST API (Available Now)
              </button>
            </div>
          </div>

          <div className="relative bg-black/60 rounded-2xl border border-white/10 p-5 font-mono text-xs sm:text-sm overflow-x-auto shadow-inner">
            <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-4 text-xs text-gray-400">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block"></span>
                <span className="ml-2 font-mono text-gray-400 text-[11px]">
                  {activeCodeTab === 'sdk' ? 'app/auth.ts — Conceptual Preview' : 'curl-test.sh — Live Endpoint'}
                </span>
              </div>
              <button
                onClick={() =>
                  copyToClipboard(
                    activeCodeTab === 'sdk' ? sdkSnippet : curlSnippet
                  )
                }
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 text-gray-300 text-xs transition-colors"
                title="Copy code"
              >
                {copiedSnippet ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-green-400" />
                    <span className="text-green-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            <pre className="text-gray-200 leading-relaxed font-mono">
              <code>{activeCodeTab === 'sdk' ? sdkSnippet : curlSnippet}</code>
            </pre>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-gray-400">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse"></span>
              {activeCodeTab === 'sdk'
                ? 'Conceptual SDK design for future packages. Full specification in progress.'
                : 'Current production-ready REST API running on Express, Redis, and PostgreSQL.'}
            </span>
            <a
              href="https://documenter.getpostman.com/view/47278131/2sBXVbGDPJ"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 inline-flex items-center gap-1 group font-sans"
            >
              Browse complete Postman documentation
              <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </div>

      {/* Current Features Section (100% Implemented) */}
      <div id="features" className="relative max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <span className="px-4 py-2 bg-linear-to-r from-blue-600/20 to-cyan-600/20 text-blue-300 rounded-full text-sm font-semibold border border-blue-500/30 inline-flex items-center gap-2 backdrop-blur-sm mb-6">
            <Shield className="h-4 w-4" />
            Live in Current Implementation
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 bg-linear-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Authentication primitives
            <br />
            built and working today.
          </h2>
          <p className="text-gray-400 text-lg sm:text-xl max-w-3xl mx-auto">
            These core security building blocks are implemented, tested, and actively functioning in the Authify codebase.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {implementedFeatures.map((feature, index) => {
            const Icon = feature.icon;
            const isActive = activeFeature === index;

            return (
              <div
                key={index}
                className={`group relative border-2 rounded-2xl p-6 bg-linear-to-br from-white/5 to-white/0 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 cursor-pointer ${
                  isActive
                    ? 'border-blue-500 shadow-2xl shadow-blue-500/30 scale-102 bg-linear-to-br from-blue-600/10 to-purple-600/10'
                    : 'border-white/10 hover:border-blue-500/50 hover:scale-102'
                }`}
                onMouseEnter={() => setActiveFeature(index)}
              >
                <div
                  className={`absolute inset-0 bg-linear-to-br ${feature.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500`}
                ></div>

                <div className="relative">
                  <div
                    className={`inline-block p-4 bg-linear-to-br ${feature.color} rounded-xl mb-5 group-hover:scale-110 transition-all duration-300 shadow-md`}
                  >
                    <Icon className="h-7 w-7 text-white" />
                  </div>

                  <h3 className="text-xl font-bold mb-3 text-white group-hover:text-blue-400 transition-colors duration-300">
                    {feature.title}
                  </h3>

                  <p className="text-gray-400 leading-relaxed text-sm">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Authenticator App & OTP Interactive Visual Section */}
      <div id="demo" className="relative max-w-7xl mx-auto px-6 py-20">
        <div className="bg-linear-to-br from-purple-900/20 via-blue-900/20 to-cyan-900/20 backdrop-blur-xl border-2 border-white/10 rounded-3xl p-8 md:p-14 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>

          <div className="relative grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-r from-green-600/20 to-emerald-600/20 text-green-300 rounded-full text-sm font-semibold border border-green-500/30 mb-6">
                <Smartphone className="h-4 w-4" />
                Working Verification Flow
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-6 bg-linear-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Email OTP & TOTP
                <br />
                two-factor verification.
              </h2>
              <p className="text-gray-300 text-base md:text-lg mb-8 leading-relaxed">
                Test Authify&apos;s real authentication engine. Register with your email to receive a verified one-time password, or configure TOTP two-factor authentication inside your dashboard.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
                  <QrCode className="h-6 w-6 text-blue-400 shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-white mb-1">Standard TOTP Provisioning</h4>
                    <p className="text-sm text-gray-400">
                      Compatible with Google Authenticator, Microsoft Authenticator, and Authy.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
                  <Clock className="h-6 w-6 text-purple-400 shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-white mb-1">Strict Redis Expiry</h4>
                    <p className="text-sm text-gray-400">
                      Temporary verification tokens expire automatically with attempt bounding.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
                  <Key className="h-6 w-6 text-green-400 shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-white mb-1">Single-Use Backup Codes</h4>
                    <p className="text-sm text-gray-400">
                      Argon2-hashed recovery codes ensure account access even if mobile devices are unavailable.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  onClick={() => handleNavigation('/register')}
                  className="bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-xl shadow-green-500/30 hover:scale-105 transition-all duration-300 text-lg px-8 cursor-pointer"
                >
                  Test Live Registration
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => handleNavigation('/login')}
                  className="bg-white/5 border-white/10 hover:bg-white/10 text-white text-lg px-8 cursor-pointer"
                >
                  Sign In
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="bg-linear-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-xl border-2 border-white/20 rounded-3xl p-8 shadow-2xl">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6">
                  <div className="bg-white rounded-xl p-4 mb-4">
                    <div className="grid grid-cols-8 gap-2">
                      {pattern.map((color, i) => (
                        <div
                          key={i}
                          className={`aspect-square rounded ${color}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-center text-xs text-gray-400 font-mono">
                    Authify 2FA QR code preview
                  </p>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">
                    <div className="text-3xl font-mono font-bold tracking-wider text-white">
                      {demoCode}
                    </div>
                    <Clock className="h-5 w-5 text-blue-400 animate-pulse" />
                  </div>
                  <p className="text-xs text-gray-400 mt-3 font-mono">
                    30-second rolling TOTP simulation
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Direction / Roadmap Section */}
      <div id="roadmap" className="relative max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <span className="px-4 py-2 bg-linear-to-r from-purple-600/20 to-pink-600/20 text-purple-300 rounded-full text-sm font-semibold border border-purple-500/30 inline-flex items-center gap-2 backdrop-blur-sm mb-6">
            <Layers className="h-4 w-4" />
            Product Roadmap
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 bg-linear-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Built to become your authentication layer.
          </h2>
          <p className="text-gray-400 text-lg sm:text-xl max-w-3xl mx-auto">
            Authify is scaling from core OTP and session primitives into a complete developer identity infrastructure. Here is what is on our roadmap:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roadmapItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="bg-linear-to-br from-white/5 to-white/0 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-purple-500/40 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white/5 rounded-xl border border-white/10 group-hover:border-purple-500/30 transition-colors">
                      <Icon className="h-6 w-6 text-purple-400" />
                    </div>
                    <span
                      className={`text-xs font-mono font-medium px-2.5 py-1 rounded-full border ${item.badgeColor}`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-sm text-gray-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-white/5 flex items-center text-xs text-gray-500 font-mono">
                  <span>Planned capability</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <footer className="relative border-t border-white/10 bg-linear-to-b from-transparent to-black/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-linear-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/30">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-2xl bg-linear-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                    Authify
                  </span>
                  <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 border border-blue-500/20 px-1.5 py-0.5 rounded">
                    authify.in
                  </span>
                </div>
              </div>
              <p className="text-gray-300 font-medium text-base mb-2">
                Authify — Authentication infrastructure for developers.
              </p>
              <p className="text-gray-400 text-sm max-w-md leading-relaxed">
                Secure, developer-first authentication and identity building blocks. Built with Redis, PostgreSQL, and token rotation.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-white text-base">Navigation & Demo</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li>
                  <button
                    onClick={() => handleNavigation('/register')}
                    className="hover:text-blue-400 transition-colors flex items-center gap-2 group text-left cursor-pointer"
                  >
                    Try Authify Demo{' '}
                    <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigation('/login')}
                    className="hover:text-blue-400 transition-colors flex items-center gap-2 group text-left cursor-pointer"
                  >
                    Sign In{' '}
                    <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </li>
                <li>
                  <a
                    href="https://documenter.getpostman.com/view/47278131/2sBXVbGDPJ"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-400 transition-colors flex items-center gap-2 group"
                  >
                    API Documentation{' '}
                    <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-white text-base">Developer & Contact</h4>
              <div className="flex gap-3 mb-4">
                <a
                  href="https://github.com/freakkyshivam"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-linear-to-br from-white/5 to-white/0 backdrop-blur-sm border border-white/10 rounded-xl hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/20 text-gray-400 hover:text-blue-400 transition-all duration-300 hover:scale-105 group"
                  aria-label="GitHub profile"
                >
                  <Github className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                </a>
                <a
                  href="https://x.com/freakkyshivam"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-linear-to-br from-white/5 to-white/0 backdrop-blur-sm border border-white/10 rounded-xl hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/20 text-gray-400 hover:text-blue-400 transition-all duration-300 hover:scale-105 group"
                  aria-label="Twitter X profile"
                >
                  <Twitter className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                </a>
                <a
                  href="https://discord.com/users/freakkyshivam"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-linear-to-br from-white/5 to-white/0 backdrop-blur-sm border border-white/10 rounded-xl hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/20 text-gray-400 hover:text-blue-400 transition-all duration-300 hover:scale-105 group"
                  aria-label="Discord profile"
                >
                  <FaDiscord className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                </a>
                <a
                  href="https://www.linkedin.com/in/freakkyshivam"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-linear-to-br from-white/5 to-white/0 backdrop-blur-sm border border-white/10 rounded-xl hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/20 text-gray-400 hover:text-blue-400 transition-all duration-300 hover:scale-105 group"
                  aria-label="LinkedIn profile"
                >
                  <Linkedin className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                </a>
              </div>
              <p className="text-xs text-gray-400">
                Contact: Reach out on{' '}
                <a
                  href="https://x.com/freakkyshivam"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  X (@freakkyshivam)
                </a>{' '}
                or LinkedIn.
              </p>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
            <p>© 2025–2026 Authify. All rights reserved.</p>
            <p className="font-mono text-gray-400">authify.in</p>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-3000 {
          animation-delay: 3s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default HomePage;
