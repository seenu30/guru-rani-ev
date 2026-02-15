'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Input } from '@/components/atoms/Input';
import { Button } from '@/components/atoms/Button';
import { Mail, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/admin/reset-password`,
      });

      if (error) {
        setError(error.message);
        return;
      }

      setSuccess(true);
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-text-primary">Reset Password</h1>
            <p className="text-text-muted mt-2">
              Enter your email to receive a reset link
            </p>
          </div>

          {success ? (
            <div className="space-y-6">
              <div className="flex items-center gap-3 p-4 bg-green-50 text-green-700 rounded-lg">
                <CheckCircle className="h-5 w-5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Check your email</p>
                  <p className="text-sm mt-1">
                    We sent a password reset link to {email}
                  </p>
                </div>
              </div>
              <Link
                href="/admin/login"
                className="flex items-center justify-center gap-2 text-primary hover:text-primary/80"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="flex items-center gap-2 p-3 bg-error/10 text-error rounded-lg text-sm">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-text-primary">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@guruani.com"
                  leftElement={<Mail className="h-5 w-5" />}
                  required
                  disabled={isLoading}
                />
              </div>

              <Button type="submit" fullWidth isLoading={isLoading}>
                Send Reset Link
              </Button>

              <Link
                href="/admin/login"
                className="flex items-center justify-center gap-2 text-text-muted hover:text-text-primary text-sm"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to login
              </Link>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
