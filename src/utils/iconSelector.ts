import { LucideIcon, 
  Tv, IceCream, Music, Book, Coffee, Car, Heart, Star, Bell, Cloud,
  Apple, Calendar, User, Wallet, Wrench, Album, Ambulance,
  Archive, Accessibility, ArrowDown, Plane, Train,
  Bus, Bike, Ship, Rocket, Home, Building, School, Hospital,
  Store, Hotel, Theater, Mountain, Sun, Moon, Wind, Brain,
  Camera, Phone, Laptop, Monitor, Watch, Printer, Router, Battery, 
  Wifi, Bluetooth, Signal, Power, Settings, Key, Lock, Unlock, 
  Mail, Send, Inbox, Trash, Download, Upload, Share, Link, Search, 
  Eye, EyeOff, Edit, Copy, Pause, Pin, Play, Forward, Radio, File, 
  Folder, Tag, Flag, Check, X, Circle, Square, Triangle, Diamond, 
  Hexagon, Octagon, Pentagon, Plus, Minus, Euro, 
  CreditCard, BellRing, Bookmark, Box, Briefcase, Calculator,
  ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Clock,
  Code, Cog, Command, Compass, Contact, Database, FileText,
  Filter, Fingerprint, Fish, FlaskConical, Flower, Focus, Frame,
  Gamepad2, Gift, Globe, GraduationCap, Grid, HandMetal, 
  HardDrive, Hash, Headphones, HelpCircle, History,
  Image, Info, Keyboard, Lamp, Languages,
  Layers, Layout, Library, Lightbulb, Link2, List, Loader,
  LogIn, LogOut, Map, MapPin, Maximize,
  Medal, MessageCircle, MessageSquare, Mic,
  MoreHorizontal, MoreVertical, Mouse,
  Navigation, Network, Newspaper, Package,
  Palette, PanelLeft, PanelRight, Paperclip, Pencil,
  PieChart, Pizza, Plug, Pointer,
  Puzzle, QrCode, Quote, Redo, 
  RefreshCw, Reply, Rewind, Rss, Scissors,
  Server, Shield, ShieldCheck,
  ShieldQuestion, ShoppingBag, ShoppingCart, Shuffle,
  Sidebar, Sliders, Smartphone, Smile, Speaker,
  StopCircle, Sunrise, Sunset, Table, Tablet,
  Target, Terminal, Thermometer, ThumbsDown, ThumbsUp,
  Ticket, Timer, Trophy, Type, Umbrella, Undo,
  UserCheck, UserMinus, UserPlus, Users, Video, ViewIcon,
  ZoomIn, ZoomOut, StickyNote, Notebook, NotebookPen, NotepadText, TextQuote,
  FlagTriangleLeft, FlagTriangleRight, Tree, Flower, Bird, Fish, Cat, Dog, 
  Sun, Cloud, Moon, Rainbow, Umbrella, Laptop, Phone, Tablet, Desktop, 
  Printer, Camera, Headphones, Speaker, Palette, Music, Book, GamepadTwo, 
  Dumbbell, Bike, Running, Swimming, Smile, Frown, Meh, Heart, Star, 
  ThumbsUp, ThumbsDown, Briefcase, Calendar, Clock, Timer, Alarm, Bell, 
  Mail, MessageCircle, MessageSquare, Phone as PhoneCall, Video, 
  ShoppingCart, CreditCard, Wallet, DollarSign, Receipt, Stethoscope, 
  Pills, FirstAid, Activity, Heart as HeartPulse, Plane, Car, Train, 
  Bus, Ship, MapPin, Compass, Home, Bed, Sofa, Bath, Kitchen, Door, 
  Tool, Wrench, Scissors, Key, Lock, Search, File, FileText, Folder, 
  Archive, Download, Upload, Image, Film, Camera as PhotoCamera, 
  Music as MusicNote, Share, Link, Globe, Users, User, Shield, 
  ShieldCheck, ShieldAlert, Key as AccessKey, Check, X, AlertCircle, 
  InfoIcon, HelpCircle, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, 
  ChevronUp, Circle, Square, Triangle, Hexagon, Star as StarShape } from 'lucide-react';

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
  // Note-specific icons
  { keywords: ['note', 'sticky', 'memo'], icon: StickyNote },
  { keywords: ['notebook', 'journal'], icon: Notebook },
  { keywords: ['writing', 'pen', 'write'], icon: NotebookPen },
  { keywords: ['notepad', 'text', 'document'], icon: NotepadText },
  { keywords: ['quote', 'citation'], icon: TextQuote },
  
  // Colored flags for importance
  { keywords: ['flag', 'important', 'urgent'], icon: Flag },
  { keywords: ['flag left', 'mark left'], icon: FlagTriangleLeft },
  { keywords: ['flag right', 'mark right'], icon: FlagTriangleRight },
  
  // Food and Drinks
  { keywords: ['apple', 'fruit'], icon: Apple },
  { keywords: ['pizza', 'food'], icon: Pizza },
  { keywords: ['coffee', 'cafe', 'drink'], icon: Coffee },
  { keywords: ['ice cream', 'dessert'], icon: IceCream },
  { keywords: ['sandwich', 'lunch'], icon: Sandwich },
  { keywords: ['cake', 'birthday'], icon: Cake },
  { keywords: ['cookie', 'snack'], icon: Cookie },
  { keywords: ['beer', 'alcohol'], icon: Beer },
  { keywords: ['wine', 'drink'], icon: Wine },

  // Nature and Weather
  { keywords: ['tree', 'nature', 'plant'], icon: Tree },
  { keywords: ['flower', 'garden'], icon: Flower },
  { keywords: ['bird', 'animal'], icon: Bird },
  { keywords: ['fish', 'sea'], icon: Fish },
  { keywords: ['cat', 'pet'], icon: Cat },
  { keywords: ['dog', 'pet'], icon: Dog },
  { keywords: ['sun', 'sunny', 'day'], icon: Sun },
  { keywords: ['cloud', 'weather'], icon: Cloud },
  { keywords: ['moon', 'night'], icon: Moon },
  { keywords: ['rainbow', 'weather'], icon: Rainbow },
  { keywords: ['umbrella', 'rain'], icon: Umbrella },

  // Tech and Devices
  { keywords: ['laptop', 'computer'], icon: Laptop },
  { keywords: ['phone', 'mobile'], icon: Phone },
  { keywords: ['tablet', 'ipad'], icon: Tablet },
  { keywords: ['desktop', 'pc'], icon: Desktop },
  { keywords: ['printer', 'print'], icon: Printer },
  { keywords: ['camera', 'photo'], icon: Camera },
  { keywords: ['headphones', 'audio'], icon: Headphones },
  { keywords: ['speaker', 'sound'], icon: Speaker },

  // Activities and Hobbies
  { keywords: ['art', 'paint', 'drawing'], icon: Palette },
  { keywords: ['music', 'song'], icon: Music },
  { keywords: ['book', 'reading'], icon: Book },
  { keywords: ['game', 'gaming'], icon: GamepadTwo },
  { keywords: ['exercise', 'gym'], icon: Dumbbell },
  { keywords: ['bike', 'cycling'], icon: Bike },
  { keywords: ['run', 'running'], icon: Running },
  { keywords: ['swim', 'swimming'], icon: Swimming },

  // Emotions and States
  { keywords: ['happy', 'smile'], icon: Smile },
  { keywords: ['sad', 'frown'], icon: Frown },
  { keywords: ['neutral', 'meh'], icon: Meh },
  { keywords: ['love', 'heart'], icon: Heart },
  { keywords: ['star', 'favorite'], icon: Star },
  { keywords: ['like', 'thumbs up'], icon: ThumbsUp },
  { keywords: ['dislike', 'thumbs down'], icon: ThumbsDown },
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
  const CircleWithColor = (props: any) => {
    return <Circle {...props} color={getNextAvailableColor()} />;
  };
  
  return CircleWithColor;
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
