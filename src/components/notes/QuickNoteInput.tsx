import React from 'react';
import { Plus } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

interface QuickNoteInputProps {
  value: string;
  onChange: (value: string) => void;
  onAdd: () => void;
}

const QuickNoteInput = ({ value, onChange, onAdd }: QuickNoteInputProps) => {
  return (
    <div className="flex items-center gap-2">
      <Input
        type="text"
        placeholder="Title (use comma to separate)"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            onAdd();
          }
        }}
      />
      <Button
        onClick={onAdd}
        className="gap-2 whitespace-nowrap"
        variant="outline"
      >
        <Plus className="h-4 w-4" />
        Add Note
      </Button>
    </div>
  );
};

export default QuickNoteInput;