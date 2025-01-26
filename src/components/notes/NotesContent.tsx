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
  onImageUpload: (noteId: string, file: File) => Promise<void>;
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
  onEmptyTrash,
  onImageUpload
}: NotesContentProps) => {
  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="min-h-[calc(100vh-16rem)] rounded-lg border"
    >
      <ResizablePanel 
        defaultSize={30}
        minSize={20}
        maxSize={40}
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

      <ResizableHandle className="w-2 bg-border/10 hover:bg-border/20 transition-colors">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <GripHorizontal className="h-4 w-4 text-muted-foreground/40" />
        </div>
      </ResizableHandle>

      <ResizablePanel defaultSize={70} minSize={60} maxSize={80}>
        {selectedNote ? (
          <NoteContent
            note={selectedNote}
            isPinned={selectedNote.isPinned || false}
            onShare={onShare}
            onCopy={onCopy}
            onIconChange={onIconChange}
            onPinToggle={onPinToggle}
            onDelete={onDelete}
            onContentUpdate={onContentUpdate}
            onImageUpload={onImageUpload}
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