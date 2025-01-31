import React, { useState, useEffect } from 'react';
import { 
  getFirestore, 
  collection, 
  query, 
  where, 
  onSnapshot, 
  Timestamp,
  deleteDoc,
  doc,
  addDoc,
  updateDoc
} from 'firebase/firestore';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Note, SortOption, SortDirection } from './types';
import { extractKeywords } from '@/utils/keywordAnalysis';
import NotesHeader from './NotesHeader';
import NotesContent from './NotesContent';

const NotesContainer = () => {
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
          modifiedAt: doc.data().modifiedAt || doc.data().createdAt
        })) as Note[];
        
        const trashed = notesData.filter(note => note.isDeleted);
        const active = notesData.filter(note => !note.isDeleted);
        
        const sortedNotes = sortNotes(active, sortOption, sortDirection);
        const sortedTrashedNotes = sortNotes(trashed, 'deletedAt', 'desc');

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        sortedTrashedNotes.forEach(note => {
          if (note.deletedAt && note.deletedAt.toDate() < sevenDaysAgo) {
            deleteNotePermanently(note.id);
          }
        });

        setNotes(sortedNotes);
        setTrashedNotes(sortedTrashedNotes);
        setKeywords(extractKeywords(sortedNotes));
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

  const deleteNotePermanently = async (noteId: string) => {
    try {
      await deleteDoc(doc(db, 'notes', noteId));
    } catch (error) {
      console.error('Error deleting note permanently:', error);
    }
  };

  const addNote = async () => {
    if (!user) return;
    
    try {
      const [title, ...descriptionParts] = quickNote.split(',');
      const description = descriptionParts.join(',').trim();
      
      await addDoc(collection(db, 'notes'), {
        title: title.trim(),
        description: description || title.trim(), // If no comma, use entire input as description
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

  const handleKeywordClick = (keyword: string) => {
    setSearchQuery(keyword);
  };

  const handleShare = async (note: Note) => {
    try {
      await navigator.share({
        title: note.title || 'Shared Note',
        text: note.description
      });
      toast({
        title: "Note shared successfully"
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error sharing note",
        description: "Your browser might not support sharing"
      });
    }
  };

  const handleCopy = async (note: Note) => {
    try {
      await navigator.clipboard.writeText(note.description);
      toast({
        title: "Note copied to clipboard"
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error copying note",
        description: "Could not copy to clipboard"
      });
    }
  };

  const updateNoteIcon = async (noteId: string, icon: string) => {
    try {
      const noteRef = doc(db, 'notes', noteId);
      await updateDoc(noteRef, { icon });
      toast({
        title: "Note icon updated"
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error updating note icon"
      });
    }
  };

  const togglePin = async (noteId: string) => {
    try {
      const note = notes.find(n => n.id === noteId);
      if (!note) return;
      
      const noteRef = doc(db, 'notes', noteId);
      await updateDoc(noteRef, { 
        isPinned: !note.isPinned 
      });
      toast({
        title: note.isPinned ? "Note unpinned" : "Note pinned"
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error toggling pin"
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
        title: "Note moved to trash"
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error deleting note"
      });
    }
  };

  const handleNoteContentUpdate = async (noteId: string, content: string) => {
    try {
      const noteRef = doc(db, 'notes', noteId);
      await updateDoc(noteRef, { 
        description: content,
        modifiedAt: Timestamp.now()
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error updating note"
      });
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
        title: "Note restored"
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error restoring note"
      });
    }
  };

  const emptyTrash = async () => {
    try {
      const promises = trashedNotes.map(note => 
        deleteDoc(doc(db, 'notes', note.id))
      );
      await Promise.all(promises);
      toast({
        title: "Trash emptied"
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error emptying trash"
      });
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-4">
      <NotesHeader
        quickNote={quickNote}
        setQuickNote={setQuickNote}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        keywords={keywords}
        onAddNote={addNote}
        onKeywordClick={handleKeywordClick}
      />
      
      <NotesContent
        notes={notes}
        trashedNotes={trashedNotes}
        selectedNote={selectedNote}
        sidebarWidth={sidebarWidth}
        sortOption={sortOption}
        sortDirection={sortDirection}
        onSidebarWidthChange={setSidebarWidth}
        onNoteSelect={setSelectedNote}
        onSortOptionChange={setSortOption}
        onSortDirectionChange={setSortDirection}
        onShare={handleShare}
        onCopy={handleCopy}
        onIconChange={updateNoteIcon}
        onPinToggle={togglePin}
        onDelete={deleteNote}
        onContentUpdate={handleNoteContentUpdate}
        onRestoreNote={restoreNote}
        onEmptyTrash={emptyTrash}
      />
    </div>
  );
};

export default NotesContainer;