import { useState, useEffect } from 'react';
import { getFirestore, collection, addDoc, deleteDoc, doc, updateDoc, onSnapshot, Timestamp } from 'firebase/firestore';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card } from './ui/card';
import { Plus, Pencil, Trash2, Save, X } from 'lucide-react';
import { format } from 'date-fns';

interface Note {
  id: string;
  title: string;
  description: string;
  createdAt: Timestamp;
}

const Notes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const db = getFirestore();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'notes'), (snapshot) => {
      const notesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Note[];
      
      setNotes(notesData.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds));
    });

    return () => unsubscribe();
  }, [db]);

  const addNote = async () => {
    try {
      await addDoc(collection(db, 'notes'), {
        title: newTitle.trim() || 'Untitled',
        description: newDescription.trim(),
        createdAt: Timestamp.now()
      });
      setNewTitle('');
      setNewDescription('');
      setIsAdding(false);
    } catch (error) {
      console.error('Error adding note:', error);
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
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  const deleteNote = async (noteId: string) => {
    try {
      await deleteDoc(doc(db, 'notes', noteId));
    } catch (error) {
      console.error('Error deleting note:', error);
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
        <Card className="p-4 space-y-4">
          <Input
            placeholder="Title (optional)"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <Textarea
            placeholder="Description"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsAdding(false);
                setNewTitle('');
                setNewDescription('');
              }}
            >
              Cancel
            </Button>
            <Button onClick={addNote}>Save Note</Button>
          </div>
        </Card>
      )}

      <div className="space-y-4">
        {notes.map((note) => (
          <Card key={note.id} className="p-4">
            {editingId === note.id ? (
              <div className="space-y-4">
                <Input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
                <Textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                />
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditingId(null);
                      setNewTitle('');
                      setNewDescription('');
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <Button onClick={() => updateNote(note.id)}>
                    <Save className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium">{note.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {format(note.createdAt.toDate(), "dd MMMM yyyy, HH:mm:ss")}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => startEdit(note)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteNote(note.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="mt-2 text-muted-foreground">{note.description}</p>
              </>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Notes;