import React, { useState, useRef } from 'react';
import { format } from 'date-fns';
import { Share2, Copy, Pin, Trash2, Plus, ImagePlus } from 'lucide-react';
import { Button } from '../ui/button';
import { Note } from './types';
import { getSmartIcon, getAllIcons } from '@/utils/iconSelector';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
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
  onImageUpload: (noteId: string, file: File) => Promise<void>;
}

const NoteContent = ({
  note,
  isPinned,
  onShare,
  onCopy,
  onIconChange,
  onPinToggle,
  onDelete,
  onContentUpdate,
  onImageUpload
}: NoteContentProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      if (file.size > 512000) { // 0.5MB limit
        toast.error("Image size must be less than 0.5MB");
        return;
      }
      await handleImageUpload(file);
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      await onImageUpload(note.id, file);
      toast.success("Image uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload image");
    }
  };

  return (
    <div 
      className="p-4"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="animate-fade-in space-y-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold text-yellow-500">
              {note.title}
            </h2>
          </div>
          <div className="flex gap-2">
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  if (file.size > 512000) {
                    toast.error("Image size must be less than 0.5MB");
                    return;
                  }
                  handleImageUpload(file);
                }
              }}
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              title="Upload image"
            >
              <ImagePlus className="h-4 w-4" />
            </Button>
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

        {isDragging && (
          <div className="border-2 border-dashed border-primary rounded-lg p-8 text-center text-muted-foreground">
            Drop image here (max 0.5MB)
          </div>
        )}

        {note.image && (
          <div className="mt-4">
            <img 
              src={note.image.url} 
              alt={note.image.name}
              className="max-w-full rounded-lg shadow-md"
            />
          </div>
        )}

        <div
          contentEditable={isEditing}
          suppressContentEditableWarning
          className={cn(
            "prose prose-sm max-w-none rounded-md p-2",
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

        <div className="mt-12 pt-4 border-t border-border">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              Created: {format(note.createdAt.toDate(), "dd MMMM yyyy, HH:mm:ss")}
            </span>
            <span className="text-red-500">
              Modified: {format(note.modifiedAt.toDate(), "dd MMMM yyyy, HH:mm:ss")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteContent;