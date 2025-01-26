import React from 'react';
import { Button } from '../ui/button';
import { ArrowUpDown, Pin, Trash, RotateCcw } from 'lucide-react';
import { Note, SortOption } from './types';
import { getSmartIcon } from '@/utils/iconSelector';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NoteSidebarProps {
  notes: Note[];
  trashedNotes: Note[];
  selectedNote: Note | null;
  sortOption: SortOption;
  sortDirection: 'asc' | 'desc';
  onNoteSelect: (note: Note) => void;
  onSortOptionChange: (option: SortOption) => void;
  onSortDirectionToggle: () => void;
  onRestoreNote: (noteId: string) => void;
  onEmptyTrash: () => void;
}

const NoteSidebar = ({
  notes,
  trashedNotes,
  selectedNote,
  sortOption,
  sortDirection,
  onNoteSelect,
  onSortOptionChange,
  onSortDirectionToggle,
  onRestoreNote,
  onEmptyTrash
}: NoteSidebarProps) => {
  const getNoteTitle = (note: Note) => {
    if (note.title && note.title.trim() !== '') {
      return note.title;
    }
    return note.description.split(' ').slice(0, 3).join(' ') + '...';
  };

  return (
    <div className="h-full space-y-4 overflow-y-auto p-4">
      <div className="flex justify-between items-center px-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowUpDown className="h-4 w-4" />
              Sort by
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => onSortOptionChange('title')}>
              Title {sortOption === 'title' && '✓'}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSortOptionChange('createdAt')}>
              Created Date {sortOption === 'createdAt' && '✓'}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSortOptionChange('modifiedAt')}>
              Modified Date {sortOption === 'modifiedAt' && '✓'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button
          variant="ghost"
          size="sm"
          onClick={onSortDirectionToggle}
          className="gap-2"
        >
          {sortDirection === 'asc' ? '↑' : '↓'}
        </Button>
      </div>

      {/* Pinned Notes */}
      {notes.filter(note => note.isPinned).length > 0 && (
        <div className="space-y-2">
          <h3 className="font-bold px-2 text-yellow-500 flex items-center gap-2">
            <Pin className="h-4 w-4" />
            Pinned
          </h3>
          {notes
            .filter(note => note.isPinned)
            .map(note => {
              const SmartIcon = note.icon ? getSmartIcon(note.icon) : getSmartIcon(note.title);
              return (
                <div
                  key={note.id}
                  onClick={() => onNoteSelect(note)}
                  className={cn(
                    "flex items-center gap-2 p-2 cursor-pointer hover:bg-accent rounded-md transition-colors",
                    selectedNote?.id === note.id && "bg-accent"
                  )}
                >
                  {SmartIcon && <SmartIcon className="h-4 w-4 shrink-0" />}
                  <span className="truncate max-w-[180px]">
                    {getNoteTitle(note)}
                  </span>
                </div>
              );
            })}
        </div>
      )}

      {/* All Notes */}
      <div className="space-y-2">
        <h3 className="font-bold px-2 text-yellow-500">All Notes</h3>
        {notes
          .filter(note => !note.isPinned)
          .map(note => {
            const SmartIcon = note.icon ? getSmartIcon(note.icon) : getSmartIcon(note.title);
            return (
              <div
                key={note.id}
                onClick={() => onNoteSelect(note)}
                className={cn(
                  "flex items-center gap-2 p-2 cursor-pointer hover:bg-accent rounded-md transition-colors",
                  selectedNote?.id === note.id && "bg-accent"
                )}
              >
                {SmartIcon && <SmartIcon className="h-4 w-4 shrink-0" />}
                <span className="truncate max-w-[180px]">
                  {getNoteTitle(note)}
                </span>
              </div>
            );
          })}
      </div>

      {/* Trashcan */}
      {trashedNotes.length > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between items-center px-2">
            <h3 className="font-bold text-red-500 flex items-center gap-2">
              <Trash className="h-4 w-4" />
              Trashcan
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={onEmptyTrash}
              className="text-red-500 hover:text-red-600"
            >
              Empty
            </Button>
          </div>
          {trashedNotes.map(note => (
            <div
              key={note.id}
              className="flex items-center gap-2 p-2 hover:bg-accent rounded-md"
            >
              <span className="truncate flex-1">{getNoteTitle(note)}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRestoreNote(note.id)}
                className="h-8 w-8 p-0"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NoteSidebar;