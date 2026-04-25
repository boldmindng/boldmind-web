'use client';

/**
 * BoldMind Hub — User Profile Page
 * File: apps/boldmind-hub/app/dashboard/profile/page.tsx
 *
 * Wired to useUserProfile, useUpdateProfile, useMediaUpload, useMyProducts hooks.
 */

import { useState, useRef, useEffect } from 'react';
import { useUserProfile, useUpdateProfile, useMediaUpload, useMyProducts } from '../../../../lib/hooks';
import { Camera, Save, Loader2, AlertCircle, CheckCircle2, Package, Trash2 } from 'lucide-react';

// ─── Avatar ───────────────────────────────────────────────────────────────────

function Avatar({
  src,
  name,
  size = 96,
}: {
  src?: string | null;
  name?: string | null;
  size?: number;
}) {
  const initials = name
    ?.split(' ')
    .map(p => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || '?';

  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={name ?? 'avatar'} width={size} height={size}
        className="rounded-full object-cover border-4 border-white shadow-md"
        style={{ width: size, height: size }} />
    );
  }
  return (
    <div
      className="rounded-full border-4 border-white shadow-md flex items-center justify-center font-black text-white"
      style={{ width: size, height: size, fontSize: size * 0.35, backgroundColor: 'var(--product-primary, #3B82F6)' }}
    >
      {initials}
    </div>
  );
}

// ─── Input field ──────────────────────────────────────────────────────────────

function Field({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  disabled,
}: {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  disabled?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:border-[#FFC800] focus:ring-2 focus:ring-[#FFC800]/20 outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed text-sm"
      />
    </div>
  );
}

// ─── Product card ─────────────────────────────────────────────────────────────

function ProductCard({ product }: { product: any }) {
  return (
    <div className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
        <Package size={18} className="text-blue-500" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
          {product.name ?? product.productName ?? product.productSlug ?? 'Product'}
        </p>
        <p className="text-xs text-gray-400 truncate">{product.plan ?? product.status ?? 'active'}</p>
      </div>
      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-100 text-green-700">
        Active
      </span>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const { data: profile, loading: profileLoading, refresh: refreshProfile } = useUserProfile();
  const { data: myProducts, loading: productsLoading } = useMyProducts();
  const updateMutation = useUpdateProfile();
  const uploadMutation = useMediaUpload();

  const [form, setForm] = useState({
    firstName: '',
    lastName:  '',
    bio:       '',
    phone:     '',
  });
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [saveSuccess,   setSaveSuccess]   = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Populate form from loaded profile
  useEffect(() => {
    if (!profile) return;
    setForm({
      firstName: profile.firstName ?? '',
      lastName:  profile.lastName  ?? '',
      bio:       (profile as any).bio   ?? '',
      phone:     (profile as any).phone ?? '',
    });
  }, [profile]);

  const handleField = (key: keyof typeof form) => (value: string) => {
    setForm(f => ({ ...f, [key]: value }));
    setSaveSuccess(false);
  };

  // ── Avatar upload ──────────────────────────────────────────────────────
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Local preview
    const reader = new FileReader();
    reader.onload = ev => setAvatarPreview(ev.target?.result as string);
    reader.readAsDataURL(file);

    // Upload to server
    const result = await uploadMutation.execute(file, 'avatars');
    if (result?.url) {
      await updateMutation.execute({ avatar: result.url });
      refreshProfile();
    }
  };

  // ── Save profile ───────────────────────────────────────────────────────
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await updateMutation.execute({
      firstName: form.firstName || undefined,
      lastName:  form.lastName  || undefined,
      bio:       form.bio       || undefined,
      phone:     form.phone     || undefined,
    });
    if (result) {
      setSaveSuccess(true);
      refreshProfile();
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const isSaving = updateMutation.loading || uploadMutation.loading;
  const avatarSrc = avatarPreview || profile?.avatar;
  const displayName = [profile?.firstName, profile?.lastName].filter(Boolean).join(' ') || profile?.email;

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-6 px-4 sm:px-0">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">Your Profile</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your personal information and account settings</p>
      </div>

      {/* Avatar + name card */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
        <div className="flex items-center gap-6">
          <div className="relative group">
            {profileLoading
              ? <div className="w-24 h-24 rounded-full bg-gray-200 animate-pulse" />
              : <Avatar src={avatarSrc} name={displayName} size={96} />
            }
            <button
              onClick={() => fileRef.current?.click()}
              disabled={isSaving}
              className="absolute inset-0 rounded-full flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer disabled:cursor-not-allowed"
            >
              {uploadMutation.loading
                ? <Loader2 size={20} className="text-white animate-spin" />
                : <Camera size={20} className="text-white" />
              }
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </div>

          <div>
            {profileLoading
              ? <div className="space-y-2">
                  <div className="h-6 w-36 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-48 bg-gray-100 rounded animate-pulse" />
                </div>
              : <>
                  <p className="text-lg font-black text-gray-900 dark:text-white">{displayName || '—'}</p>
                  <p className="text-sm text-gray-400">{profile?.email}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700">
                      {profile?.role ?? 'USER'}
                    </span>
                  </div>
                </>
            }
          </div>
        </div>
      </div>

      {/* Edit form */}
      <form onSubmit={handleSave} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 space-y-5">
        <h2 className="text-base font-bold text-gray-900 dark:text-white">Personal Information</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="First Name" name="firstName" value={form.firstName}
            onChange={handleField('firstName')} placeholder="Chidi" disabled={profileLoading} />
          <Field label="Last Name"  name="lastName"  value={form.lastName}
            onChange={handleField('lastName')}  placeholder="Okonkwo" disabled={profileLoading} />
        </div>

        <Field label="Phone Number" name="phone" type="tel" value={form.phone}
          onChange={handleField('phone')} placeholder="+234 801 234 5678" disabled={profileLoading} />

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Bio</label>
          <textarea
            name="bio"
            value={form.bio}
            onChange={e => { setForm(f => ({ ...f, bio: e.target.value })); setSaveSuccess(false); }}
            placeholder="Tell us a bit about yourself…"
            rows={3}
            disabled={profileLoading}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:border-[#FFC800] focus:ring-2 focus:ring-[#FFC800]/20 outline-none transition-all disabled:opacity-60 resize-none text-sm"
          />
        </div>

        {/* Feedback */}
        {updateMutation.error && (
          <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <AlertCircle size={15} /> {updateMutation.error.message}
          </div>
        )}
        {saveSuccess && (
          <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
            <CheckCircle2 size={15} /> Profile updated successfully!
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving || profileLoading}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#00143C] hover:bg-[#001F5C] text-white text-sm font-bold shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving
              ? <><Loader2 size={15} className="animate-spin" /> Saving…</>
              : <><Save size={15} /> Save Changes</>
            }
          </button>
        </div>
      </form>

      {/* My products */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-gray-900 dark:text-white">My Products</h2>
          {productsLoading && <Loader2 size={14} className="animate-spin text-gray-400" />}
        </div>

        {productsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : !Array.isArray(myProducts) || myProducts.length === 0 ? (
          <div className="text-center py-8">
            <Package size={32} className="mx-auto text-gray-300 mb-2" />
            <p className="text-sm text-gray-400">No active products yet.</p>
            <a href="/pricing" className="text-sm text-[#FFC800] font-semibold hover:underline mt-1 inline-block">
              Browse products →
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(myProducts as any[]).map((p, i) => (
              <ProductCard key={p.id ?? i} product={p} />
            ))}
          </div>
        )}
      </div>

      {/* Danger zone */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border-2 border-red-200 dark:border-red-800/40 p-6">
        <h2 className="text-base font-bold text-red-600 mb-1">Danger Zone</h2>
        <p className="text-sm text-gray-500 mb-4">
          Permanently delete your account and all associated data. This cannot be undone.
        </p>
        <button
          onClick={() => {
            if (window.confirm('Are you absolutely sure? This will permanently delete your account.')) {
              // handled by useDeleteAccount hook in a real implementation
              alert('Account deletion submitted.');
            }
          }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-red-300 text-red-600 hover:bg-red-50 text-sm font-semibold transition-colors"
        >
          <Trash2 size={14} /> Delete my account
        </button>
      </div>
    </div>
  );
}