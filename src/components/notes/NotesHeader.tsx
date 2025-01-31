import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import QuickNoteInput from './QuickNoteInput';
import KeywordTags from './KeywordTags';
import VoiceNoteRecorder from './VoiceNoteRecorder';
import { Mic } from 'lucide-react';

interface NotesHeaderProps {
  quickNote: string;
  setQuickNote: (value: string) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  keywords: string[];
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
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <QuickNoteInput
          value={quickNote}
          onChange={setQuickNote}
          onSubmit={onAddNote}
        />
        <VoiceNoteRecorder onSave={onVoiceNote} />
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
          onClick={() => document.querySelector('.voice-recorder-trigger')?.click()}
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