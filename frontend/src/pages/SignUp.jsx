import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { useToast } from '../hooks/use-toast';
import api from '../utils/api';
import { setToken, setCurrentUser } from '../utils/auth';
import { useAuth } from '../context/AuthProvider';

const SignUp = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { toast } = useToast();
  const { handleLogin } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('form'); // 'form' | 'otp'
  const [otp, setOtp] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // ── Step 1: Submit registration form ────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    
    try {
      const response = await api.post('/api/auth/register', {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password
      });
      
      const data = response.data;

      if (data.otp_required) {
        // OTP signup enabled — move to OTP entry step
        toast({
          title: 'Verification code sent',
          description: 'A 6-digit code has been sent to your email. It expires in 5 minutes.',
        });
        setStep('otp');
      } else {
        // OTP disabled — account created immediately
        const { token, user } = data;
        setToken(token);
        setCurrentUser(user);
        handleLogin(user);
        toast({ title: 'Success', description: 'Account created successfully!' });
        navigate('/');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'Failed to create account',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: Verify OTP ───────────────────────────────────────────────────────
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast({ title: 'Error', description: 'Please enter the 6-digit code.', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      const response = await api.post('/api/auth/verify-signup-otp', {
        email: formData.email,
        otp,
      });
      const { token, user } = response.data;
      setToken(token);
      setCurrentUser(user);
      handleLogin(user);
      toast({ title: 'Success', description: 'Account created successfully!' });
      navigate('/');
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'Invalid or expired code. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        {step === 'otp' ? (
          <>
            <CardHeader className="space-y-1">
              <div className="flex justify-center mb-2">
                <ShieldCheck className="h-10 w-10 text-blue-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-center">Verify Your Email</CardTitle>
              <CardDescription className="text-center">
                Enter the 6-digit code sent to <strong>{formData.email}</strong>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleOtpSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp">Verification Code</Label>
                  <Input
                    id="otp"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]{6}"
                    maxLength={6}
                    placeholder="000000"
                    className="text-center text-2xl tracking-widest"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    required
                    autoFocus
                  />
                  <p className="text-xs text-gray-500 text-center">The code expires in 5 minutes.</p>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={loading || otp.length !== 6}
                >
                  {loading ? 'Verifying…' : 'Verify & Create Account'}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={() => { setStep('form'); setOtp(''); }}
                >
                  ← Back
                </Button>
              </form>
            </CardContent>
          </>
        ) : (
          <>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">{t('auth.signUpTitle')}</CardTitle>
              <CardDescription className="text-center">
                Sign up to start your visa application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">{t('auth.fullName')}</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="fullName"
                      type="text"
                      placeholder={t('auth.yourName')}
                      className="pl-10"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">{t('auth.email')}</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      className="pl-10"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">{t('auth.password')}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      className="pl-10 pr-10"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={loading}>
                  {loading ? t('common.loading') : t('auth.signUpBtn')}
                </Button>
              </form>

              <div className="mt-4 text-center text-sm">
                <span className="text-gray-600">{t('auth.hasAccount')} </span>
                <Link to="/signin" className="text-blue-600 hover:text-blue-700 font-medium">
                  {t('auth.signInBtn')}
                </Link>
              </div>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
};

export default SignUp;
