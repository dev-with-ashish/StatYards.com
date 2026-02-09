"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TeamMatches } from './TeamMatches';
import { TeamSchedule } from './TeamSchedule';
import { TeamRoster } from './TeamRoster';
import { TeamDepthChart } from './TeamDepthChart';
import { TeamInjuries } from './TeamInjuries';
import { TeamStats } from './TeamStats';

const TABS = [
    { id: 'matches', label: 'Match Schedule' },
    { id: 'schedule', label: 'Full Schedule' },
    { id: 'stats', label: 'Stats' },
    { id: 'roster', label: 'Roster' },
    { id: 'depth-chart', label: 'Depth Chart' },
    { id: 'injuries', label: 'Injuries' },
];

export function TeamTabs({ team, schedule, roster, depthChart, injuries, stats, playerStats }) {
    const [activeTab, setActiveTab] = useState('matches'); // Default to matches

    return (
        <div className="mt-8">
            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200 pb-1">
                {TABS.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`relative px-6 py-3 text-sm font-bold uppercase tracking-wider transition-colors duration-300 ${activeTab === tab.id ? 'text-orange-600' : 'text-gray-500 hover:text-gray-800'
                            }`}
                    >
                        {tab.label}
                        {activeTab === tab.id && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute bottom-[-1px] left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-red-600 rounded-t-full"
                            />
                        )}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                >
                    {activeTab === 'matches' && <TeamMatches schedule={schedule} team={team} />}
                    {activeTab === 'schedule' && <TeamSchedule schedule={schedule} team={team} />}
                    {activeTab === 'roster' && <TeamRoster roster={roster} />}
                    {activeTab === 'depth-chart' && <TeamDepthChart depthChart={depthChart} />}
                    {activeTab === 'injuries' && <TeamInjuries injuries={injuries} />}
                    {activeTab === 'stats' && <TeamStats team={team} stats={stats} playerStats={playerStats} />}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
