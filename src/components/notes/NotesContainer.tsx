import { useEffect, useState } from 'react';
import { db, storage } from '@/lib/firebase';
import { 
  collection, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp, 
  updateDoc, 
  doc, 
  Timestamp 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth } from '@/lib/firebase';
import NotesContent from './NotesContent';
import { Note, SortOption, SortDirection } from './types';

const NotesContainer = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [trashedNotes, setTrashedNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [sidebarWidth, setSidebarWidth] = useState(250);
  const [sortOption, setSortOption] = useState<SortOption>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  useEffect(() => {
    if (!auth.currentUser) return;

    const notesRef = collection(db, 'notes');
    const q = query(
      notesRef,
      orderBy(sortOption, sortDirection)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notesData = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() })) as Note[];
      
      setNotes(notesData.filter(note => !note.isDeleted));
      setTrashedNotes(notesData.filter(note => note.isDeleted));
    });

    return () => unsubscribe();
  }, [sortOption, sortDirection]);

  const handleImageUpload = async (noteId: string, file: File) => {
    if (!auth.currentUser) return;

    try {
      const storageRef = ref(storage, `notes/${auth.currentUser.uid}/${noteId}/${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      
      const noteRef = doc(db, 'notes', noteId);
      await updateDoc(noteRef, {
        image: {
          url,
          name: file.name,
          size: file.size
        },
        modifiedAt: serverTimestamp()
      });
      
      setNotes(notes.map(note => 
        note.id === noteId 
          ? { 
              ...note, 
              image: { url, name: file.name, size: file.size },
              modifiedAt: Timestamp.now()
            }
          : note
      ));
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const handleNoteSelect = (note: Note) => {
    setSelectedNote(note);
  };

  const handleSortOptionChange = (option: SortOption) => {
    setSortOption(option);
  };

  const handleSortDirectionChange = (direction: SortDirection) => {
    setSortDirection(direction);
  };

  const handleShare = (note: Note) => {
    // Share functionality
  };

  const handleCopy = (note: Note) => {
    // Copy functionality
  };

  const handleIconChange = (noteId: string, icon: string) => {
    // Icon change functionality
  };

  const handlePinToggle = (noteId: string) => {
    // Pin toggle functionality
  };

  const handleDelete = (noteId: string) => {
    // Delete functionality
  };

  const handleContentUpdate = (noteId: string, content: string) => {
    // Content update functionality
  };

  const handleRestoreNote = (noteId: string) => {
    // Restore functionality
  };

  const handleEmptyTrash = () => {
    // Empty trash functionality
  };

  return (
    <NotesContent
      notes={notes}
      trashedNotes={trashedNotes}
      selectedNote={selectedNote}
      sidebarWidth={sidebarWidth}
      sortOption={sortOption}
      sortDirection={sortDirection}
      onSidebarWidthChange={setSidebarWidth}
      onNoteSelect={handleNoteSelect}
      onSortOptionChange={handleSortOptionChange}
      onSortDirectionChange={handleSortDirectionChange}
      onShare={handleShare}
      onCopy={handleCopy}
      onIconChange={handleIconChange}
      onPinToggle={handlePinToggle}
      onDelete={handleDelete}
      onContentUpdate={handleContentUpdate}
      onRestoreNote={handleRestoreNote}
      onEmptyTrash={handleEmptyTrash}
      onImageUpload={handleImageUpload}
    />
  );
};

export default NotesContainer;
