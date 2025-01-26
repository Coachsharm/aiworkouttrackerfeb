import { LucideIcon, 
  Tv, IceCream, Music, Book, Coffee, Car, Heart, Star, Bell, Cloud,
  Apple, Calendar, User, Wallet, Wrench, AlarmClock, Album, Ambulance,
  Archive, AccessibilityIcon, AArrowDown, Accessibility, Plane, Train,
  Bus, Bike, Ship, Rocket, Home, Building, Office, School, Hospital,
  Bank, Store, Shop, Restaurant, Hotel, Cinema, Theater, Stadium, Park,
  Beach, Mountain, Forest, River, Lake, Ocean, Sun, Moon, Wind, Rain,
  Snow, Thunder, Rainbow, Umbrella, Camera, Phone, Laptop, Desktop,
  Tablet, Watch, Printer, Router, Battery, Wifi, Bluetooth, Signal,
  Power, Settings, Tool, Key, Lock, Unlock, Mail, Send, Inbox, Trash,
  Download, Upload, Share, Link, Search, Zoom, Eye, EyeOff, Edit,
  Copy, Paste, Cut, Save, Print, Play, Pause, Stop, Forward, Backward,
  Volume, Mute, Image, Video, Audio, File, Folder, Tag, Flag, Check,
  X, Circle, Square, Triangle, Diamond, Hexagon, Octagon, Pentagon,
  Plus, Minus, Divide, Multiply, Percent, Dollar, Euro, Pound,
  Bitcoin, CreditCard } from 'lucide-react';

interface IconMatch {
  keywords: string[];
  icon: LucideIcon;
}

// Store used colors to avoid repetition
let usedColors: string[] = [];
const availableColors = [
  'red', 'blue', 'green', 'yellow', 'purple', 'pink', 'orange', 
  'teal', 'indigo', 'cyan', 'amber', 'lime', 'emerald', 'rose'
];

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
  { keywords: ['plane', 'flight', 'airport', 'travel', 'airplane'], icon: Plane },
  { keywords: ['train', 'railway', 'metro', 'subway'], icon: Train },
  { keywords: ['bus', 'coach', 'transport'], icon: Bus },
  { keywords: ['bike', 'bicycle', 'cycling'], icon: Bike },
  { keywords: ['ship', 'boat', 'cruise', 'sail'], icon: Ship },
  { keywords: ['rocket', 'space', 'launch'], icon: Rocket },
  
  // Buildings & Places
  { keywords: ['home', 'house', 'apartment'], icon: Home },
  { keywords: ['building', 'tower', 'skyscraper'], icon: Building },
  { keywords: ['office', 'workplace', 'work'], icon: Office },
  { keywords: ['school', 'education', 'university', 'college'], icon: School },
  { keywords: ['hospital', 'clinic', 'healthcare'], icon: Hospital },
  { keywords: ['bank', 'finance', 'money'], icon: Bank },
  { keywords: ['store', 'shop', 'retail'], icon: Store },
  
  // Nature & Weather
  { keywords: ['sun', 'sunny', 'day'], icon: Sun },
  { keywords: ['moon', 'night', 'dark'], icon: Moon },
  { keywords: ['cloud', 'weather', 'sky'], icon: Cloud },
  { keywords: ['rain', 'rainy', 'storm'], icon: Rain },
  { keywords: ['snow', 'winter', 'cold'], icon: Snow },
  { keywords: ['wind', 'breeze', 'weather'], icon: Wind },
  
  // Generic Icons
  { keywords: ['check', 'done', 'complete', 'success'], icon: Check },
  { keywords: ['error', 'wrong', 'incorrect', 'fail'], icon: X },
  { keywords: ['flag'], icon: Flag },
  { keywords: ['circle'], icon: Circle },
  { keywords: ['square'], icon: Square },
  { keywords: ['triangle'], icon: Triangle },
  
  // Technology
  { keywords: ['camera', 'photo', 'picture'], icon: Camera },
  { keywords: ['phone', 'mobile', 'call'], icon: Phone },
  { keywords: ['laptop', 'computer', 'pc'], icon: Laptop },
  { keywords: ['wifi', 'internet', 'network'], icon: Wifi },
  { keywords: ['battery', 'power', 'energy'], icon: Battery },
  
  // Actions
  { keywords: ['search', 'find', 'lookup'], icon: Search },
  { keywords: ['edit', 'modify', 'change'], icon: Edit },
  { keywords: ['save', 'store', 'keep'], icon: Save },
  { keywords: ['share', 'send', 'distribute'], icon: Share },
  { keywords: ['lock', 'secure', 'protect'], icon: Lock },
  { keywords: ['unlock', 'open', 'access'], icon: Unlock },
  
  // Files & Data
  { keywords: ['file', 'document', 'paper'], icon: File },
  { keywords: ['folder', 'directory', 'container'], icon: Folder },
  { keywords: ['tag', 'label', 'category'], icon: Tag },
  
  // Payment & Finance
  { keywords: ['dollar', 'money', 'cash', 'payment'], icon: Dollar },
  { keywords: ['euro', 'currency', 'money'], icon: Euro },
  { keywords: ['credit', 'card', 'payment'], icon: CreditCard },
  { keywords: ['bitcoin', 'crypto', 'cryptocurrency'], icon: Bitcoin }
];

export const getSmartIcon = (title: string): LucideIcon | null => {
  if (!title) return null;
  
  const lowercaseTitle = title.toLowerCase();
  
  // Check for "no icon" request
  if (lowercaseTitle.includes('no icon')) return null;
  
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
  
  // If no match found, return Circle with a non-repeating color
  const color = getNextAvailableColor();
  return Circle;
};

export const getAllIcons = () => {
  return [
    { icon: null, keywords: 'no icon' }, // Add "no icon" option
    ...iconMatches.map(match => ({
      icon: match.icon,
      keywords: match.keywords[0], // Use first keyword as label
    }))
  ];
};