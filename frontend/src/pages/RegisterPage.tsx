
import { useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button';
import { Label } from '@radix-ui/react-label';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardHeader,
  CardDescription,
  CardContent,
  CardTitle,
  CardFooter
} from '@/components/ui/card';

import { 
Alert,
AlertDescription,

} from '@/components/ui/alert'

import { Eye, EyeOff, UserPlus,AlertCircle, CheckCircle2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom';
import { signupApi, verifyRegistrationOtpApi } from '@/api/authApi';

 

const signupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[a-z]/, "Must contain at least one lowercase letter")
    .regex(/[0-9]/, "Must contain at least one number")
    .regex(/[@$!%*?&#]/, "Must contain at least one special character"),
});

const verifyOtpSchema = z.object({
  otp: z.string().trim().length(6, "OTP must be exactly 6 digits")
})


type signupFormData = z.infer<typeof signupSchema>;
type verifyOtpFormData = z.infer<typeof verifyOtpSchema>;

const RegisterPage = () => {
  
 const [showPassword, setShowPassword] = useState(false);
 const [step, setStep] = useState<'REGISTER' | 'OTP'>('REGISTER')
 const [email, setEmail] = useState<string>("")
 const [error, setError] = useState<string>('');
 const [success, setSuccess] = useState<string>("");

  const navigate = useNavigate();

  const signupForm = useForm<signupFormData>({
  resolver: zodResolver(signupSchema)
})

const otpForm = useForm<verifyOtpFormData>({
  resolver: zodResolver(verifyOtpSchema)
})


  const onSubmit = async (values: signupFormData) => {
    setError('');
    setSuccess('');

    try {
      const result = await signupApi(values.name, values.email, values.password);

      if (!result.success){
        setError(result.msg || 'Registration failed');
        return;
      }

      setEmail(values.email);
      setSuccess(result.msg || 'Registration successful! Please verify your email.');
      setStep("OTP");
    } catch (error) {
      console.error('Registration error:', error);
      setError('Something went wrong. Please try again.');
    }
  }

 const verifyOtp = async (values: verifyOtpFormData) => {
  setError('');
  setSuccess('');

  try {
    const result = await verifyRegistrationOtpApi(email, values.otp);

    if (!result.success){
      setError(result.msg || 'OTP verification failed');
      return;
    }

    setSuccess('Account verified successfully! Redirecting to login...');
    setTimeout(() => {
      navigate("/login");
    }, 2000);
  } catch (error) {
    console.error('OTP verification error:', error);
    setError('Something went wrong. Please try again.');
  }
 }

  return (
  <section className="min-h-[90vh] flex flex-col items-center justify-center p-4 sm:p-6 md:p-8" id='register'>
  {/* Background Effects */}
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-48 h-48 sm:w-72 md:w-96 sm:h-72 md:h-96 bg-blue-600 rounded-full mix-blend-lighten filter blur-3xl opacity-20 animate-blob"></div>
    <div className="absolute top-20 sm:top-40 right-5 sm:right-20 w-48 h-48 sm:w-72 md:w-96 sm:h-72 md:h-96 bg-purple-600 rounded-full mix-blend-lighten filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
    <div className="absolute bottom-10 sm:bottom-20 left-1/4 sm:left-1/3 w-48 h-48 sm:w-72 md:w-96 sm:h-72 md:h-96 bg-pink-600 rounded-full mix-blend-lighten filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
    <div className="absolute top-1/2 right-1/4 w-40 h-40 sm:w-56 md:w-72 sm:h-56 md:h-72 bg-cyan-500 rounded-full mix-blend-lighten filter blur-3xl opacity-15 animate-blob animation-delay-3000"></div>
  </div>

  {/* Grid Pattern Overlay */}
  <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-size-[2rem_2rem] sm:bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>

  <Card className='w-full max-w-md z-50 bg-card/40 backdrop-blur-md'>
    <CardHeader className="space-y-1 px-4 sm:px-6">
      <div className="flex items-center gap-2">
        <div className="p-2 bg-green-100 rounded-lg">
          <UserPlus className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
        </div>
        <CardTitle className="text-xl sm:text-2xl">Create Account</CardTitle>
      </div>
      <CardDescription className="text-sm">Create a new account to get started</CardDescription>
    </CardHeader>

    <CardContent className="px-4 sm:px-6">
      {step === "REGISTER" ? (
        <form action="" method="post" onSubmit={signupForm.handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                {...signupForm.register("name")}
                className={`${signupForm.formState.errors.name ? "border-red-500" : ""} pr-10 focus-visible:ring-green-600 text-sm sm:text-base`}
              />
              {signupForm.formState.errors.name && (
                <p className="text-red-500 text-xs sm:text-sm">{signupForm.formState.errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...signupForm.register("email")}
                className={`${signupForm.formState.errors.email ? "border-red-500" : ""} pr-10 focus-visible:ring-green-600 text-sm sm:text-base`}
              />
              {signupForm.formState.errors.email && (
                <p className="text-red-500 text-xs sm:text-sm">{signupForm.formState.errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm">Password</Label>
              <div className="relative">
                <Input
                  id="signup-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...signupForm.register("password")}
                  className={`${signupForm.formState.errors.password ? "border-red-500" : ""} pr-10 focus-visible:ring-green-600 text-sm sm:text-base`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} className="sm:w-5 sm:h-5" /> : <Eye size={18} className="sm:w-5 sm:h-5" />}
                </button>
              </div>
              {signupForm.formState.errors.password && (
                <p className="text-red-500 text-xs sm:text-sm">{signupForm.formState.errors.password.message}</p>
              )}
            </div>

            {error && (
              <Alert variant="destructive" className='border-red-500 text-red-600'>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs sm:text-sm">{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type='submit'
              disabled={signupForm.formState.isSubmitting}
              className={`w-full bg-green-600 text-sm sm:text-base py-5 sm:py-6 ${
                signupForm.formState.isSubmitting
                  ? "cursor-not-allowed opacity-70"
                  : "cursor-pointer"
              }`}
            >
              {signupForm.formState.isSubmitting ? "Creating account..." : "Register"}
            </Button>
          </div>
        </form>
      ) : (
        <form onSubmit={otpForm.handleSubmit(verifyOtp)} method="post" className='space-y-4'>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              readOnly
              className="pr-10 focus-visible:ring-green-600 text-sm sm:text-base"
            /> 
          </div>

          <div className="space-y-2">
            <Label htmlFor="otp" className="text-sm">OTP</Label>
            <Input
              id="otp"
              type="text"
              {...otpForm.register("otp")}
              className={`${otpForm.formState.errors.otp ? "border-red-500" : ""} pr-10 focus-visible:ring-green-600 text-sm sm:text-base`}
            />
            {otpForm.formState.errors.otp && (
              <p className="text-red-500 text-xs sm:text-sm">{otpForm.formState.errors.otp.message}</p>
            )}
          </div>

          {error && (
            <Alert variant="destructive" className='border-red-500 text-red-600'>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs sm:text-sm">{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-500 text-green-600">
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription className="text-xs sm:text-sm">{success}</AlertDescription>
            </Alert>
          )}

          <Button
            type='submit'
            disabled={otpForm.formState.isSubmitting}
            className={`w-full bg-green-600 text-sm sm:text-base py-5 sm:py-6 ${
              otpForm.formState.isSubmitting
                ? "cursor-not-allowed opacity-70"
                : "cursor-pointer"
            }`}
          >
            {otpForm.formState.isSubmitting ? "Verifying OTP..." : "Verify OTP"}
          </Button>
        </form>
      )}
    </CardContent>

    <CardFooter className="px-4 sm:px-6">
      <p className="text-xs sm:text-sm text-gray-600">
        Already have an account?{' '}
        <button
          onClick={() => navigate('/login')}
          className="text-blue-600 hover:underline font-medium">
          Sign in
        </button>
      </p>
    </CardFooter>
  </Card>
</section>
  )
}

export default RegisterPage