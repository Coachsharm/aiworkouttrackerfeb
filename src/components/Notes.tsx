import { useState, useEffect } from 'react';
import { getFirestore, collection, addDoc, deleteDoc, doc, updateDoc, onSnapshot, Timestamp } from 'firebase/firestore';
import { Button } from './ui/button';
import { Plus } from 'lucide-react';
import { Note } from './notes/types';
import NoteCard from './notes/NoteCard';
import AddNoteForm from './notes/AddNoteForm';
import EditNoteForm from './notes/EditNoteForm';
import { useToast } from './ui/use-toast';

const Notes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const { toast } = useToast();

  const db = getFirestore();

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'notes'), 
      (snapshot) => {
        const notesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Note[];
        
        const sortedNotes = [...notesData].sort((a, b) => 
          b.createdAt.seconds - a.createdAt.seconds
        );
        
        setNotes(sortedNotes);
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
  }, [db, toast]);

  const addNote = async () => {
    try {
      await addDoc(collection(db, 'notes'), {
        title: newTitle.trim() || '',  // Changed from 'Untitled' to empty string
        description: newDescription.trim(),
        createdAt: Timestamp.now()
      });
      setNewTitle('');
      setNewDescription('');
      setIsAdding(false);
      toast({
        title: "Note added successfully",
        description: "Your note has been saved."
      });
    } catch (error) {
      console.error('Error adding note:', error);
      toast({
        variant: "destructive",
        title: "Error saving note",
        description: "Please make sure you're logged in and try again."
      });
    }
  };

  const updateNote = async (noteId: string) => {
    try {
      const noteRef = doc(db, 'notes', noteId);
      await updateDoc(noteRef, {
        title: newTitle.trim() || 'Untitled',
        description: newDescription.trim()
      });
      setEditingId(null);
      toast({
        title: "Note updated successfully",
        description: "Your changes have been saved."
      });
    } catch (error) {
      console.error('Error updating note:', error);
      toast({
        variant: "destructive",
        title: "Error updating note",
        description: "Please make sure you're logged in and try again."
      });
    }
  };

  const deleteNote = async (noteId: string) => {
    try {
      await deleteDoc(doc(db, 'notes', noteId));
      toast({
        title: "Note deleted successfully",
        description: "The note has been removed."
      });
    } catch (error) {
      console.error('Error deleting note:', error);
      toast({
        variant: "destructive",
        title: "Error deleting note",
        description: "Please make sure you're logged in and try again."
      });
    }
  };

  const startEdit = (note: Note) => {
    setEditingId(note.id);
    setNewTitle(note.title);
    setNewDescription(note.description);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Quick Notes</h2>
        <Button
          onClick={() => setIsAdding(true)}
          className="gap-2"
          variant="outline"
        >
          <Plus className="h-4 w-4" />
          Add Note
        </Button>
      </div>

      {isAdding && (
        <AddNoteForm
          title={newTitle}
          description={newDescription}
          onTitleChange={setNewTitle}
          onDescriptionChange={setNewDescription}
          onSave={addNote}
          onCancel={() => {
            setIsAdding(false);
            setNewTitle('');
            setNewDescription('');
          }}
        />
      )}

      <div className="space-y-4">
        {notes.map((note) => (
          <div key={note.id}>
            {editingId === note.id ? (
              <EditNoteForm
                title={newTitle}
                description={newDescription}
                onTitleChange={setNewTitle}
                onDescriptionChange={setNewDescription}
                onSave={() => updateNote(note.id)}
                onCancel={() => {
                  setEditingId(null);
                  setNewTitle('');
                  setNewDescription('');
                }}
              />
            ) : (
              <NoteCard
                note={note}
                onEdit={startEdit}
                onDelete={deleteNote}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notes;