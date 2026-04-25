'use client';

import { motion } from 'framer-motion';
import { Share2, Zap, ShoppingBag, Users, MessageSquare } from 'lucide-react';

interface FeedEvent {
    id: string;
    type: 'launch' | 'sale' | 'join' | 'content';
    user: string;
    content: string;
    time: string;
    icon: any;
}

const MOCK_EVENTS: FeedEvent[] = [
    {
        id: '1',
        type: 'launch',
        user: 'Chinedu',
        content: 'just launched a product: "NaijaGig Matcher"',
        time: '2m ago',
        icon: Zap
    },
    {
        id: '2',
        type: 'sale',
        user: 'Aisha',
        content: 'just hit 100 sales on "EduCenter Pro"',
        time: '15m ago',
        icon: ShoppingBag
    },
    {
        id: '3',
        type: 'join',
        user: 'Samuel',
        content: 'just joined the ecosystem as a Founder',
        time: '45m ago',
        icon: Users
    },
    {
        id: '4',
        type: 'content',
        user: 'Creator X',
        content: 'published new content on "AmeboGist"',
        time: '1h ago',
        icon: MessageSquare
    },
    {
        id: '5',
        type: 'sale',
        user: 'Tunde',
        content: 'processed ₦50,000 in revenue today',
        time: '2h ago',
        icon: Share2
    }
];

export function CommunityFeed() {
    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border shadow-sm overflow-hidden flex flex-col h-full">
            <div className="p-6 border-b flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/50">
                <h3 className="font-black text-[#00143C] dark:text-white flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    Live Ecosystem Feed
                </h3>
                <span className="text-xs font-bold text-[#FFC800] bg-[#00143C] px-2 py-1 rounded uppercase tracking-tighter">
                    Built in Public
                </span>
            </div>

            <div className="flex-1 overflow-auto p-4 space-y-4">
                {MOCK_EVENTS.map((event, index) => (
                    <motion.div
                        key={event.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
                    >
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                            <event.icon size={18} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-900 dark:text-gray-100 leading-tight">
                                <span className="font-bold">{event.user}</span>{' '}
                                <span className="text-gray-600 dark:text-gray-400">{event.content}</span>
                            </p>
                            <p className="text-[10px] font-medium text-gray-400 mt-1 uppercase tracking-tight">
                                {event.time}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="p-4 border-t bg-gray-50/30 dark:bg-gray-800/20">
                <button className="w-full py-2 text-sm font-bold text-[#00143C] dark:text-[#FFC800] hover:underline">
                    View All Activity →
                </button>
            </div>
        </div>
    );
}
