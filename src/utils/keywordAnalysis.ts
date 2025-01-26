import { Note } from '@/components/notes/types';

const stopWords = new Set([
  'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves',
  'you', 'your', 'yours', 'yourself', 'he', 'him', 'his',
  'she', 'her', 'hers', 'it', 'its', 'itself', 'they',
  'them', 'their', 'theirs', 'themselves', 'what', 'which',
  'who', 'whom', 'this', 'that', 'these', 'those', 'am',
  'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have',
  'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'a',
  'an', 'the', 'and', 'but', 'if', 'or', 'because', 'as',
  'until', 'while', 'of', 'at', 'by', 'for', 'with', 'about',
  'against', 'between', 'into', 'through', 'during', 'before',
  'after', 'above', 'below', 'to', 'from', 'up', 'down', 'in',
  'out', 'on', 'off', 'over', 'under', 'again', 'further',
  'then', 'once'
]);

export interface KeywordCount {
  word: string;
  count: number;
}

export const extractKeywords = (notes: Note[]): KeywordCount[] => {
  const wordCounts = new Map<string, number>();

  notes.forEach(note => {
    const text = `${note.title} ${note.description}`.toLowerCase();
    
    // First, extract URLs and add them as complete keywords
    const urlRegex = /(https?:\/\/[^\s]+)|(?<!\S)(www\.[^\s]+)|((?!www\.)[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}(?:\/[^\s]*)?)/g;
    const urls = text.match(urlRegex) || [];
    urls.forEach(url => {
      wordCounts.set(url, (wordCounts.get(url) || 0) + 1);
    });

    // Then process remaining words
    const words = text
      .replace(urlRegex, '') // Remove URLs before splitting
      .split(/\s+/);

    words.forEach(word => {
      // Clean the word (remove punctuation, etc.)
      word = word.replace(/[^\w\s]/g, '');
      
      // Skip if word is too short, is a stop word, or contains numbers
      if (
        word.length <= 3 ||
        stopWords.has(word) ||
        /\d/.test(word) ||
        !word
      ) {
        return;
      }

      wordCounts.set(word, (wordCounts.get(word) || 0) + 1);
    });
  });

  // Convert to array and sort by frequency
  return Array.from(wordCounts.entries())
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5); // Get top 5 keywords
};