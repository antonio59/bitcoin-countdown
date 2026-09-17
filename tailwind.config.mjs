/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        terminal: {
          bg: '#0B0A08',
          panel: '#14110A',
          line: '#2E2718',
          text: '#F2EAD9',
          muted: '#7D7360',
          amber: '#FFB000',
          bitcoin: '#F7931A',
          led: '#4ADE80',
        },
      },
      fontFamily: {
        mono: ['var(--font-jetbrains-mono)', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
}
