import React from 'react';
import { GripHorizontal } from 'lucide-react';
import { Note, SortOption, SortDirection } from './types';
import NoteSidebar from './NoteSidebar';
import NoteContent from './NoteContent';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

interface NotesContentProps {
  notes: Note[];
  trashedNotes: Note[];
  selectedNote: Note | null;
  sidebarWidth: number;
  sortOption: SortOption;
  sortDirection: SortDirection;
  onSidebarWidthChange: (width: number) => void;
  onNoteSelect: (note: Note | null) => void;
  onSortOptionChange: (option: SortOption) => void;
  onSortDirectionChange: (direction: SortDirection) => void;
  onShare: (note: Note) => void;
  onCopy: (note: Note) => void;
  onIconChange: (noteId: string, icon: string) => void;
  onPinToggle: (noteId: string) => void;
  onDelete: (noteId: string) => void;
  onContentUpdate: (noteId: string, content: string) => void;
  onRestoreNote: (noteId: string) => void;
  onEmptyTrash: () => void;
}

const NotesContent = ({
  notes,
  trashedNotes,
  selectedNote,
  sidebarWidth,
  sortOption,
  sortDirection,
  onSidebarWidthChange,
  onNoteSelect,
  onSortOptionChange,
  onSortDirectionChange,
  onShare,
  onCopy,
  onIconChange,
  onPinToggle,
  onDelete,
  onContentUpdate,
  onRestoreNote,
  onEmptyTrash
}: NotesContentProps) => {
  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="min-h-[calc(100vh-16rem)] rounded-lg border relative"
    >
      <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 pointer-events-none flex items-center opacity-50 transition-opacity group-hover:opacity-100">
        <GripHorizontal className="h-4 w-4" />
      </div>
      
      <ResizablePanel 
        defaultSize={sidebarWidth}
        onResize={onSidebarWidthChange}
        className="bg-background"
      >
        <NoteSidebar
          notes={notes}
          trashedNotes={trashedNotes}
          selectedNote={selectedNote}
          sortOption={sortOption}
          sortDirection={sortDirection}
          onNoteSelect={onNoteSelect}
          onSortOptionChange={onSortOptionChange}
          onSortDirectionToggle={() => onSortDirectionChange(sortDirection === 'asc' ? 'desc' : 'asc')}
          onRestoreNote={onRestoreNote}
          onEmptyTrash={onEmptyTrash}
        />
      </ResizablePanel>

      <ResizableHandle />

      <ResizablePanel defaultSize={70}>
        {selectedNote ? (
          <NoteContent
            note={selectedNote}
            isPinned={selectedNote.isPinned}
            onShare={onShare}
            onCopy={onCopy}
            onIconChange={onIconChange}
            onPinToggle={onPinToggle}
            onDelete={onDelete}
            onContentUpdate={onContentUpdate}
          />
        ) : (
          <div className="text-center text-muted-foreground p-4">
            Select a note to view its contents
          </div>
        )}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default NotesContent;