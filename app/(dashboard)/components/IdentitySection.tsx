'use client';

import { motion } from 'framer-motion';
import { Trophy, Flame, Target, Award } from 'lucide-react';
import type { AuthUser } from '../../../lib/api';

interface IdentitySectionProps {
    user: AuthUser | null;
}

export function IdentitySection({ user }: IdentitySectionProps) {
    if (!user) return null;

    const roleName = user.ecosystemRole || user.role || 'Member';
    const maturity = (user as any).digitalMaturity || 'Exploring';

    // Mock data for streak and progress until backend supports it
    const streak = 7;
    const progress = 65;
    const rank = 'Top 18%';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-6"
        >
            {/* Main Identity Card */}
            <div className="md:col-span-8 bg-gradient-to-br from-[#00143C] to-[#00255C] rounded-2xl p-8 text-white relative overflow-hidden shadow-xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFC800]/10 rounded-full -mr-20 -mt-20 blur-3xl" />

                <div className="relative z-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h2 className="text-3xl font-black mb-2">
                                Welcome back, <span className="text-[#FFC800]">{user.name.split(' ')[0]}</span> 🔥
                            </h2>
                            <p className="text-blue-100 text-lg">
                                You're in the <span className="font-bold text-white">{rank}</span> of active builders this week.
                            </p>
                        </div>

                        <div className="flex gap-4">
                            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 text-center min-w-[100px]">
                                <p className="text-blue-200 text-xs uppercase tracking-wider mb-1">Role</p>
                                <p className="font-bold text-lg capitalize">{roleName.replace('_', ' ')}</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 text-center min-w-[100px]">
                                <p className="text-blue-200 text-xs uppercase tracking-wider mb-1">Maturity</p>
                                <p className="font-bold text-lg capitalize">{maturity}</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-[#FFC800] rounded-xl flex items-center justify-center shadow-lg">
                                <Flame className="text-[#00143C]" size={24} />
                            </div>
                            <div>
                                <p className="text-blue-200 text-sm">Activity Streak</p>
                                <p className="text-xl font-bold">{streak} Days</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-emerald-400 rounded-xl flex items-center justify-center shadow-lg">
                                <Target className="text-[#00143C]" size={24} />
                            </div>
                            <div>
                                <p className="text-blue-200 text-sm">Progress Level</p>
                                <p className="text-xl font-bold">Lvl {Math.floor(progress / 10)}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-purple-400 rounded-xl flex items-center justify-center shadow-lg">
                                <Award className="text-[#00143C]" size={24} />
                            </div>
                            <div>
                                <p className="text-blue-200 text-sm">Badges</p>
                                <p className="text-xl font-bold">12 Earned</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Progress / Next Step Card */}
            <div className="md:col-span-4 bg-white dark:bg-gray-900 rounded-2xl p-8 border shadow-sm flex flex-col justify-between">
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-lg flex items-center gap-2">
                            <Trophy className="text-amber-500" size={20} />
                            Milestone
                        </h3>
                        <span className="text-sm font-medium text-amber-600 bg-amber-50 dark:bg-amber-950/30 px-2 py-1 rounded">
                            {progress}%
                        </span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-3 mb-6">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="bg-amber-500 h-full rounded-full"
                        />
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                        Complete your <strong>Product Profile</strong> to reach <span className="text-gray-900 dark:text-white font-semibold">Level 7</span> and unlock cross-collaboration tools.
                    </p>
                </div>

                <button className="w-full mt-6 py-3 bg-[#FFC800] text-[#00143C] font-black rounded-xl hover:shadow-lg transition-all active:scale-[0.98]">
                    Continue Building →
                </button>
            </div>
        </motion.div>
    );
}
