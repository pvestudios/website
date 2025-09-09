import React from 'react';

// Parse markdown-style formatting and apply colors
export function parseTextWithFormatting(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const content = part.slice(2, -2); // Remove **
      return React.createElement('span', {
        key: index,
        className: 'font-bold text-brand-500 glow-text'
      }, content);
    }
    return part;
  });
}

// Parse text with custom color options
export function parseTextWithColor(text: string, color: 'green' | 'cyan' | 'purple' | 'yellow' = 'green'): React.ReactNode[] {
  const colorClasses = {
    green: 'text-brand-500',
    cyan: 'text-brand-400', 
    purple: 'text-brand-300',
    yellow: 'text-brand-200'
  };
  
  const parts = text.split(/(\*\*.*?\*\*)/g);
  
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const content = part.slice(2, -2); // Remove **
      return React.createElement('span', {
        key: index,
        className: `font-bold ${colorClasses[color]} glow-text`
      }, content);
    }
    return part;
  });
}
