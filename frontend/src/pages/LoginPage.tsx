import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@radix-ui/react-label';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import {
  Alert,
  AlertDescription,
} from '@/components/ui/alert';
import { Eye, EyeOff, LogIn, AlertCircle, CheckCircle2, Shield, Key, ArrowLeft, Smartphone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { loginApi } from '@/api/authApi';
import { useAuth } from '@/auth/useAuth';
import { verify2FALoginApi } from '@/api/authApi';

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
   password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    // .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    // .regex(/[a-z]/, "Must contain at least one lowercase letter")
    // .regex(/[0-9]/, "Must contain at least one number")
    // .regex(/[@$!%*?&#]/, "Must contain at least one special character"),
});

const twoFactorSchema = z.object({
  otp: z.string().length(6, "Must be exactly 6 digits").regex(/^\d+$/, "Must contain only numbers").optional().or(z.literal('')),
  backupcode: z.string().min(10, "Minimum 10 characters").optional().or(z.literal(''))
}).refine((data) => data.otp || data.backupcode, {
  message: "Please enter either OTP or Backup Code",
  path: ["otp"]
});

type LoginFormData = z.infer<typeof loginSchema>;
type TwoFactorFormData = z.infer<typeof twoFactorSchema>;

export default function LoginForm() {
  const [step, setStep] = useState<'LOGIN' | 'OTP'>('LOGIN');
  const [showPassword, setShowPassword] = useState(false);
  const [verificationType, setVerificationType] = useState<'OTP' | 'BACKUP'>('OTP');
  const { setUser } = useAuth();
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>("");

  const navigate = useNavigate();

  const loginForm = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });
  const twoFactorForm = useForm<TwoFactorFormData>({ resolver: zodResolver(twoFactorSchema) });

  const onSubmit = async (d: LoginFormData) => {
    setError('');
    try {
      const data = await loginApi(d.email, d.password);

      if (!data?.success) {
        setError(data?.msg);
        return;
      }

      if (data.twoFactorEnabled) {
        setStep('OTP');
        return;
      }

      setSuccess(`Welcome back ${data.user.name}`);
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem('accessToken',data.accessToken)
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
    }
  };

  const verifyCode = async (d: TwoFactorFormData) => {
    setError('');
    try {
     
      const code = d.backupcode || d.otp
      if(!code){
        setError('OTP or Backup code are required')
        return;
      }
      const data = await verify2FALoginApi(code, verificationType) 

      if (!data?.success) {
        setError(data?.msg);
        return;
      }
      setSuccess(`Welcome back ${data.user.name}`);
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem('accessToken',data.accessToken)
      localStorage.removeItem('tempToken')
      navigate("/dashboard");
     
    } catch (error) {
      setError('Verification failed. Please try again.');
      console.error(error);
    }
  };

  const handleBackToLogin = () => {
    setStep('LOGIN');
    twoFactorForm.reset();
    setError('');
    setSuccess('');
  };

  return (
    <section className="min-h-[90vh] flex flex-col items-center justify-center p-4" id="login">
   
      
      {/* Background Effects */}
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-48 h-48 sm:w-72 md:w-96 sm:h-72 md:h-96 bg-blue-600 rounded-full mix-blend-lighten filter blur-3xl opacity-20 animate-blob"></div>
    <div className="absolute top-20 sm:top-40 right-5 sm:right-20 w-48 h-48 sm:w-72 md:w-96 sm:h-72 md:h-96 bg-purple-600 rounded-full mix-blend-lighten filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
    <div className="absolute bottom-10 sm:bottom-20 left-1/4 sm:left-1/3 w-48 h-48 sm:w-72 md:w-96 sm:h-72 md:h-96 bg-pink-600 rounded-full mix-blend-lighten filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
    <div className="absolute top-1/2 right-1/4 w-40 h-40 sm:w-56 md:w-72 sm:h-56 md:h-72 bg-cyan-500 rounded-full mix-blend-lighten filter blur-3xl opacity-15 animate-blob animation-delay-3000"></div>
  </div>

  {/* Grid Pattern Overlay */}
  <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-size-[2rem_2rem] sm:bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>

      <Card className="w-full max-w-md relative bg-card/40 backdrop-blur-2xl">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              {step === 'LOGIN' ? (
                <LogIn className="h-5 w-5 text-blue-600" />
              ) : (
                <Shield className="h-5 w-5 text-blue-600" />
              )}
            </div>
            <CardTitle className="text-2xl">
              {step === 'LOGIN' ? 'Welcome Back' : 'Two-Factor Authentication'}
            </CardTitle>
          </div>
          <CardDescription>
            {step === 'LOGIN' 
              ? 'Enter your credentials to access your account' 
              : 'Enter the verification code from your authenticator app'}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Two-Factor Verification Step */}
          {step === 'OTP' ? (
            <div className="space-y-4">
              {/* Back Button */}
              <button
                onClick={handleBackToLogin}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to login
              </button>

              {/* Verification Type Tabs */}
              <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
                <button
                  type="button"
                  onClick={() => {
                    setVerificationType('OTP');
                    twoFactorForm.setValue('backupcode', '');
                    setError('');
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    verificationType === 'OTP'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  Authenticator App
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setVerificationType('BACKUP');
                    twoFactorForm.setValue('otp', '');
                    setError('');
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    verificationType === 'BACKUP'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Key className="w-4 h-4" />
                  Backup Code
                </button>
              </div>

              <div className="space-y-4">
                {verificationType === 'OTP' ? (
                  <div className="space-y-2">
                    <Label htmlFor="2fa-otp" className="text-sm font-medium">
                      6-Digit Code
                    </Label>
                    <div className="relative">
                      <Input
                        id="2fa-otp"
                        type="text"
                        maxLength={6}
                        placeholder="000000"
                        {...twoFactorForm.register("otp")}
                        className={`text-center text-2xl font-mono tracking-widest ${
                          twoFactorForm.formState.errors.otp ? "border-red-500" : ""
                        }`}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          twoFactorForm.setValue('otp', value);
                          setError('');
                        }}
                      />
                    </div>
                    {twoFactorForm.formState.errors.otp && (
                      <p className="text-red-500 text-sm flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {twoFactorForm.formState.errors.otp.message}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 text-center mt-2">
                      Open your authenticator app and enter the 6-digit code
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="backup-code" className="text-sm font-medium">
                      Backup Code
                    </Label>
                    <Input
                      id="backup-code"
                      type="text"
                      placeholder="XXXX-XXXX-XXXX"
                      {...twoFactorForm.register("backupcode")}
                      className={`text-center font-mono uppercase ${
                        twoFactorForm.formState.errors.backupcode ? "border-red-500" : ""
                      }`}
                      onChange={(e) => {
                        twoFactorForm.setValue('backupcode', e.target.value.toUpperCase());
                        setError('');
                      }}
                    />
                    {twoFactorForm.formState.errors.backupcode && (
                      <p className="text-red-500 text-sm flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {twoFactorForm.formState.errors.backupcode.message}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 text-center mt-2">
                      Enter one of your backup codes saved during 2FA setup
                    </p>
                  </div>
                )}

                {error && (
                  <Alert variant="destructive" className="border-red-500 text-red-600">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="border-green-500 text-green-600">
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertDescription>{success}</AlertDescription>
                  </Alert>
                )}

                <Button
                  onClick={twoFactorForm.handleSubmit(verifyCode)}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={twoFactorForm.formState.isSubmitting}
                >
                  {twoFactorForm.formState.isSubmitting ? (
                    <>
                      <span className="inline-block animate-spin mr-2">⏳</span>
                      Verifying...
                    </>
                  ) : (
                    'Verify & Continue'
                  )}
                </Button>
              </div>

              {/* Help Text */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center">
                  Lost access to your authenticator app?{' '}
                  <button 
                    onClick={() => setVerificationType('BACKUP')}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Use a backup code
                  </button>
                </p>
              </div>
            </div>
          ) : (
            /* Login Step */
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="you@example.com"
                  {...loginForm.register("email")}
                  className={loginForm.formState.errors.email ? "border-red-500" : ""}
                />
                {loginForm.formState.errors.email && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {loginForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-password">Password</Label>
                <div className="relative">
                  <Input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...loginForm.register("password")}
                    className={loginForm.formState.errors.password ? "border-red-500 pr-10" : "pr-10"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(prev => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {loginForm.formState.errors.password && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {loginForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              {error && (
                <Alert variant="destructive" className="border-red-500 text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="border-green-500 text-green-600">
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              <Button
                onClick={loginForm.handleSubmit(onSubmit)}
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={loginForm.formState.isSubmitting}
              >
                {loginForm.formState.isSubmitting ? "Logging in..." : "Login"}
              </Button>
            </div>
          )}
        </CardContent>

        {step === 'LOGIN' && (
          <CardFooter className="flex flex-col gap-2">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <button onClick={() => navigate('/register')} className="text-blue-600 hover:underline font-medium">
                Sign up
              </button>
            </p>
            <a onClick={()=> navigate('/reset-password')} className="text-sm text-blue-600 hover:underline">
              Forgot password?
            </a>
          </CardFooter>
        )}
      </Card>
    </section>
  );
}