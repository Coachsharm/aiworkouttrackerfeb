import React from 'react';
import { format } from 'date-fns';
import { Share2, Copy, Pin, Trash2, Plus } from 'lucide-react';
import { Button } from '../ui/button';
import { Note } from './types';
import { getSmartIcon, getAllIcons } from '@/utils/iconSelector';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NoteContentProps {
  note: Note;
  isPinned: boolean;
  onShare: (note: Note) => void;
  onCopy: (note: Note) => void;
  onIconChange: (noteId: string, icon: string) => void;
  onPinToggle: (noteId: string) => void;
  onDelete: (noteId: string) => void;
  onContentUpdate: (noteId: string, content: string) => void;
}

const NoteContent = ({
  note,
  isPinned,
  onShare,
  onCopy,
  onIconChange,
  onPinToggle,
  onDelete,
  onContentUpdate
}: NoteContentProps) => {
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
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              window.open(href, '_blank');
            }}
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  return (
    <div className="p-4">
      <div className="animate-fade-in space-y-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold text-yellow-500">
              {note.title}
            </h2>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>Created: {format(note.createdAt.toDate(), "dd MMMM yyyy, HH:mm:ss")}</p>
              <p>Modified: {format(note.modifiedAt.toDate(), "dd MMMM yyyy, HH:mm:ss")}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onShare(note)}
              title="Share note"
            >
              <Share2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onCopy(note)}
              title="Copy note"
            >
              <Copy className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  title="Change icon"
                >
                  {note.icon ? 
                    React.createElement(getSmartIcon(note.icon) || (() => null), { className: "h-4 w-4" })
                    : <Plus className="h-4 w-4" />
                  }
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {getAllIcons().map(({ icon: Icon, keywords }) => (
                  <DropdownMenuItem
                    key={keywords}
                    onClick={() => onIconChange(note.id, keywords)}
                  >
                    <div className="flex items-center gap-2">
                      {Icon && <Icon className="h-4 w-4" />}
                      <span className="capitalize">{keywords}</span>
                      {note.icon === keywords && '✓'}
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onPinToggle(note.id)}
              title={isPinned ? "Unpin" : "Pin"}
            >
              <Pin className={cn(
                "h-4 w-4",
                isPinned && "text-yellow-500"
              )} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(note.id)}
              title="Move to trash"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div
          contentEditable
          suppressContentEditableWarning
          className="prose prose-sm max-w-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md p-2"
          onBlur={(e) => onContentUpdate(note.id, e.currentTarget.textContent || '')}
          onDoubleClick={(e) => {
            // Only enter edit mode if not clicking a link
            if (!(e.target as HTMLElement).closest('a')) {
              e.currentTarget.focus();
            }
          }}
          dangerouslySetInnerHTML={{
            __html: formatTextWithLinks(note.description).map(part => 
              typeof part === 'string' ? part : part?.props?.href ? 
                `<a href="${part.props.href}" target="_blank" rel="noopener noreferrer" class="text-primary hover:text-primary/80 underline break-all">${part.props.children}</a>` : 
                ''
            ).join('')
          }}
        />
      </div>
    </div>
  );
};

export default NoteContent;
