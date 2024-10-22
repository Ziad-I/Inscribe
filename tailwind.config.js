/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        chalky: "var(--chalky)",
        coral: "var(--coral)",
        cyan: "var(--cyan)",
        invalid: "var(--invalid)",
        ivory: "var(--ivory)",
        stone: "var(--stone)",
        malibu: "var(--malibu)",
        sage: "var(--sage)",
        whiskey: "var(--whiskey)",
        violet: "var(--violet)",
        darkBackground: "var(--dark-background)",
        highlightBackground: "var(--highlight-background)",
        background: "var(--background)",
        tooltipBackground: "var(--tooltip-background)",
        selection: "var(--selection)",
        cursor: "var(--cursor)",
      },
    },
  },
  plugins: [],
};
