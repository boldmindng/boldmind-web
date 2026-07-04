import type { Metadata } from 'next';
import HubDashboardPage from '../components/dashboard/HubDashboardPage';

export const metadata: Metadata = { title: 'Dashboard' };

export default function DashboardPage() {
  return <HubDashboardPage />;
}