"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useMotionValue, animate, useTransform } from "framer-motion";
import useSound from "use-sound";

const TICK_URL = "/sounds/sound.wav";

export default function DateStrip({ active, onChange, matches = [] }) {
    // Extract unique dates from matches (e.g., "Final • Jan 12" -> "Jan 12")
    // We use a Set to ensure uniqueness
    const rawDates = matches.map(m => {
        const parts = m.result.split("•");
        return parts.length > 1 ? parts[1].trim() : m.result;
    });

    // Dedup and keep order (though inputs should ideally be sorted by Dashboard)
    const dates = [...new Set(rawDates)];

    // If no dates, render nothing
    if (dates.length === 0) return null;

    const [playTick] = useSound(TICK_URL, { volume: 0.5, interrupt: true });

    const x = useMotionValue(0);
    const [lastIndex, setLastIndex] = useState(0);

    // Width can be slightly larger for dates as they are wider text
    const ITEM_WIDTH = 100;

    const [lastSoundIndex, setLastSoundIndex] = useState(0);

    // Sync active state to x position
    useEffect(() => {
        const index = dates.indexOf(active);
        if (index !== -1) {
            animate(x, -index * ITEM_WIDTH, {
                type: "spring",
                stiffness: 400,
                damping: 40,
                mass: 0.5
            });
            setLastIndex(index);
        }
    }, [active, dates, x]);

    useEffect(() => {
        const unsubscribe = x.on("change", (latest) => {
            const rawIndex = -latest / ITEM_WIDTH;
            const visualIndex = Math.round(rawIndex);
            const soundIndex = Math.floor(rawIndex + 0.5);

            if (visualIndex >= 0 && visualIndex < dates.length) {
                if (visualIndex !== lastIndex) {
                    setLastIndex(visualIndex);
                    const dateStr = dates[visualIndex];
                    if (onChange) onChange(dateStr);
                }
            }

            if (soundIndex !== lastSoundIndex) {
                playTick();
                setLastSoundIndex(soundIndex);
            }
        });
        return () => unsubscribe();
    }, [x, lastIndex, lastSoundIndex, onChange, playTick, dates]);

    const handleSnap = (index) => {
        animate(x, -index * ITEM_WIDTH, {
            type: "spring",
            stiffness: 400,
            damping: 40,
            mass: 0.5
        });
    };

    return (
        <div className="relative w-full h-16 flex items-center justify-center select-none overflow-hidden"
            style={{ maskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)" }}
        >
            {/* Central Active Line */}
            <div className="absolute left-1/2 -translate-x-1/2 top-2 bottom-2 w-[2px] bg-gradient-to-b from-transparent via-red-500/50 to-transparent z-20 rounded-full" />

            <motion.div
                drag="x"
                dragConstraints={{ left: -((dates.length - 1) * ITEM_WIDTH), right: 0 }}
                style={{ x, cursor: "ew-resize", marginLeft: -ITEM_WIDTH / 2 }}
                whileTap={{ cursor: "grabbing" }}
                className="flex items-center absolute left-1/2 touch-pan-x"
            >
                {dates.map((date, i) => (
                    <DialItem
                        key={date}
                        index={i}
                        label={date}
                        x={x}
                        width={ITEM_WIDTH}
                        onClick={() => handleSnap(i)}
                    />
                ))}
            </motion.div>
        </div>
    );
}

function DialItem({ index, label, x, width, onClick }) {
    const centerOffset = index * width;

    // Scale Logic
    const scale = useTransform(x, (currentX) => {
        const dist = Math.abs(currentX + centerOffset);
        if (dist > width) return 0.9;
        return 0.9 + (1 - dist / width) * 0.4;
    });

    // Opacity Logic
    const opacity = useTransform(x, (currentX) => {
        const dist = Math.abs(currentX + centerOffset);
        if (dist > width * 2) return 0.2;
        return 1 - (dist / (width * 2.5)) * 0.8;
    });

    // Color Logic
    const color = useTransform(x, (currentX) => {
        const dist = Math.abs(currentX + centerOffset);
        return dist < width / 2 ? "#111827" : "#9CA3AF";
    });

    return (
        <div className="flex items-center justify-center relative" style={{ width }}>
            <motion.button
                onClick={onClick}
                style={{ scale, opacity, color }}
                className="font-mono font-bold text-xl tracking-tight origin-center relative z-10 transition-colors uppercase"
            >
                {label}
            </motion.button>

            {/* Simple Ticks */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 h-3 w-[1px] bg-gray-300 translate-x-1/2" />
        </div>
    );
}
