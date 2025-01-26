import React, { useState, useEffect } from 'react';
import { getFirestore, collection, addDoc, deleteDoc, doc, updateDoc, onSnapshot, Timestamp, query, where } from 'firebase/firestore';
import { Search, X } from 'lucide-react';
import { Note, SortOption, SortDirection } from './notes/types';
import { Input } from './ui/input';
import { extractKeywords } from '@/utils/keywordAnalysis';
import { useToast } from './ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Separator } from './ui/separator';
import KeywordTags from './notes/KeywordTags';
import NoteSidebar from './notes/NoteSidebar';
import NoteContent from './notes/NoteContent';
import QuickNoteInput from './notes/QuickNoteInput';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

const Notes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [quickNote, setQuickNote] = useState('');
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const saved = localStorage.getItem('sidebarWidth');
    return saved ? parseInt(saved) : 30;
  });
  const [sortOption, setSortOption] = useState<SortOption>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [trashedNotes, setTrashedNotes] = useState<Note[]>([]);
  const [keywords, setKeywords] = useState([]);
  const { toast } = useToast();
  const { user } = useAuth();
  const db = getFirestore();

  useEffect(() => {
    localStorage.setItem('sidebarWidth', sidebarWidth.toString());
  }, [sidebarWidth]);

  useEffect(() => {
    if (!user) return;

    const notesQuery = query(
      collection(db, 'notes'),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(
      notesQuery,
      (snapshot) => {
        const notesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          modifiedAt: doc.data().modifiedAt || doc.data().createdAt // Fallback for older notes
        })) as Note[];
        
        // Separate trashed and active notes
        const trashed = notesData.filter(note => note.isDeleted);
        const active = notesData.filter(note => !note.isDeleted);
        
        // Sort notes based on current sort option and direction
        const sortedNotes = sortNotes(active, sortOption, sortDirection);
        const sortedTrashedNotes = sortNotes(trashed, 'deletedAt', 'desc');

        // Clean up notes older than 7 days in trash
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        sortedTrashedNotes.forEach(note => {
          if (note.deletedAt && note.deletedAt.toDate() < sevenDaysAgo) {
            deleteNotePermanently(note.id);
          }
        });

        setNotes(sortedNotes);
        setTrashedNotes(sortedTrashedNotes);

        // Extract keywords from active notes only
        const extractedKeywords = extractKeywords(sortedNotes);
        setKeywords(extractedKeywords);
      },
      (error) => {
        console.error('Error fetching notes:', error);
        toast({
          variant: "destructive",
          title: "Error fetching notes",
          description: "Please make sure you're logged in and try again."
        });
      }
    );

    return () => unsubscribe();
  }, [db, toast, user, sortOption, sortDirection]);

  const sortNotes = (notesToSort: Note[], option: SortOption | 'deletedAt', direction: SortDirection) => {
    return [...notesToSort].sort((a, b) => {
      let comparison = 0;
      
      switch (option) {
        case 'title':
          const aTitle = a.title || a.description.split(' ')[0];
          const bTitle = b.title || b.description.split(' ')[0];
          comparison = aTitle.localeCompare(bTitle);
          break;
        case 'createdAt':
          comparison = a.createdAt.seconds - b.createdAt.seconds;
          break;
        case 'modifiedAt':
          comparison = a.modifiedAt.seconds - b.modifiedAt.seconds;
          break;
        case 'deletedAt':
          comparison = (a.deletedAt?.seconds || 0) - (b.deletedAt?.seconds || 0);
          break;
      }
      
      return direction === 'asc' ? comparison : -comparison;
    });
  };

  const toggleSortDirection = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const addNote = async () => {
    if (!user) return;
    try {
      await addDoc(collection(db, 'notes'), {
        title: '',
        description: quickNote.trim(),
        createdAt: Timestamp.now(),
        modifiedAt: Timestamp.now(),
        userId: user.uid
      });
      setQuickNote('');
      toast({
        title: "Quick note added",
        description: "Your note has been saved."
      });
    } catch (error) {
      console.error('Error adding quick note:', error);
      toast({
        variant: "destructive",
        title: "Error saving note",
        description: "Please make sure you're logged in and try again."
      });
    }
  };

  const togglePin = async (noteId: string) => {
    try {
      const noteRef = doc(db, 'notes', noteId);
      const note = notes.find(n => n.id === noteId);
      if (note) {
        await updateDoc(noteRef, {
          isPinned: !note.isPinned,
          modifiedAt: Timestamp.now()
        });
        toast({
          title: note.isPinned ? "Note unpinned" : "Note pinned",
          description: note.isPinned ? "The note has been unpinned." : "The note has been pinned."
        });
      }
    } catch (error) {
      console.error('Error toggling pin:', error);
      toast({
        variant: "destructive",
        title: "Error updating note",
        description: "Please try again."
      });
    }
  };

  const updateNoteIcon = async (noteId: string, iconKey: string) => {
    try {
      const noteRef = doc(db, 'notes', noteId);
      await updateDoc(noteRef, {
        icon: iconKey,
        modifiedAt: Timestamp.now()
      });
      toast({
        title: "Icon updated",
        description: "The note's icon has been updated."
      });
    } catch (error) {
      console.error('Error updating note icon:', error);
      toast({
        variant: "destructive",
        title: "Error updating icon",
        description: "Please try again."
      });
    }
  };

  const deleteNote = async (noteId: string) => {
    try {
      const noteRef = doc(db, 'notes', noteId);
      await updateDoc(noteRef, {
        isDeleted: true,
        deletedAt: Timestamp.now()
      });
      toast({
        title: "Note moved to Trashcan",
        description: "The note has been moved to the Trashcan and will be automatically deleted after 7 days."
      });
    } catch (error) {
      console.error('Error moving note to trash:', error);
      toast({
        variant: "destructive",
        title: "Error moving note to trash",
        description: "Please try again."
      });
    }
  };

  const deleteNotePermanently = async (noteId: string) => {
    try {
      await deleteDoc(doc(db, 'notes', noteId));
    } catch (error) {
      console.error('Error deleting note permanently:', error);
    }
  };

  const restoreNote = async (noteId: string) => {
    try {
      const noteRef = doc(db, 'notes', noteId);
      await updateDoc(noteRef, {
        isDeleted: false,
        deletedAt: null
      });
      toast({
        title: "Note restored",
        description: "The note has been restored from the Trashcan."
      });
    } catch (error) {
      console.error('Error restoring note:', error);
      toast({
        variant: "destructive",
        title: "Error restoring note",
        description: "Please try again."
      });
    }
  };

  const emptyTrash = async () => {
    try {
      const deletePromises = trashedNotes.map(note => deleteNotePermanently(note.id));
      await Promise.all(deletePromises);
      toast({
        title: "Trashcan emptied",
        description: "All notes in the Trashcan have been permanently deleted."
      });
    } catch (error) {
      console.error('Error emptying trash:', error);
      toast({
        variant: "destructive",
        title: "Error emptying Trashcan",
        description: "Please try again."
      });
    }
  };

  const handleKeywordClick = (keyword: string) => {
    setSearchQuery(keyword);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-4">
      <div className="space-y-4">
        <div className="flex flex-col gap-4">
          <QuickNoteInput
            value={quickNote}
            onChange={setQuickNote}
            onAdd={addNote}
          />

          <div className="relative">
            <Input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500 hover:text-red-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <KeywordTags keywords={keywords} onKeywordClick={handleKeywordClick} />
        </div>
      </div>

      <Separator className="my-4" />

      <ResizablePanelGroup
        direction="horizontal"
        className="min-h-[calc(100vh-16rem)] rounded-lg border"
      >
        <ResizablePanel 
          defaultSize={sidebarWidth}
          onResize={(size) => setSidebarWidth(size)}
          className="bg-background"
        >
          <NoteSidebar
            notes={notes}
            trashedNotes={trashedNotes}
            selectedNote={selectedNote}
            sortOption={sortOption}
            sortDirection={sortDirection}
            onNoteSelect={setSelectedNote}
            onSortOptionChange={setSortOption}
            onSortDirectionToggle={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
            onRestoreNote={restoreNote}
            onEmptyTrash={emptyTrash}
          />
        </ResizablePanel>

        <ResizableHandle />

        <ResizablePanel defaultSize={70}>
          {selectedNote ? (
            <NoteContent
              note={selectedNote}
              isPinned={selectedNote.isPinned}
              onShare={handleShare}
              onCopy={handleCopy}
              onIconChange={updateNoteIcon}
              onPinToggle={togglePin}
              onDelete={deleteNote}
              onContentUpdate={handleNoteContentUpdate}
            />
          ) : (
            <div className="text-center text-muted-foreground p-4">
              Select a note to view its contents
            </div>
          )}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default Notes;
