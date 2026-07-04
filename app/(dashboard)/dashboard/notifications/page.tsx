'use client';

export default function NotificationsPage() {
  const MOCK_NOTIFICATIONS = [
    { id: '1', icon: '💰', title: 'Referral earned', body: 'You earned ₦2,500 from a new PlanAI subscriber.', time: '2 hours ago', read: false },
    { id: '2', icon: '🎉', title: 'Welcome to BoldmindNG', body: 'Your account is set up. Explore the ecosystem.', time: '1 day ago', read: true },
    { id: '3', icon: '⚡', title: 'PlanAI subscription active', body: 'Your Pro plan is live. All 13 tools unlocked.', time: '3 days ago', read: true },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black" style={{ color: 'var(--product-foreground)' }}>Notifications</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--product-foreground)', opacity: 0.55 }}>Stay up to date with your BoldmindNG activity.</p>
        </div>
        <button className="text-sm font-bold" style={{ color: 'var(--product-primary)' }}>Mark all read</button>
      </div>

      <div className="rounded-2xl border-2 overflow-hidden" style={{ borderColor: 'var(--product-muted)', backgroundColor: 'var(--product-background)' }}>
        {MOCK_NOTIFICATIONS.map((n, i) => (
          <div
            key={n.id}
            className="flex items-start gap-4 px-5 py-4 transition-colors"
            style={{
              borderBottom: i < MOCK_NOTIFICATIONS.length - 1 ? '1px solid var(--product-muted)' : undefined,
              backgroundColor: n.read ? 'transparent' : 'var(--product-highlight)',
            }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ backgroundColor: 'var(--product-muted)' }}>
              {n.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="text-sm font-bold" style={{ color: 'var(--product-foreground)' }}>{n.title}</p>
                {!n.read && <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--product-secondary)' }} />}
              </div>
              <p className="text-sm" style={{ color: 'var(--product-foreground)', opacity: 0.65 }}>{n.body}</p>
              <p className="text-xs mt-1" style={{ color: 'var(--product-foreground)', opacity: 0.35 }}>{n.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}