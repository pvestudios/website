/** @type {import('tailwindcss').PluginCreator} */
module.exports = function({ addUtilities, theme }) {
  const glowUtilities = {
    '.glow': {
      boxShadow: '0 0 24px rgba(57,255,20,0.6), 0 0 48px rgba(0,240,255,0.4)',
    },
    '.glow-text': {
      textShadow: '0 0 16px rgba(57,255,20,0.6), 0 0 32px rgba(0,240,255,0.4)',
    },
    '.glow-sm': {
      boxShadow: '0 0 12px rgba(57,255,20,0.4), 0 0 24px rgba(0,240,255,0.3)',
    },
    '.glow-lg': {
      boxShadow: '0 0 36px rgba(57,255,20,0.8), 0 0 72px rgba(0,240,255,0.6)',
    },
    '.glow-text-sm': {
      textShadow: '0 0 8px rgba(57,255,20,0.4), 0 0 16px rgba(0,240,255,0.3)',
    },
    '.glow-text-lg': {
      textShadow: '0 0 24px rgba(57,255,20,0.8), 0 0 48px rgba(0,240,255,0.6)',
    },
  }

  addUtilities(glowUtilities)
}
