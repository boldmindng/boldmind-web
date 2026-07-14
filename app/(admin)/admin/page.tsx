import type { Metadata } from 'next';
import AdminOverviewClient from './AdminOverviewClient';

export const metadata: Metadata = { title: 'Admin Overview' };

export default function AdminPage() {
  return <AdminOverviewClient />;
}