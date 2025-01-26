import { format } from 'date-fns';
import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Note } from './types';

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
}

const formatTextWithLinks = (text: string) => {
  // Updated regex to match URLs with or without protocol
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
          className="text-blue-400 hover:text-blue-300 underline break-all"
        >
          {part}
        </a>
      );
    }
    return part;
  });
};

const NoteCard = ({ note, onEdit, onDelete }: NoteCardProps) => {
  return (
    <Card className="p-4">
      <div className="flex justify-between items-start">
        <div className="flex flex-col">
          {note.title && (
            <h3 className="text-lg font-medium text-yellow-500">
              {note.title}
            </h3>
          )}
          <p className="text-sm text-muted-foreground">
            {format(note.createdAt.toDate(), "dd MMMM yyyy, HH:mm:ss")}
          </p>
        </div>
        <div className="flex gap-2">
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
      <p className="mt-2 text-muted-foreground whitespace-pre-wrap break-words">
        {formatTextWithLinks(note.description)}
      </p>
    </Card>
  );
};

export default NoteCard;