import ProtectedLayout from '../components/layout/ProtectedLayout';
import type { ReactNode } from 'react';

export default function DashboardGroupLayout({ children }: { children: ReactNode }) {
  return <ProtectedLayout>{children}</ProtectedLayout>;
}