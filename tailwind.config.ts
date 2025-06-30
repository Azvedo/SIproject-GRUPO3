// tailwind.config.ts
import type { Config } from 'tailwindcss'

export default {
  content: {
    files: ['./app/**/*.{js,ts,jsx,tsx,mdx}'],
    // A MÁGICA ACONTECE AQUI!
    // Adicionamos todas as classes dinâmicas que queremos garantir que sejam geradas.
    safelist: [
      'bg-[var(--color-sand)]',
      'bg-[var(--color-mud)]',
      'bg-[var(--color-water)]',
      'bg-[var(--color-obstacle)]',
      'bg-[var(--color-visited)]',
      'bg-[var(--color-frontier)]',
      'bg-[var(--color-path)]',
      'bg-[var(--color-agent)]',
    ],
  },

  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config