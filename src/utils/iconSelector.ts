import { LucideIcon, Tv, IceCream } from 'lucide-react';

interface IconMatch {
  keywords: string[];
  icon: LucideIcon;
}

const iconMatches: IconMatch[] = [
  {
    keywords: ['tv', 'television', 'watch tv', 'watch television', 'movie', 'show'],
    icon: Tv
  },
  {
    keywords: ['ice cream', 'icecream', 'dessert', 'frozen', 'gelato'],
    icon: IceCream
  }
];

export const getSmartIcon = (title: string): LucideIcon | null => {
  if (!title) return null;
  
  const lowercaseTitle = title.toLowerCase();
  
  for (const match of iconMatches) {
    if (match.keywords.some(keyword => lowercaseTitle.includes(keyword))) {
      return match.icon;
    }
  }
  
  return null;
};