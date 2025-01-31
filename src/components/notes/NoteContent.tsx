import React, { useState } from 'react';
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
  const [isEditing, setIsEditing] = useState(false);

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
            className="text-blue-500 hover:text-blue-600 underline break-all"
            onClick={(e) => {
              e.stopPropagation();
              if (!isEditing) {
                window.open(href, '_blank');
              }
            }}
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    if (!(e.target as HTMLElement).closest('a')) {
      setIsEditing(true);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    setIsEditing(false);
    onContentUpdate(note.id, e.currentTarget.textContent || '');
  };

  return (
    <div className="p-4">
      <div className="animate-fade-in space-y-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
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
            <h2 className="text-2xl font-semibold text-yellow-500">
              {note.title}
            </h2>
          </div>
        </div>
        
        <div className="space-y-1 text-sm">
          <p className="text-muted-foreground/70">
            Created: {format(note.createdAt.toDate(), "dd MMMM yyyy, HH:mm:ss")}
          </p>
          <p className="text-muted-foreground">
            Modified: {format(note.modifiedAt.toDate(), "dd MMMM yyyy, HH:mm:ss")}
          </p>
        </div>

        <div className="flex">
          <div className="flex flex-col gap-2 mr-4">
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

          <div
            contentEditable={isEditing}
            suppressContentEditableWarning
            className={cn(
              "prose prose-sm max-w-none rounded-md p-2 flex-1",
              isEditing && "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            )}
            onDoubleClick={handleDoubleClick}
            onBlur={handleBlur}
            dangerouslySetInnerHTML={{
              __html: formatTextWithLinks(note.description).map(part => 
                typeof part === 'string' ? part : part?.props?.href ? 
                  `<a href="${part.props.href}" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:text-blue-600 underline break-all">${part.props.children}</a>` : 
                  ''
              ).join('')
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default NoteContent;