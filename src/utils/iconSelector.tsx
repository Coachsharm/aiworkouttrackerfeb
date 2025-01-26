import { LucideIcon, 
  // Basic UI Icons
  Circle, Square, Triangle, Hexagon, Star,
  Plus, Minus, Check, X,
  
  // Navigation & Actions
  Search, ArrowUp, ArrowDown, ArrowLeft, ArrowRight,
  ChevronUp, ChevronDown, ChevronLeft, ChevronRight,
  
  // File & Data
  File, FileText, Folder, Archive,
  Upload, Download, Share, Link,
  
  // Communication
  Mail, MessageCircle, MessageSquare, Bell,
  
  // Media
  Image, Music, Video, Camera, Headphones, Speaker,
  
  // Devices
  Laptop, Phone, Tablet, Monitor, Printer,
  
  // Security
  Lock, Unlock, Shield, ShieldCheck, Key,
  
  // User
  User, Users, UserCheck, UserMinus, UserPlus,
  
  // Weather
  Sun, Cloud, Moon, Umbrella, Wind,
  
  // Transportation
  Car, Bus, Plane, Train, Ship, Bike,
  
  // Places
  Home, Building, MapPin, Globe,
  
  // Shopping
  ShoppingCart, CreditCard, Wallet,
  
  // Time
  Clock, Timer, Calendar, Alarm,
  
  // Health
  Heart, Activity, Stethoscope, Pill,
  
  // Tools
  Settings, Wrench, Scissors, Tool,
  
  // Food & Drink
  Coffee, Apple,
  
  // Nature
  Flower2 as Flower, Fish, Bird as BirdIcon,
  
  // Misc
  Flag, Bookmark, Gift, Tag,
  StickyNote, Notebook, NotebookPen, NotepadText,
  TextQuote, Palette, Book, Gamepad,
  
  // Emotions
  Smile, Frown, Meh
} from 'lucide-react';

interface IconMatch {
  keywords: string[];
  icon: LucideIcon;
}

const availableColors = [
  'red', 'blue', 'green', 'yellow', 'purple', 'pink', 'orange', 
  'teal', 'indigo', 'cyan', 'amber', 'lime', 'emerald', 'rose'
];

let usedColors: string[] = [];

const getNextAvailableColor = (): string => {
  const unusedColors = availableColors.filter(color => !usedColors.includes(color));
  if (unusedColors.length === 0) {
    usedColors = []; // Reset if all colors are used
    return availableColors[0];
  }
  const nextColor = unusedColors[0];
  usedColors.push(nextColor);
  return nextColor;
};

const iconMatches: IconMatch[] = [
  // Note-specific icons
  { keywords: ['note', 'sticky', 'memo'], icon: StickyNote },
  { keywords: ['notebook', 'journal'], icon: Notebook },
  { keywords: ['writing', 'pen', 'write'], icon: NotebookPen },
  { keywords: ['notepad', 'text', 'document'], icon: NotepadText },
  { keywords: ['quote', 'citation'], icon: TextQuote },
  
  // Importance markers
  { keywords: ['flag', 'important', 'urgent'], icon: Flag },
  { keywords: ['bookmark', 'save', 'mark'], icon: Bookmark },
  
  // Food and Drinks
  { keywords: ['coffee', 'cafe', 'drink'], icon: Coffee },
  { keywords: ['apple', 'fruit', 'food'], icon: Apple },
  
  // Nature
  { keywords: ['flower', 'nature', 'plant'], icon: Flower },
  { keywords: ['fish', 'sea', 'water'], icon: Fish },
  { keywords: ['bird', 'animal', 'fly'], icon: BirdIcon },
  
  // Weather
  { keywords: ['sun', 'sunny', 'day'], icon: Sun },
  { keywords: ['cloud', 'weather', 'sky'], icon: Cloud },
  { keywords: ['moon', 'night', 'dark'], icon: Moon },
  { keywords: ['umbrella', 'rain', 'weather'], icon: Umbrella },
  
  // Tech and Devices
  { keywords: ['laptop', 'computer', 'pc'], icon: Laptop },
  { keywords: ['phone', 'mobile', 'cell'], icon: Phone },
  { keywords: ['tablet', 'ipad', 'device'], icon: Tablet },
  { keywords: ['printer', 'print', 'hardware'], icon: Printer },
  { keywords: ['camera', 'photo', 'picture'], icon: Camera },
  { keywords: ['headphones', 'audio', 'sound'], icon: Headphones },
  { keywords: ['speaker', 'audio', 'music'], icon: Speaker },
  
  // Activities and Hobbies
  { keywords: ['art', 'paint', 'drawing'], icon: Palette },
  { keywords: ['music', 'song', 'audio'], icon: Music },
  { keywords: ['book', 'reading', 'study'], icon: Book },
  { keywords: ['game', 'gaming', 'play'], icon: Gamepad },
  
  // Emotions and States
  { keywords: ['happy', 'smile', 'good'], icon: Smile },
  { keywords: ['sad', 'frown', 'bad'], icon: Frown },
  { keywords: ['neutral', 'meh', 'okay'], icon: Meh },
  { keywords: ['love', 'heart', 'like'], icon: Heart },
  { keywords: ['star', 'favorite', 'important'], icon: Star },
];

export const getSmartIcon = (title: string): LucideIcon | null => {
  if (!title) return null;
  
  const lowercaseTitle = title.toLowerCase();
  
  if (lowercaseTitle.includes('no icon')) return null;
  
  for (const match of iconMatches) {
    if (match.keywords.some(keyword => lowercaseTitle.includes(keyword))) {
      return match.icon;
    }
  }
  
  for (const match of iconMatches) {
    if (match.keywords.some(keyword => 
      lowercaseTitle.split(' ').some(word => keyword.includes(word) || word.includes(keyword))
    )) {
      return match.icon;
    }
  }
  
  return (props: any) => <Circle {...props} color={getNextAvailableColor()} />;
};

export const getAllIcons = () => {
  return [
    { icon: null, keywords: 'no icon' },
    ...iconMatches.map(match => ({
      icon: match.icon,
      keywords: match.keywords[0], // Use first keyword as label
    }))
  ];
};