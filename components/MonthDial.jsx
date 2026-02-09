import { useRef, useEffect, useState } from "react";
import { motion, useMotionValue, animate, useTransform } from "framer-motion";
import useSound from "use-sound";

// Sound effect - Custom User Sound
const TICK_URL = "/sounds/sound.wav";

export default function MonthDial({ active, onChange, months = [] }) {
    // If no months provided, show a placeholder or current month
    const displayMonths = months.length > 0 ? months : ["NOW"];

    const [playTick] = useSound(TICK_URL, { volume: 0.5, interrupt: true });

    const x = useMotionValue(0);
    // Removed useSpring here because we want raw control for drag
    // animate() will provide smooth spring physics for clicks
    const [lastIndex, setLastIndex] = useState(0);

    // Reduced width for inline fit
    const ITEM_WIDTH = 80;

    // Track last played integer index to sound ONLY when center is crossed
    const [lastSoundIndex, setLastSoundIndex] = useState(0);

    // Initial Sync with Active Prop
    useEffect(() => {
        if (active && displayMonths.length > 0) {
            const index = displayMonths.findIndex(m => m.toUpperCase() === active.toUpperCase());
            if (index !== -1) {
                const targetX = -index * ITEM_WIDTH;
                // Only update if significantly different to establish initial position
                // or if external change occurred
                if (Math.abs(x.get() - targetX) > 1) {
                    x.set(targetX);
                    setLastIndex(index);
                }
            }
        }
    }, [active, displayMonths, ITEM_WIDTH, x]);

    useEffect(() => {
        const unsubscribe = x.on("change", (latest) => {
            const rawIndex = -latest / ITEM_WIDTH;

            // Visual Update: Highlights the closest month (Standard Snap behavior)
            const visualIndex = Math.round(rawIndex);

            // Sound Update: Triggers EXACTLY when the month hits the center line
            const soundIndex = Math.floor(rawIndex + 0.5);

            if (visualIndex >= 0 && visualIndex < displayMonths.length) {
                if (visualIndex !== lastIndex) {
                    setLastIndex(visualIndex);
                    const monthId = displayMonths[visualIndex].toLowerCase();
                    if (onChange) onChange(monthId);
                }
            }

            if (soundIndex !== lastSoundIndex) {
                playTick();
                setLastSoundIndex(soundIndex);
            }
        });
        return () => unsubscribe();
    }, [x, lastIndex, lastSoundIndex, onChange, playTick]);

    const handleSnap = (index) => {
        animate(x, -index * ITEM_WIDTH, {
            type: "spring",
            stiffness: 400,
            damping: 40,
            mass: 0.5
        });
    };

    return (
        // Flexible width container to fill parent
        // h-16 is compact enough for a header line
        <div className="relative w-full h-16 flex items-center justify-center select-none overflow-hidden"
            style={{ maskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)" }}
        >

            {/* Central Active Line - Subtle Gradient */}
            <div className="absolute left-1/2 -translate-x-1/2 top-2 bottom-2 w-[2px] bg-gradient-to-b from-transparent via-red-500/50 to-transparent z-20 rounded-full" />

            <motion.div
                drag="x"
                dragConstraints={{ left: -((displayMonths.length - 1) * ITEM_WIDTH), right: 0 }}
                style={{ x, cursor: "ew-resize", marginLeft: -ITEM_WIDTH / 2 }}
                whileTap={{ cursor: "grabbing" }}
                className="flex items-center absolute left-1/2 touch-pan-x"
            >
                {displayMonths.map((month, i) => (
                    <DialItem
                        key={month}
                        index={i}
                        label={month}
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
        return 0.9 + (1 - dist / width) * 0.4; // Peaks at ~1.3
    });

    // Opacity Logic
    const opacity = useTransform(x, (currentX) => {
        const dist = Math.abs(currentX + centerOffset);
        if (dist > width * 2) return 0.2;
        return 1 - (dist / (width * 2.5)) * 0.8;
    });

    // Color Logic with gradient text support
    const isCenter = useTransform(x, (currentX) => {
        return Math.abs(currentX + centerOffset) < width / 2;
    });

    // We can't interpolate 'background-clip' easily with simple framer motion values in this way 
    // without a complex setup, so we toggle classes or styles.
    const color = useTransform(x, (currentX) => {
        const dist = Math.abs(currentX + centerOffset);
        // Active = Dark Gray/Black, Inactive = Light Gray
        return dist < width / 2 ? "#111827" : "#9CA3AF";
    });

    return (
        <div className="flex items-center justify-center relative" style={{ width }}>
            <motion.button
                onClick={onClick}
                style={{ scale, opacity, color }}
                className="font-mono font-bold text-xl tracking-tight origin-center relative z-10 transition-colors"
            >
                {label}
            </motion.button>

            {/* Simple Ticks - Darker for visibility */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 h-3 w-[1px] bg-gray-300 translate-x-1/2" />
        </div>
    );
}
