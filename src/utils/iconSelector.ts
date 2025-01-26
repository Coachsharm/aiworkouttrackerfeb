import { LucideIcon, 
  Tv, IceCream, Music, Book, Coffee, Car, Heart, Star, Bell, Cloud,
  Apple, Calendar, User, Wallet, Wrench, AlarmClock, Album, Ambulance,
  Archive, AccessibilityIcon, AArrowDown, Accessibility } from 'lucide-react';

interface IconMatch {
  keywords: string[];
  icon: LucideIcon;
}

const iconMatches: IconMatch[] = [
  // Entertainment & Media
  { keywords: ['tv', 'television', 'watch', 'movie', 'show', 'screen'], icon: Tv },
  { keywords: ['music', 'song', 'playlist', 'audio', 'concert'], icon: Music },
  { keywords: ['book', 'read', 'novel', 'study', 'textbook'], icon: Book },
  { keywords: ['album', 'photo', 'picture', 'image'], icon: Album },
  
  // Food & Drink
  { keywords: ['ice cream', 'icecream', 'dessert', 'frozen', 'gelato'], icon: IceCream },
  { keywords: ['coffee', 'tea', 'drink', 'cafe', 'beverage'], icon: Coffee },
  { keywords: ['apple', 'fruit', 'food', 'snack'], icon: Apple },
  
  // Transportation
  { keywords: ['car', 'drive', 'vehicle', 'transport', 'auto'], icon: Car },
  { keywords: ['ambulance', 'emergency', 'hospital', 'medical'], icon: Ambulance },
  
  // Time & Schedule
  { keywords: ['calendar', 'schedule', 'date', 'event', 'appointment'], icon: Calendar },
  { keywords: ['alarm', 'clock', 'time', 'timer', 'reminder'], icon: AlarmClock },
  
  // Personal & Health
  { keywords: ['heart', 'love', 'health', 'favorite'], icon: Heart },
  { keywords: ['user', 'person', 'profile', 'account'], icon: User },
  { keywords: ['accessibility', 'access', 'handicap'], icon: Accessibility },
  
  // Objects & Tools
  { keywords: ['wallet', 'money', 'payment', 'finance'], icon: Wallet },
  { keywords: ['wrench', 'tool', 'fix', 'repair', 'maintenance'], icon: Wrench },
  { keywords: ['archive', 'storage', 'file', 'document'], icon: Archive },
  
  // Nature & Weather
  { keywords: ['cloud', 'weather', 'sky', 'rain'], icon: Cloud },
  
  // Misc
  { keywords: ['star', 'favorite', 'rating', 'important'], icon: Star },
  { keywords: ['bell', 'notification', 'alert', 'reminder'], icon: Bell },
  { keywords: ['arrow', 'down', 'download', 'direction'], icon: AArrowDown },
];

export const getSmartIcon = (title: string): LucideIcon | null => {
  if (!title) return null;
  
  const lowercaseTitle = title.toLowerCase();
  
  // First try exact matches
  for (const match of iconMatches) {
    if (match.keywords.some(keyword => lowercaseTitle.includes(keyword))) {
      return match.icon;
    }
  }
  
  // If no exact match, try partial word matches
  for (const match of iconMatches) {
    if (match.keywords.some(keyword => 
      lowercaseTitle.split(' ').some(word => keyword.includes(word) || word.includes(keyword))
    )) {
      return match.icon;
    }
  }
  
  return null;
};

export const getAllIcons = () => {
  return iconMatches.map(match => ({
    icon: match.icon,
    keywords: match.keywords[0], // Use first keyword as label
  }));
};