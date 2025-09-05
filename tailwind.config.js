/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "rgb(var(--glass-primary) / <alpha-value>)",
          light: "rgb(var(--glass-primary-light) / <alpha-value>)",
          dark: "rgb(var(--glass-primary-dark) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "rgb(var(--glass-secondary) / <alpha-value>)",
          light: "rgb(var(--glass-secondary-light) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "rgb(var(--glass-accent) / <alpha-value>)",
          light: "rgb(var(--glass-accent-light) / <alpha-value>)",
        },
        success: {
          DEFAULT: "rgb(var(--glass-success) / <alpha-value>)",
          light: "rgb(var(--glass-success-light) / <alpha-value>)",
        },
        warning: {
          DEFAULT: "rgb(var(--glass-warning) / <alpha-value>)",
          light: "rgb(var(--glass-warning-light) / <alpha-value>)",
        },
        error: {
          DEFAULT: "rgb(var(--glass-error) / <alpha-value>)",
          light: "rgb(var(--glass-error-light) / <alpha-value>)",
        },
        purple: {
          DEFAULT: "rgb(var(--glass-purple) / <alpha-value>)",
          light: "rgb(var(--glass-purple-light) / <alpha-value>)",
        },
        teal: {
          DEFAULT: "rgb(var(--glass-teal) / <alpha-value>)",
          light: "rgb(var(--glass-teal-light) / <alpha-value>)",
        },

        bg: {
          light: "rgb(var(--glass-bg-light) / <alpha-value>)",
          dark: "rgb(var(--glass-bg-dark) / <alpha-value>)",
          "gradient-start": "rgb(var(--glass-bg-gradient-start) / <alpha-value>)",
          "gradient-end": "rgb(var(--glass-bg-gradient-end) / <alpha-value>)",
        },

        text: {
          primary: "rgb(var(--glass-text-primary) / <alpha-value>)",
          secondary: "rgb(var(--glass-text-secondary) / <alpha-value>)",
          muted: "rgb(var(--glass-text-muted) / <alpha-value>)",
          light: "rgb(var(--glass-text-light) / <alpha-value>)",
        },

        border: {
          light: "rgb(var(--glass-border-light) / <alpha-value>)",
          dark: "rgb(var(--glass-border-dark) / <alpha-value>)",
        },
      },

      borderRadius: {
        sm: "0.375rem",
        md: "0.5rem",
        lg: "0.75rem",
        xl: "1rem",
        "2xl": "1.5rem",
        full: "9999px",
      },

      boxShadow: {
        sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        DEFAULT: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      },

      fontFamily: {
        sans: [
          "var(--font-sans)",
          "Inter",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },

      backdropBlur: {
        sm: "var(--glass-blur-sm)",
        DEFAULT: "var(--glass-blur-md)",
        md: "var(--glass-blur-md)",
        lg: "var(--glass-blur-lg)",
        xl: "var(--glass-blur-xl)",
      },

      backdropOpacity: {
        low: "var(--glass-opacity-low)",
        medium: "var(--glass-opacity-medium)",
        high: "var(--glass-opacity-high)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
