import { KeywordCount } from '@/utils/keywordAnalysis';
import { Badge } from '../ui/badge';

interface KeywordTagsProps {
  keywords: KeywordCount[];
  onKeywordClick: (keyword: string) => void;
}

const KeywordTags = ({ keywords, onKeywordClick }: KeywordTagsProps) => {
  if (keywords.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 items-center mt-2">
      <span className="text-sm text-muted-foreground">Popular:</span>
      {keywords.map(({ word, count }) => (
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