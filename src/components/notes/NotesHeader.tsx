import React from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Mic } from 'lucide-react';
import QuickNoteInput from './QuickNoteInput';
import KeywordTags from './KeywordTags';
import VoiceNoteRecorder from './VoiceNoteRecorder';
import { KeywordCount } from '@/utils/keywordAnalysis';

interface NotesHeaderProps {
  quickNote: string;
  setQuickNote: (value: string) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  keywords: KeywordCount[];
  onAddNote: () => void;
  onKeywordClick: (keyword: string) => void;
  onVoiceNote: (title: string, audioUrl: string) => void;
}

const NotesHeader = ({
  quickNote,
  setQuickNote,
  searchQuery,
  setSearchQuery,
  keywords,
  onAddNote,
  onKeywordClick,
  onVoiceNote
}: NotesHeaderProps) => {
  const handleVoiceRecorderClick = () => {
    const voiceRecorderButton = document.querySelector('.voice-recorder-trigger') as HTMLButtonElement;
    if (voiceRecorderButton) {
      voiceRecorderButton.click();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <QuickNoteInput
          value={quickNote}
          onChange={setQuickNote}
          onAdd={onAddNote}
          onVoiceNote={onVoiceNote}
        />
      </div>
      <div className="flex items-center gap-2">
        <Input
          type="search"
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={handleVoiceRecorderClick}
        >
          <Mic className="h-4 w-4" />
          <span>+ voice note</span>
        </Button>
      </div>
      <KeywordTags keywords={keywords} onKeywordClick={onKeywordClick} />
    </div>
  );
};

export default NotesHeader;