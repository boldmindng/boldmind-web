'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  
  Card,
  Button,
  ParticleBackground,
  StatusBadge,
  TypewriterEffect
} from '@boldmind-tech/ui';
import {
  CheckCircle,
  Rocket,
  Search,
  ArrowRight,
  TrendingUp,
  Globe,
  Award,
  Zap,
  Shield,
  Briefcase,
  Layers
} from 'lucide-react';

export default function ProductsPage() {
  const [filter, setFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/products', label: 'Products' },
    { href: '/contact', label: 'Contact' },
  ];

  const footerSections = [
    {
      title: '🚀 Products',
      links: [
        { href: 'https://amebogist.ng', label: 'AmeboGist', isExternal: true },
        { href: 'https://educenter.com.ng', label: 'EduCenter', isExternal: true },
        { href: '/products', label: 'All Products', badge: '31+' },
      ],
    },
    {
      title: '🏢 Company',
      links: [
        { href: '/about', label: 'About Us' },
        { href: '/#ecosystem', label: 'Our Ecosystem' },
        { href: '/contact', label: 'Contact' },
      ],
    },
  ];

  const allProducts = [
    // Live Products
    {
      name: 'AmeboGist.ng',
      tagline: 'Authentic Nigerian Media',
      description: 'Pidgin news & lifestyle platform building mass audience for the BoldMind ecosystem through culturally relevant content.',
      link: 'https://amebogist.ng',
      color: '#00A859',
      icon: <Globe className="w-8 h-8 text-white" />,
      status: 'LIVE',
      category: 'MEDIA',
      features: ['Daily Nigerian News', 'Pidgin Content', 'SEO Optimized'],
    },
    {
      name: 'EduCenter.com.ng',
      tagline: 'Education Excellence',
      description: 'JAMB/WAEC exam preparation and career development platform empowering the next generation of Nigerian leaders.',
      link: 'https://educenter.com.ng',
      color: '#2A4A6E',
      icon: <Award className="w-8 h-8 text-white" />,
      status: 'LIVE',
      category: 'EDUCATION',
      features: ['JAMB Practice', 'WAEC Prep', 'Progress Tracking'],
    },
    {
      name: 'AI Receptionist',
      tagline: 'Lead Management',
      description: 'Meta API automation for lead capture, booking, and customer engagement, streamlining business communications.',
      link: '/contact',
      color: '#FFC800',
      icon: <Zap className="w-8 h-8 text-white" />,
      status: 'LIVE',
      category: 'AI',
      features: ['Auto-Reply', 'Lead Capture', 'WhatsApp Integration'],
    },
    // Building Products
    {
      name: 'BoldMind OS',
      tagline: 'Neurodivergent Productivity',
      description: 'Comprehensive productivity system designed specifically for ADHD and dyslexic entrepreneurs to thrive.',
      color: '#E63946',
      icon: <Layers className="w-8 h-8 text-white" />,
      status: 'BUILDING',
      category: 'PRODUCTIVITY',
      features: ['Focus Brain', 'Capture Engine', 'Visual Roadmap'],
    },
    {
      name: 'Social Factory',
      tagline: 'AI Content Automation',
      description: 'AI-powered video generation and multi-platform content publishing for modern digital brands.',
      color: '#9C27B0',
      icon: <Rocket className="w-8 h-8 text-white" />,
      status: 'BUILDING',
      category: 'MARKETING',
      features: ['Video Generation', 'Auto-Publish', 'Analytics'],
    },
    // PlanAI Suite - AI
    { name: 'Credibility Hubs', tagline: 'Personal Branding', description: 'Portfolio websites and personal branding for professionals.', icon: <Briefcase className="w-8 h-8 text-white" />, color: '#3F51B5', status: 'NEW', category: 'AI', features: ['AI Portfolios', 'Branding Kit'] },
    { name: 'Business Planning', tagline: 'Strategic Growth', description: 'Business plan and market analysis generation with AI.', icon: <TrendingUp className="w-8 h-8 text-white" />, color: '#009688', status: 'NEW', category: 'AI', features: ['Market Analysis', 'Growth Roadmap'] },
    { name: 'SAFE AI', tagline: 'Intelligence Platform', description: 'AI-powered crime prevention and incident management system.', icon: <Shield className="w-8 h-8 text-white" />, color: '#FF5722', status: 'NEW', category: 'SECURITY', features: ['Security Analytics', 'Incident Reports'] },
  ];

  const categories = ['ALL', 'LIVE', 'BUILDING', 'NEW', 'AI', 'MEDIA', 'EDUCATION'];

  const filteredProducts = useMemo(() => {
    return allProducts.filter(product => {
      const matchesFilter = filter === 'ALL' || product.status === filter || product.category === filter;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [filter, searchQuery]);

  return (
    <div className="min-h-screen bg-white dark:bg-[#040D21] transition-colors duration-500">

      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-[#00143C] text-white overflow-hidden">
        <ParticleBackground density={35} className="opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#00143C]" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block px-4 py-1.5 rounded-full bg-[#FFC800]/10 border border-[#FFC800]/20 text-[#FFC800] text-sm font-black mb-8">
              31+ SOLUTIONS • 1 ECOSYSTEM
            </div>
            <h1 className="text-5xl md:text-8xl font-black mb-6 tracking-tight">
              The Product <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFC800] to-[#E5B600]">Ecosystem</span>
            </h1>
            <div className="text-xl md:text-3xl text-gray-300 max-w-4xl mx-auto mb-12 h-16">
              <TypewriterEffect
                texts={[
                  "Empowering Nigerian Entrepreneurs",
                  "Building Africa's Tech Future",
                  "Innovative Solutions for Local Problems",
                  "Scalable Digital Infrastructure"
                ]}
              />
            </div>

            {/* Stats Bar */}
            <div className="flex flex-wrap justify-center gap-8 md:gap-16">
              {[
                { label: 'Live Products', value: '3', color: 'text-green-400' },
                { label: 'In Development', value: '2', color: 'text-yellow-400' },
                { label: 'Planned Concepts', value: '26+', color: 'text-blue-400' }
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className={`text-4xl font-black mb-1 ${stat.color}`}>{stat.value}</div>
                  <div className="text-sm uppercase tracking-widest text-gray-700 dark:text-gray-400 font-bold">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filter & Search Bar */}
      <section className="sticky top-[72px] z-30 bg-white/80 dark:bg-[#040D21]/80 backdrop-blur-xl border-b border-gray-100 dark:border-white/5 py-4">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row gap-6 items-center justify-between">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filter === cat
                  ? 'bg-[#00143C] text-white shadow-lg dark:bg-[#FFC800] dark:text-[#00143C]'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-white/5 dark:text-gray-300'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-100 dark:bg-white/5 border-none rounded-xl focus:ring-2 focus:ring-[#FFC800] transition-all dark:text-white"
            />
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-20 bg-gray-50 dark:bg-[#02091A]">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatePresence mode='popLayout'>
            <motion.div
              layout
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.name}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card
                    variant="premium"
                    className="h-full group hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_50px_rgba(255,200,0,0.05)] border-none transition-all duration-500 overflow-hidden"
                  >
                    <div className="p-8 pb-4">
                      <div className="flex justify-between items-start mb-8">
                        <div
                          className="w-16 h-16 rounded-2xl flex items-center justify-center transform group-hover:rotate-6 transition-transform duration-500 shadow-lg"
                          style={{ backgroundColor: product.color }}
                        >
                          {product.icon}
                        </div>
                        <StatusBadge
                          variant={
                            product.status === 'LIVE' ? 'live' :
                              product.status === 'BUILDING' ? 'building' : 'planned'
                          }
                        >
                          {product.status}
                        </StatusBadge>
                      </div>

                      <h3 className="text-2xl font-black text-[#00143C] dark:text-white mb-2 group-hover:text-[#FFC800] transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-sm font-bold uppercase tracking-widest mb-4 opacity-70" style={{ color: product.color }}>
                        {product.tagline}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8 h-20 overflow-hidden">
                        {product.description}
                      </p>

                      <div className="space-y-3 mb-8">
                        {product.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-8 pt-0 mt-auto">
                      <Button
                        variant={product.status === 'LIVE' ? 'primary' : 'outline'}
                        className="w-full group/btn py-6"
                        onClick={() => product.link ? window.open(product.link, '_blank') : null}
                      >
                        {product.status === 'LIVE' ? 'Launch Application' : 'Request Early Access'}
                        <ArrowRight className="ml-2 w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </div>

                    {/* Hover Effect Light */}
                    <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-[#FFC800]/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {filteredProducts.length === 0 && (
            <div className="py-40 text-center">
              <div className="text-6xl mb-6">🔍</div>
              <h3 className="text-2xl font-black text-[#00143C] dark:text-white mb-4">No Products Found</h3>
              <p className="text-gray-500">Try adjusting your filters or search query</p>
              <Button
                variant="outline"
                className="mt-8"
                onClick={() => { setFilter('ALL'); setSearchQuery(''); }}
              >
                Reset All Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Categories / Industries */}
      <section className="py-24 bg-white dark:bg-[#040D21]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-[#00143C] dark:text-white mb-6">Vertical <span className="text-[#FFC800]">Specialization</span></h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">We focus on high-impact sectors that drive economic growth and digital transformation in Nigeria.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { name: 'FinTech', icon: '💰', count: 8 },
              { name: 'EduTech', icon: '🎓', count: 5 },
              { name: 'AgriTech', icon: '🌱', count: 4 },
              { name: 'AI Solutions', icon: '🤖', count: 14 }
            ].map((industry, i) => (
              <div key={i} className="p-8 rounded-3xl bg-gray-50 dark:bg-white/5 border border-transparent hover:border-[#FFC800]/30 transition-all text-center group">
                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform">{industry.icon}</div>
                <h4 className="text-xl font-bold dark:text-white mb-2">{industry.name}</h4>
                <div className="text-[#FFC800] font-black">{industry.count} Products</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 bg-[#00143C] relative overflow-hidden text-center">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-purple-900/20" />
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <h2 className="text-5xl md:text-7xl font-black text-white mb-8">Ready to <span className="text-[#FFC800]">Partner</span> with Us?</h2>
          <p className="text-xl text-gray-400 mb-12">Whether you want to use our products or build new ones with us, we're ready to discuss.</p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button size="lg" className="px-12 py-8 text-xl bg-[#FFC800] text-[#00143C] font-black" onClick={() => window.open('https://wa.me/2349138349271', '_blank')}>
              Start a Conversation
            </Button>
            <Button size="lg" variant="outline" className="px-12 py-8 text-xl border-white/20 text-white hover:bg-white/5" onClick={() => window.location.href = '/contact'}>
              Contact Sales
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
}