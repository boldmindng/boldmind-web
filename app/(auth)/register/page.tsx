'use client';

import { useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Link from 'next/link';
import { useRegister } from '../../../lib/hooks';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.boldmind.ng';

const brand = {
  primary:   'var(--product-primary)',
  secondary: 'var(--product-secondary)',
  fg:        'var(--product-foreground)',
} as const;

// ─── Password strength ────────────────────────────────────────────────────────

function getPasswordStrength(password: string) {
  let strength = 0;
  if (password.length >= 8)          strength++;
  if (/[A-Z]/.test(password))        strength++;
  if (/[a-z]/.test(password))        strength++;
  if (/[0-9]/.test(password))        strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;
  return {
    score: strength,
    label:
      strength === 0 ? '' :
      strength <= 2  ? 'Weak' :
      strength <= 3  ? 'Fair' :
      strength <= 4  ? 'Good' : 'Strong',
    barColor:
      strength === 0 ? 'bg-white/10'  :
      strength <= 2  ? 'bg-red-500'   :
      strength <= 3  ? 'bg-yellow-500' :
      strength <= 4  ? 'bg-blue-500'  : 'bg-green-500',
    textColor:
      strength <= 2  ? '#f87171' :
      strength <= 3  ? '#facc15' : '#4ade80',
  };
}

// ─── Eye icons ────────────────────────────────────────────────────────────────

function EyeOff() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  );
}

function EyeOn() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function RegisterContent() {
  const router           = useRouter();
  const registerMutation = useRegister();

  const [formData, setFormData] = useState({
    fullName:            '',
    email:               '',
    password:            '',
    confirmPassword:     '',
    agreeTerms:          false,
    subscribeNewsletter: true,
  });
  const [showPassword,        setShowPassword]        = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors,              setErrors]              = useState<Record<string, string>>({});

  const passwordStrength = getPasswordStrength(formData.password);
  const isLoading        = registerMutation.loading;

  const loginWithGoogle = () => {
    const url = new URL(`${API_URL}/auth/google`);
    url.searchParams.set('redirect', `${window.location.origin}/dashboard`);
    window.location.href = url.toString();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    registerMutation.reset();
  };

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    if (!formData.fullName.trim())
      next['fullName'] = 'Full name is required';
    if (!formData.email.trim())
      next['email'] = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      next['email'] = 'Please enter a valid email';
    if (!formData.password)
      next['password'] = 'Password is required';
    else if (formData.password.length < 8)
      next['password'] = 'Password must be at least 8 characters';
    if (formData.password !== formData.confirmPassword)
      next['confirmPassword'] = 'Passwords do not match';
    if (!formData.agreeTerms)
      next['agreeTerms'] = 'You must agree to the terms';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const [firstName, ...rest] = formData.fullName.trim().split(' ');
    const lastName = rest.join(' ') || undefined;

    const result = await registerMutation.execute({
      email:    formData.email,
      password: formData.password,
      firstName,
      lastName,
    });

    if (result) {
      toast.success('Account created! Please check your email.');
      router.push(`/verify-email?email=${encodeURIComponent(formData.email)}`);
    } else if (registerMutation.error) {
      toast.error(registerMutation.error.message || 'Something went wrong.');
    }
  };

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold mb-1.5 leading-tight" style={{ color: brand.fg }}>
          Create Account
        </h1>
        <p className="text-sm" style={{ color: `color-mix(in srgb, ${brand.fg} 45%, transparent)` }}>
          Join 10,000+ Nigerian entrepreneurs
        </p>
      </div>

      {/* Google */}
      <motion.button
        onClick={loginWithGoogle}
        disabled={isLoading}
        whileHover={{ scale: isLoading ? 1 : 1.01 }}
        whileTap={{ scale: isLoading ? 1 : 0.99 }}
        className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl text-sm font-medium mb-5 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
        style={{
          border: `1px solid color-mix(in srgb, ${brand.fg} 10%, transparent)`,
          background: `color-mix(in srgb, ${brand.fg} 4%, transparent)`,
          color: brand.fg,
        }}
      >
        <GoogleSVG />
        Continue with Google
      </motion.button>

      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 h-px" style={{ background: `color-mix(in srgb, ${brand.fg} 8%, transparent)` }} />
        <span className="text-xs" style={{ color: `color-mix(in srgb, ${brand.fg} 25%, transparent)` }}>or</span>
        <div className="flex-1 h-px" style={{ background: `color-mix(in srgb, ${brand.fg} 8%, transparent)` }} />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">

        <RegField
          label="Full Name" id="fullName" name="fullName" type="text"
          value={formData.fullName} onChange={handleChange}
          placeholder="Charles Okonkwo" error={errors['fullName']}
        />

        <RegField
          label="Email Address" id="email" name="email" type="email"
          value={formData.email} onChange={handleChange}
          placeholder="you@example.com" error={errors['email']}
        />

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="text-xs font-medium mb-1.5 block"
            style={{ color: `color-mix(in srgb, ${brand.fg} 50%, transparent)` }}
          >
            Password
          </label>
          <div className="relative">
            <input
              id="password" name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password} onChange={handleChange}
              placeholder="Create a strong password"
              className="w-full rounded-xl px-4 py-3 pr-11 text-sm outline-none transition-colors"
              style={{
                background: `color-mix(in srgb, ${brand.fg} 5%, transparent)`,
                border: `1px solid ${errors['password'] ? 'rgba(248,113,113,0.6)' : `color-mix(in srgb, ${brand.fg} 10%, transparent)`}`,
                color: brand.fg,
              }}
            />
            <ToggleEye show={showPassword} onToggle={() => setShowPassword(v => !v)} />
          </div>
          {formData.password && (
            <div className="mt-2">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(bar => (
                  <div
                    key={bar}
                    className={`h-1 flex-1 rounded-full transition-colors ${
                      bar <= passwordStrength.score ? passwordStrength.barColor : 'bg-white/10'
                    }`}
                  />
                ))}
              </div>
              {passwordStrength.label && (
                <p className="text-xs mt-1" style={{ color: passwordStrength.textColor }}>
                  {passwordStrength.label}
                </p>
              )}
            </div>
          )}
          {errors['password'] && <p className="text-red-400 text-xs mt-1">{errors['password']}</p>}
        </div>

        {/* Confirm Password */}
        <div>
          <label
            htmlFor="confirmPassword"
            className="text-xs font-medium mb-1.5 block"
            style={{ color: `color-mix(in srgb, ${brand.fg} 50%, transparent)` }}
          >
            Confirm Password
          </label>
          <div className="relative">
            <input
              id="confirmPassword" name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword} onChange={handleChange}
              placeholder="Confirm your password"
              className="w-full rounded-xl px-4 py-3 pr-11 text-sm outline-none transition-colors"
              style={{
                background: `color-mix(in srgb, ${brand.fg} 5%, transparent)`,
                border: `1px solid ${errors['confirmPassword'] ? 'rgba(248,113,113,0.6)' : `color-mix(in srgb, ${brand.fg} 10%, transparent)`}`,
                color: brand.fg,
              }}
            />
            <ToggleEye show={showConfirmPassword} onToggle={() => setShowConfirmPassword(v => !v)} />
          </div>
          {errors['confirmPassword'] && (
            <p className="text-red-400 text-xs mt-1">{errors['confirmPassword']}</p>
          )}
        </div>

        {/* Checkboxes */}
        <div className="space-y-3 pt-1">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox" name="agreeTerms"
              checked={formData.agreeTerms} onChange={handleChange}
              className="w-4 h-4 mt-0.5 rounded accent-[var(--product-secondary)]"
            />
            <span className="text-xs leading-relaxed" style={{ color: `color-mix(in srgb, ${brand.fg} 50%, transparent)` }}>
              I agree to the{' '}
              <Link href="/terms" className="underline transition-colors" style={{ color: `color-mix(in srgb, ${brand.fg} 70%, transparent)` }}>
                Terms of Service
              </Link>
              {' '}and{' '}
              <Link href="/privacy" className="underline transition-colors" style={{ color: `color-mix(in srgb, ${brand.fg} 70%, transparent)` }}>
                Privacy Policy
              </Link>
            </span>
          </label>
          {errors['agreeTerms'] && (
            <p className="text-red-400 text-xs -mt-1">{errors['agreeTerms']}</p>
          )}

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox" name="subscribeNewsletter"
              checked={formData.subscribeNewsletter} onChange={handleChange}
              className="w-4 h-4 rounded accent-[var(--product-secondary)]"
            />
            <span className="text-xs" style={{ color: `color-mix(in srgb, ${brand.fg} 50%, transparent)` }}>
              Send me tips and product updates via email
            </span>
          </label>
        </div>

        {registerMutation.error && (
          <p className="text-red-400 text-xs bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
            {registerMutation.error.message}
          </p>
        )}

        <motion.button
          type="submit"
          disabled={isLoading}
          whileHover={{ scale: isLoading ? 1 : 1.01 }}
          whileTap={{ scale: isLoading ? 1 : 0.99 }}
          className="w-full py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 text-sm"
          style={{
            background: brand.secondary,
            color: brand.primary,
          }}
        >
          {isLoading ? (
            <>
              <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              Creating your account…
            </>
          ) : 'Create Account'}
        </motion.button>
      </form>

      <p className="text-center mt-5 text-sm" style={{ color: `color-mix(in srgb, ${brand.fg} 35%, transparent)` }}>
        Already have an account?{' '}
        <Link
          href="/login"
          className="font-medium transition-colors"
          style={{ color: brand.secondary }}
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function RegField({
  label, id, name, type, value, onChange, placeholder, error,
}: {
  label: string; id: string; name: string; type: string;
  value: string; onChange: React.ChangeEventHandler<HTMLInputElement>;
  placeholder?: string; error?: string;
}) {
  const fg = 'var(--product-foreground)';
  return (
    <div>
      <label htmlFor={id} className="text-xs font-medium mb-1.5 block" style={{ color: `color-mix(in srgb, ${fg} 50%, transparent)` }}>
        {label}
      </label>
      <input
        id={id} name={name} type={type} value={value}
        onChange={onChange} placeholder={placeholder}
        className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-colors"
        style={{
          background: `color-mix(in srgb, ${fg} 5%, transparent)`,
          border: `1px solid ${error ? 'rgba(248,113,113,0.6)' : `color-mix(in srgb, ${fg} 10%, transparent)`}`,
          color: fg,
        }}
      />
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}

function ToggleEye({ show, onToggle }: { show: boolean; onToggle: () => void }) {
  return (
    <button
      type="button" onClick={onToggle}
      className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
      style={{ color: `color-mix(in srgb, var(--product-foreground) 30%, transparent)` }}
    >
      {show ? <EyeOff /> : <EyeOn />}
    </button>
  );
}

function GoogleSVG() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="text-center" style={{ color: 'var(--product-foreground)' }}>Loading...</div>}>
      <RegisterContent />
    </Suspense>
  );
}
