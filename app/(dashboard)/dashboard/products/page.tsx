'use client';


import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { SuperNavbar, Card, CardHeader, CardTitle, CardContent, Button } from '@boldmind-tech/ui';
import { hubAPIAdapter, type HubProduct } from '../../../../lib/hub-api-adapter';
import { useAuth } from '@boldmind-tech/auth';
import { useRouter } from 'next/navigation';
import { DashboardSidebar } from '../../Sidebar';
import { toast } from 'sonner';
import { Plus, RefreshCw, Package2 } from 'lucide-react';

// ─── Status badge colours ─────────────────────────────────────────────────────

const STATUS_STYLES: Record<string, string> = {
  LIVE:      'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  BUILDING:  'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  PLANNED:   'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  CONCEPT:   'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
};

// ─── Skeleton card ────────────────────────────────────────────────────────────

function ProductSkeleton() {
  return (
    <div className="rounded-2xl border bg-white dark:bg-gray-900 p-6 animate-pulse space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-xl" />
        <div className="space-y-1.5">
          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-3 w-20 bg-gray-100 dark:bg-gray-800 rounded" />
        </div>
      </div>
      <div className="h-3 w-full bg-gray-100 dark:bg-gray-800 rounded" />
      <div className="h-3 w-3/4 bg-gray-100 dark:bg-gray-800 rounded" />
      <div className="flex gap-2">
        <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded-lg" />
        <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded-lg" />
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProductsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [products, setProducts] = useState<HubProduct[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState<string | null>(null);
  const [filter,   setFilter]   = useState({ status: '', category: '' });
  const [deleting, setDeleting] = useState<string | null>(null);

  // Auth guard
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/dashboard/products');
    }
  }, [user, authLoading, router]);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await hubAPIAdapter.getProducts(filter);
      setProducts(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load products');
      toast.error(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [filter.status, filter.category]);  // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (user) loadProducts();
  }, [user, loadProducts]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this product? This cannot be undone.')) return;
    setDeleting(id);
    try {
      await hubAPIAdapter.deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
      toast.success('Product deleted');
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete product');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50/40 dark:bg-gray-950">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col">
        <SuperNavbar
          logoSrc="/logo.png"
          links={[
            { href: '/dashboard',               label: 'Dashboard' },
            { href: '/dashboard/products',      label: 'Products' },
            { href: '/dashboard/team',          label: 'Team' },
            { href: '/dashboard/announcements', label: 'Announcements' },
          ]}
        />

        <main className="flex-1 p-6 lg:p-10 overflow-auto">
          <div className="max-w-7xl mx-auto">

            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
                  <Package2 size={26} /> Products
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
                  {loading ? 'Loading…' : `${products.length} product${products.length !== 1 ? 's' : ''} found`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={loadProducts} disabled={loading}
                  className="p-2 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-500 transition-colors disabled:opacity-50">
                  <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
                </button>
                <Button onClick={() => router.push('/dashboard/products/new')}>
                  <Plus size={16} className="mr-1.5" /> Add Product
                </Button>
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-3 mb-7 flex-wrap">
              <select
                value={filter.status}
                onChange={e => setFilter(f => ({ ...f, status: e.target.value }))}
                className="px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              >
                <option value="">All Statuses</option>
                <option value="LIVE">Live</option>
                <option value="BUILDING">Building</option>
                <option value="PLANNED">Planned</option>
                <option value="CONCEPT">Concept</option>
              </select>

              <select
                value={filter.category}
                onChange={e => setFilter(f => ({ ...f, category: e.target.value }))}
                className="px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              >
                <option value="">All Categories</option>
                <option value="media">Media</option>
                <option value="education">Education</option>
                <option value="ai">AI</option>
                <option value="productivity">Productivity</option>
                <option value="fintech">Fintech</option>
              </select>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center justify-between">
                <p className="text-sm text-red-700">{error}</p>
                <button onClick={loadProducts} className="text-red-600 text-sm font-medium hover:text-red-800">Retry</button>
              </div>
            )}

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {loading
                ? Array.from({ length: 6 }).map((_, i) => <ProductSkeleton key={i} />)
                : products.length === 0
                  ? (
                    <div className="col-span-full text-center py-16 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl">
                      <Package2 size={36} className="mx-auto text-gray-300 mb-3" />
                      <p className="text-gray-400 text-sm">No products found.</p>
                      <button onClick={() => router.push('/dashboard/products/new')}
                        className="mt-2 text-sm text-blue-600 font-semibold hover:underline">
                        Add your first product →
                      </button>
                    </div>
                  )
                  : products.map((product, index) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.04 }}
                      >
                        <Card className="h-full hover:shadow-lg transition-all duration-200 border-gray-200 dark:border-gray-800">
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-3">
                                {product.icon
                                  ? <span className="text-3xl">{product.icon}</span>
                                  : <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                      <Package2 size={18} className="text-gray-400" />
                                    </div>
                                }
                                <div>
                                  <CardTitle className="text-base leading-tight">
                                    {product.name}
                                  </CardTitle>
                                  <div className="flex gap-1.5 mt-1.5 flex-wrap">
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_STYLES[product.status] ?? 'bg-gray-100 text-gray-600'}`}>
                                      {product.status}
                                    </span>
                                    {product.category && (
                                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                                        {product.category}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3 mb-5 leading-relaxed">
                              {product.description || 'No description provided.'}
                            </p>
                            {product.monthlyRevenue != null && (
                              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-4">
                                ₦{product.monthlyRevenue.toLocaleString()}<span className="text-xs font-normal text-gray-400">/mo</span>
                              </p>
                            )}
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline"
                                onClick={() => router.push(`/dashboard/products/${product.id}`)}>
                                Edit
                              </Button>
                              <Button size="sm" variant="outline"
                                onClick={() => handleDelete(product.id)}
                                disabled={deleting === product.id}
                                className="text-red-600 hover:text-red-700 hover:border-red-300 disabled:opacity-50">
                                {deleting === product.id ? 'Deleting…' : 'Delete'}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))
              }
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}