import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { useToast } from '../hooks/use-toast';
import api from '../utils/api';
import { setToken, setCurrentUser } from '../utils/auth';
import { useAuth } from '../context/AuthProvider';

/**
 * SignIn page — 2-step flow:
 *   Step 1: user enters email + password → backend validates and sends OTP
 *   Step 2: user enters 6-digit OTP → backend returns JWT token
 *
 * // CHANGELOG REMINDER: Update CHANGELOG.md when modifying the sign-in flow.
 */

const SignIn = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { toast } = useToast();
  const { handleLogin } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Which step we are on: 'credentials' | 'otp'
  const [step, setStep] = useState('credentials');

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [otp, setOtp] = useState('');

  // ── Step 1: Submit credentials ──────────────────────────────────────────────
  const handleCredentialsSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/api/auth/login', formData);
      const data = response.data;

      if (data.token) {
        // OTP login disabled — backend returned token directly
        setToken(data.token);
        setCurrentUser(data.user);
        handleLogin(data.user);
        toast({ title: 'Success', description: 'Logged in successfully!' });
        navigate('/');
      } else {
        // OTP required — move to OTP entry step
        toast({
          title: 'Verification code sent',
          description: 'A 6-digit code has been sent to your email. It expires in 5 minutes.',
        });
        setStep('otp');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'Invalid email or password',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: Submit OTP ───────────────────────────────────────────────────────
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast({ title: 'Error', description: 'Please enter the 6-digit code.', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      const response = await api.post('/api/auth/verify-otp', { email: formData.email, otp });
      const { token, user } = response.data;
      setToken(token);
      setCurrentUser(user);
      handleLogin(user);
      toast({ title: 'Success', description: 'Logged in successfully!' });
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

  // ── Go back to credentials step ──────────────────────────────────────────────
  const handleBack = () => {
    setStep('credentials');
    setOtp('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        {step === 'credentials' ? (
          <>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">{t('auth.signInTitle')}</CardTitle>
              <CardDescription className="text-center">
                {t('auth.email')} &amp; {t('auth.password')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCredentialsSubmit} className="space-y-4">
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

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={loading}
                >
                  {loading ? t('common.loading') : t('auth.signInBtn')}
                </Button>
              </form>

              <div className="mt-4 text-center text-sm">
                <span className="text-gray-600">{t('auth.noAccount')} </span>
                <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
                  {t('auth.signUpBtn')}
                </Link>
              </div>
            </CardContent>
          </>
        ) : (
          <>
            <CardHeader className="space-y-1">
              <div className="flex justify-center mb-2">
                <ShieldCheck className="h-10 w-10 text-blue-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-center">Verify Your Identity</CardTitle>
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
                  <p className="text-xs text-gray-500 text-center">
                    The code expires in 5 minutes.
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={loading || otp.length !== 6}
                >
                  {loading ? 'Verifying…' : 'Verify & Sign In'}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={handleBack}
                  disabled={loading}
                >
                  ← Back
                </Button>
              </form>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
};

export default SignIn;
