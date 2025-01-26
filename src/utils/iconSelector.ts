import { LucideIcon, Tv, Settings, Edit, Save, Trash, Check, X, Plus, Minus, IceCream } from 'lucide-react';

interface IconMatch {
  keywords: string[];
  icons: LucideIcon[];
}

const iconMatches: IconMatch[] = [
  {
    keywords: ['tv', 'television', 'watch tv', 'watch television'],
    icons: [Tv]
  },
  {
    keywords: ['ice cream', 'icecream', 'dessert'],
    icons: [IceCream]
  },
  {
    keywords: ['settings', 'config', 'configuration'],
    icons: [Settings]
  },
  {
    keywords: ['edit', 'modify', 'change'],
    icons: [Edit]
  },
  {
    keywords: ['save', 'store'],
    icons: [Save]
  },
  {
    keywords: ['delete', 'remove'],
    icons: [Trash]
  },
  {
    keywords: ['complete', 'done', 'finish'],
    icons: [Check]
  },
  {
    keywords: ['cancel', 'close'],
    icons: [X]
  },
  {
    keywords: ['add', 'new', 'create'],
    icons: [Plus]
  },
  {
    keywords: ['subtract', 'reduce'],
    icons: [Minus]
  }
];

export const getSmartIcon = (title: string): LucideIcon | null => {
  if (!title) return null;
  
  const lowercaseTitle = title.toLowerCase();
  
  for (const match of iconMatches) {
    if (match.keywords.some(keyword => lowercaseTitle.includes(keyword))) {
      // Randomly select an icon variation if multiple exist
      const randomIndex = Math.floor(Math.random() * match.icons.length);
      return match.icons[randomIndex];
    }
  }
  
  return null;
};