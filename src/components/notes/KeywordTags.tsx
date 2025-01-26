import { useState } from 'react';
import { KeywordCount } from '@/utils/keywordAnalysis';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Eye, EyeOff } from 'lucide-react';

interface KeywordTagsProps {
  keywords: KeywordCount[];
  onKeywordClick: (keyword: string) => void;
}

const KeywordTags = ({ keywords, onKeywordClick }: KeywordTagsProps) => {
  const [isVisible, setIsVisible] = useState(true);

  if (keywords.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 items-center mt-2">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Popular:</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => setIsVisible(!isVisible)}
          title={isVisible ? "Hide popular terms" : "Show popular terms"}
        >
          {isVisible ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </Button>
      </div>
      {isVisible && keywords.map(({ word, count }) => (
        <Badge
          key={word}
          variant="secondary"
          className="cursor-pointer hover:bg-secondary/80"
          onClick={() => onKeywordClick(word)}
        >
          {word} ({count})
        </Badge>
      ))}
    </div>
  );
};

export default KeywordTags;