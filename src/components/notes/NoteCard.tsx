import { format } from 'date-fns';
import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Note } from './types';
import { getSmartIcon } from '@/utils/iconSelector';
import { useEffect, useState } from 'react';

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
}

const formatTextWithLinks = (text: string) => {
  const urlRegex = /(https?:\/\/[^\s]+)|(?<!\S)(www\.[^\s]+)|((?!www\.)[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}(?:\/[^\s]*)?)/g;
  
  return text.split(urlRegex).map((part, i) => {
    if (!part) return null;
    
    if (part.match(urlRegex)) {
      let href = part;
      if (part.startsWith('www.')) {
        href = `https://${part}`;
      } else if (!part.startsWith('http')) {
        href = `https://${part}`;
      }
      
      return (
        <a
          key={i}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:text-primary/80 underline break-all"
        >
          {part}
        </a>
      );
    }
    return part;
  });
};

const NoteCard = ({ note, onEdit, onDelete }: NoteCardProps) => {
  const [SmartIcon, setSmartIcon] = useState<any>(null);

  useEffect(() => {
    const icon = getSmartIcon(note.title);
    setSmartIcon(icon);
  }, [note.title]);

  return (
    <Card className="p-4 space-y-4">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {SmartIcon && (
              <SmartIcon className="h-5 w-5 text-muted-foreground shrink-0" />
            )}
            {note.title && note.title.trim() !== '' && (
              <h3 className="text-lg font-medium dark:text-amber-400 text-amber-600">
                {note.title}
              </h3>
            )}
          </div>
          <p className="text-black dark:text-white whitespace-pre-wrap break-words mb-2">
            {formatTextWithLinks(note.description)}
          </p>
          <p className="text-sm text-muted-foreground">
            {format(note.createdAt.toDate(), "dd MMMM yyyy, HH:mm:ss")}
          </p>
        </div>
        <div className="flex gap-2 ml-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(note)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(note.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default NoteCard;