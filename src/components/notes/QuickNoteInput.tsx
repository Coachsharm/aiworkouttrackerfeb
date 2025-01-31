import React from 'react';
import { Plus } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import VoiceNoteRecorder from './VoiceNoteRecorder';

interface QuickNoteInputProps {
  value: string;
  onChange: (value: string) => void;
  onAdd: () => void;
  onVoiceNote: (title: string, audioUrl: string) => void;
}

const QuickNoteInput = ({ value, onChange, onAdd, onVoiceNote }: QuickNoteInputProps) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onAdd();
    }
  };

  return (
    <div className="flex items-center gap-2 w-full max-w-[calc(100%-2rem)] mx-auto">
      <Input
        type="text"
        placeholder="Title, description (use comma to separate)"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1"
        onKeyDown={handleKeyDown}
      />
      <Button
        onClick={onAdd}
        className="gap-2 whitespace-nowrap"
        variant="outline"
      >
        <Plus className="h-4 w-4" />
        Add Note
      </Button>
      <VoiceNoteRecorder onSave={onVoiceNote} />
    </div>
  );
};

export default QuickNoteInput;