import { LucideIcon, Tv, IceCream } from 'lucide-react';

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
    keywords: ['ice cream', 'icecream'],
    icons: [IceCream]
  }
];

export const getSmartIcon = (title: string): LucideIcon | null => {
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