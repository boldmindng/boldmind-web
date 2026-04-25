'use client';

import { motion } from 'framer-motion';
import { Plus, Users, ArrowRight, ExternalLink } from 'lucide-react';

const SUGGESTED_BUSINESSES = [
    {
        name: 'AmeboGist',
        category: 'Media',
        description: 'Authentic Pigin news and media platform.',
        icon: '📰',
        color: '#00A859'
    },
    {
        name: 'PlanAI',
        category: 'AI / Business',
        description: 'AI-powered business planning and automation.',
        icon: '🤖',
        color: '#FFC800'
    },
    {
        name: 'EduCenter',
        category: 'Education',
        description: 'Practical learning engine for digital skills.',
        icon: '🎓',
        color: '#2A4A6E'
    }
];

export function BusinessDiscovery() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-black text-[#00143C] dark:text-white">
                        Business Discovery
                    </h3>
                    <p className="text-sm text-gray-500 font-medium mt-1">
                        Connect, Collaborate, and Grow with Others
                    </p>
                </div>
                <button className="flex items-center gap-2 text-sm font-bold text-[#00143C] dark:text-[#FFC800] hover:underline">
                    Find More <ArrowRight size={16} />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {SUGGESTED_BUSINESSES.map((biz, index) => (
                    <motion.div
                        key={biz.name}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white dark:bg-gray-900 rounded-2xl border shadow-sm p-6 hover:shadow-md transition-all group border-l-4"
                        style={{ borderLeftColor: biz.color }}
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div
                                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-sm"
                                style={{ backgroundColor: `${biz.color}15`, color: biz.color }}
                            >
                                {biz.icon}
                            </div>
                            <button className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-[#FFC800]/20 transition-colors">
                                <Plus size={18} className="text-gray-400 group-hover:text-[#00143C]" />
                            </button>
                        </div>

                        <h4 className="font-bold text-lg text-[#00143C] dark:text-white mb-1 group-hover:text-[#FFC800] transition-colors">
                            {biz.name}
                        </h4>
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 block">
                            {biz.category}
                        </span>

                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-6">
                            {biz.description}
                        </p>

                        <button className="w-full py-2 bg-gray-50 dark:bg-gray-800 text-[#00143C] dark:text-gray-300 text-xs font-bold rounded-lg group-hover:bg-[#00143C] group-hover:text-[#FFC800] transition-all flex items-center justify-center gap-2">
                            Explore Collaboration <ExternalLink size={12} />
                        </button>
                    </motion.div>
                ))}
            </div>

            {/* Collaboration Call to Action */}
            <div className="bg-[#00143C] rounded-2xl p-8 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -mr-16 -mt-16 blur-xl" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-400 rounded-full -ml-12 -mb-12 blur-xl" />
                </div>

                <div className="relative z-10 max-w-lg mx-auto">
                    <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Users className="text-[#FFC800]" size={32} />
                    </div>
                    <h4 className="text-2xl font-black text-white mb-2">Build Together.</h4>
                    <p className="text-blue-100 mb-8">
                        The best systems are built by ecosystems. Launch a collaboration request and find partners in the top 10% of Nigerian builders.
                    </p>
                    <button className="px-8 py-3 bg-[#FFC800] text-[#00143C] font-black rounded-xl hover:shadow-xl hover:scale-105 active:scale-95 transition-all">
                        Create Partner Request
                    </button>
                </div>
            </div>
        </div>
    );
}
