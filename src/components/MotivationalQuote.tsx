import { useEffect, useState } from 'react';

interface Quote {
  text: string;
  author?: string;
  source?: string;
}

const quotes: Quote[] = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "Everything you've ever wanted is on the other side of fear.", author: "George Addair" },
  { text: "The only limit to our realization of tomorrow will be our doubts of today.", author: "Franklin D. Roosevelt" },
  { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
  { text: "Life is 10% what happens to you and 90% how you react to it.", author: "Charles R. Swindoll" },
  { text: "Whether you think you can or you think you can't, you're right.", author: "Henry Ford" },
  { text: "The best time to plant a tree was 20 years ago. The second best time is now.", source: "Chinese Proverb" }
];

const MotivationalQuote = () => {
  const [quote, setQuote] = useState<Quote | null>(null);

  useEffect(() => {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote);
  }, []);

  if (!quote) return null;

  return (
    <div className="text-center animate-fade-in">
      <p className="text-red-500 dark:text-red-400 text-lg font-medium mb-1">
        "{quote.text}"
      </p>
      {(quote.author || quote.source) && (
        <p className="text-gray-400 dark:text-gray-500 text-sm">
          — {quote.author || quote.source}
        </p>
      )}
    </div>
  );
};

export default MotivationalQuote;