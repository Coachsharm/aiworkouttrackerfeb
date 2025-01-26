import { LucideIcon, 
  Tv, IceCream, Music, Book, Coffee, Car, Heart, Star, Bell, Cloud,
  Apple, Calendar, User, Wallet, Wrench, AlarmClock, Album, Ambulance,
  Archive, AccessibilityIcon, ArrowDown, Accessibility, Plane, Train,
  Bus, Bike, Ship, Rocket, Home, Building, School, Hospital,
  Store, Hotel, Theater, Mountain, Sun, Moon, Wind, Brain,
  Camera, Phone, Laptop, Monitor, Watch, Printer, Router, Battery, 
  Wifi, Bluetooth, Signal, Power, Settings, Key, Lock, Unlock, 
  Mail, Send, Inbox, Trash, Download, Upload, Share, Link, Search, 
  Eye, EyeOff, Edit, Copy, Pause, Pin, Play, Forward, Radio, File, 
  Folder, Tag, Flag, Check, X, Circle, Square, Triangle, Diamond, 
  Hexagon, Octagon, Pentagon, Plus, Minus, DollarSign, Euro, 
  CreditCard, BellRing, Bookmark, Box, Briefcase, Calculator,
  ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Clock,
  Code, Cog, Command, Compass, Contact, Database, FileText,
  Filter, Fingerprint, Fish, FlaskConical, Flower, Focus, Frame,
  Gamepad2, Gift, Globe, GraduationCap, Grid, HandMetal, 
  HardDrive, Hash, Headphones, Heart, HelpCircle, History,
  Home, Image, Inbox, Info, Key, Keyboard, Lamp, Languages,
  Layers, Layout, Library, Lightbulb, Link2, List, Loader,
  Location, Lock, LogIn, LogOut, Map, MapPin, Maximize,
  Medal, MessageCircle, MessageSquare, Mic, Monitor, Moon,
  MoreHorizontal, MoreVertical, Mountain, Mouse, Music,
  Navigation, Network, Newspaper, NotebookPen, Package,
  Palette, PanelLeft, PanelRight, Paperclip, Pencil, Phone,
  PieChart, Pizza, Plane, Plant, Play, Plug, Plus, Pointer,
  Power, Printer, Puzzle, QrCode, Quote, Radio, Redo, 
  RefreshCw, Reply, Rewind, Rocket, Rss, Scissors, Search,
  Send, Server, Settings, Share, Shield, ShieldCheck,
  ShieldQuestion, ShoppingBag, ShoppingCart, Shuffle,
  Sidebar, Signal, Sliders, Smartphone, Smile, Speaker,
  Star, StopCircle, Sun, Sunrise, Sunset, Table, Tablet,
  Tag, Target, Terminal, Thermometer, ThumbsDown, ThumbsUp,
  Ticket, Timer, Tool, Trash, Trash2, Trophy, Truck, Tv,
  Type, Umbrella, Undo, Upload, User, UserCheck, UserMinus,
  UserPlus, Users, Video, ViewIcon, Wallet, Watch, Wifi,
  Wind, Wrench, ZoomIn, ZoomOut } from 'lucide-react';

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
  { keywords: ['pizza', 'food', 'meal', 'restaurant'], icon: Pizza },
  
  // Transportation
  { keywords: ['car', 'drive', 'vehicle', 'transport', 'auto'], icon: Car },
  { keywords: ['ambulance', 'emergency', 'hospital', 'medical'], icon: Ambulance },
  { keywords: ['plane', 'flight', 'airport', 'travel', 'airplane'], icon: Plane },
  { keywords: ['train', 'railway', 'metro', 'subway'], icon: Train },
  { keywords: ['bus', 'coach', 'transport'], icon: Bus },
  { keywords: ['bike', 'bicycle', 'cycling'], icon: Bike },
  { keywords: ['ship', 'boat', 'cruise', 'sail'], icon: Ship },
  { keywords: ['rocket', 'space', 'launch'], icon: Rocket },
  { keywords: ['truck', 'delivery', 'shipping'], icon: Truck },
  
  // Buildings & Places
  { keywords: ['home', 'house', 'apartment'], icon: Home },
  { keywords: ['building', 'tower', 'skyscraper'], icon: Building },
  { keywords: ['school', 'education', 'university', 'college'], icon: School },
  { keywords: ['hospital', 'clinic', 'healthcare'], icon: Hospital },
  { keywords: ['store', 'shop', 'retail'], icon: Store },
  { keywords: ['hotel', 'lodging', 'accommodation'], icon: Hotel },
  
  // Nature & Weather
  { keywords: ['sun', 'sunny', 'day'], icon: Sun },
  { keywords: ['moon', 'night', 'dark'], icon: Moon },
  { keywords: ['cloud', 'weather', 'sky'], icon: Cloud },
  { keywords: ['wind', 'breeze', 'weather'], icon: Wind },
  { keywords: ['mountain', 'peak', 'hill'], icon: Mountain },
  { keywords: ['plant', 'tree', 'nature'], icon: Plant },
  
  // Technology
  { keywords: ['camera', 'photo', 'picture'], icon: Camera },
  { keywords: ['phone', 'mobile', 'call'], icon: Phone },
  { keywords: ['laptop', 'computer', 'pc'], icon: Laptop },
  { keywords: ['monitor', 'screen', 'display'], icon: Monitor },
  { keywords: ['printer', 'print', 'document'], icon: Printer },
  { keywords: ['wifi', 'internet', 'network'], icon: Wifi },
  { keywords: ['battery', 'power', 'energy'], icon: Battery },
  { keywords: ['bluetooth', 'wireless', 'connection'], icon: Bluetooth },
  
  // Actions & UI
  { keywords: ['search', 'find', 'lookup'], icon: Search },
  { keywords: ['edit', 'modify', 'change'], icon: Edit },
  { keywords: ['copy', 'duplicate', 'clone'], icon: Copy },
  { keywords: ['share', 'send', 'distribute'], icon: Share },
  { keywords: ['lock', 'secure', 'protect'], icon: Lock },
  { keywords: ['unlock', 'open', 'access'], icon: Unlock },
  { keywords: ['download', 'get', 'fetch'], icon: Download },
  { keywords: ['upload', 'put', 'send'], icon: Upload },
  
  // Files & Data
  { keywords: ['file', 'document', 'paper'], icon: File },
  { keywords: ['folder', 'directory', 'container'], icon: Folder },
  { keywords: ['tag', 'label', 'category'], icon: Tag },
  
  // Payment & Finance
  { keywords: ['dollar', 'money', 'cash', 'payment'], icon: DollarSign },
  { keywords: ['euro', 'currency', 'money'], icon: Euro },
  { keywords: ['credit', 'card', 'payment'], icon: CreditCard },
  { keywords: ['wallet', 'money', 'payment'], icon: Wallet },
  
  // Generic Icons
  { keywords: ['check', 'done', 'complete', 'success'], icon: Check },
  { keywords: ['error', 'wrong', 'incorrect', 'fail'], icon: X },
  { keywords: ['flag'], icon: Flag },
  { keywords: ['circle'], icon: Circle },
  { keywords: ['square'], icon: Square },
  { keywords: ['triangle'], icon: Triangle },
  { keywords: ['star', 'favorite', 'bookmark'], icon: Star },
  { keywords: ['heart', 'like', 'love'], icon: Heart },
  { keywords: ['bell', 'notification', 'alert'], icon: Bell }
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