import React from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '../ui/input';
import { Separator } from '../ui/separator';
import KeywordTags from './KeywordTags';
import QuickNoteInput from './QuickNoteInput';
import { KeywordCount } from '@/utils/keywordAnalysis';

interface NotesHeaderProps {
  quickNote: string;
  setQuickNote: (value: string) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  keywords: KeywordCount[];
  onAddNote: () => void;
  onKeywordClick: (keyword: string) => void;
}

const NotesHeader = ({
  quickNote,
  setQuickNote,
  searchQuery,
  setSearchQuery,
  keywords,
  onAddNote,
  onKeywordClick
}: NotesHeaderProps) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4">
        <QuickNoteInput
          value={quickNote}
          onChange={setQuickNote}
          onAdd={onAddNote}
        />

        <div className="relative">
          <Input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500 hover:text-red-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <KeywordTags keywords={keywords} onKeywordClick={onKeywordClick} />
      </div>
      <Separator className="my-4" />
    </div>
  );
};

export default NotesHeader;