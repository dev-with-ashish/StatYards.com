/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['var(--font-inter)', 'sans-serif'],
                mono: ['var(--font-roboto-mono)', 'monospace'],
            },
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                success: "rgb(var(--accent-success))",
                danger: "rgb(var(--accent-danger))",
            },
            // Extend standard colors if 'gray-900' is missing in v4 default theme, 
            // but usually imports handle it. If not, we can rely on standard CSS vars or add it here.
        },
    },
    plugins: [],
};
