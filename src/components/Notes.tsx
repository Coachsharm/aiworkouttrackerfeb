import { useState, useEffect } from 'react';
import { getFirestore, collection, addDoc, deleteDoc, doc, updateDoc, onSnapshot, Timestamp, query, where } from 'firebase/firestore';
import { Button } from './ui/button';
import { Plus, Search, X, ChevronRight, ChevronLeft } from 'lucide-react';
import { Note } from './notes/types';
import AddNoteForm from './notes/AddNoteForm';
import { useToast } from './ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from './ui/input';
import { extractKeywords } from '@/utils/keywordAnalysis';
import { cn } from '@/lib/utils';
import { getSmartIcon } from '@/utils/iconSelector';
import { format } from 'date-fns';
import { Separator } from './ui/separator';
import KeywordTags from './notes/KeywordTags';

const Notes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [quickNote, setQuickNote] = useState('');
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [pinnedNotes, setPinnedNotes] = useState<string[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();
  const db = getFirestore();

  const [keywords, setKeywords] = useState([]);

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
          ...doc.data()
        })) as Note[];
        
        const sortedNotes = [...notesData].sort((a, b) => 
          b.createdAt.seconds - a.createdAt.seconds
        );

        // Extract keywords from all notes
        const extractedKeywords = extractKeywords(sortedNotes);
        setKeywords(extractedKeywords);

        // Filter notes based on search query
        const filteredNotes = searchQuery
          ? sortedNotes.filter(note => 
              note.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
              note.description.toLowerCase().includes(searchQuery.toLowerCase())
            )
          : sortedNotes;
        
        setNotes(filteredNotes);
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
  }, [db, toast, user, searchQuery]);

  const addNote = async () => {
    if (!user) return;
    try {
      await addDoc(collection(db, 'notes'), {
        title: newTitle.trim() || '',
        description: newDescription.trim(),
        createdAt: Timestamp.now(),
        userId: user.uid
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

  const handleQuickNoteAdd = async () => {
    if (!user || !quickNote.trim()) return;
    
    let title = '';
    let description = quickNote.trim();
    
    // Check if there's a comma in the input
    const commaIndex = quickNote.indexOf(',');
    if (commaIndex !== -1) {
      title = quickNote.substring(0, commaIndex).trim();
      description = quickNote.substring(commaIndex + 1).trim();
    }

    try {
      await addDoc(collection(db, 'notes'), {
        title,
        description,
        createdAt: Timestamp.now(),
        userId: user.uid
      });
      setQuickNote('');
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

  const handleKeywordClick = (keyword: string) => {
    setSearchQuery(keyword);
  };

  const togglePin = (noteId: string) => {
    setPinnedNotes(prev => 
      prev.includes(noteId) 
        ? prev.filter(id => id !== noteId)
        : [...prev, noteId]
    );
  };

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
            className="text-primary hover:text-primary/80 underline break-all"
            onClick={(e) => e.stopPropagation()}
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  const handleNoteContentUpdate = async (noteId: string, newContent: string) => {
    try {
      const noteRef = doc(db, 'notes', noteId);
      await updateDoc(noteRef, {
        description: newContent
      });
      toast({
        title: "Note updated",
        description: "Your changes have been saved."
      });
    } catch (error) {
      console.error('Error updating note:', error);
      toast({
        variant: "destructive",
        title: "Error updating note",
        description: "Please try again."
      });
    }
  };

  const getNoteTitle = (note: Note) => {
    if (note.title && note.title.trim() !== '') {
      return note.title;
    }
    return note.description.split(' ').slice(0, 3).join(' ') + '...';
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-4">
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Quick Notes</h2>
        
        <div className="flex flex-col gap-4">
          {/* Quick Note Input */}
          <div className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="Title, Description (use comma to separate, or just type description)"
              value={quickNote}
              onChange={(e) => setQuickNote(e.target.value)}
              className="flex-1"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleQuickNoteAdd();
                }
              }}
            />
            <Button
              onClick={handleQuickNoteAdd}
              className="gap-2 whitespace-nowrap"
              variant="outline"
            >
              <Plus className="h-4 w-4" />
              Add Note
            </Button>
          </div>

          {/* Search Input */}
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

          {/* Keywords and Search Results */}
          <div className="space-y-2">
            <KeywordTags keywords={keywords} onKeywordClick={handleKeywordClick} />
            {searchQuery && (
              <p className="text-sm text-muted-foreground">
                Results for "{searchQuery}"
              </p>
            )}
          </div>
        </div>
      </div>

      <Separator className="my-6" />

      <div className="flex gap-4">
        {/* Sidebar */}
        <div 
          className={cn(
            "relative transition-all duration-300 ease-in-out border-r",
            isSidebarCollapsed ? "w-12" : "w-64"
          )}
        >
          {/* Collapse Toggle */}
          <button
            onClick={() => setIsSidebarCollapsed(prev => !prev)}
            className="absolute -right-3 top-2 z-10 p-1 bg-background border rounded-full"
          >
            {isSidebarCollapsed ? 
              <ChevronRight className="h-4 w-4" /> : 
              <ChevronLeft className="h-4 w-4" />
            }
          </button>

          <div className="space-y-4">
            {/* Pinned Notes */}
            {pinnedNotes.length > 0 && (
              <div className="space-y-2">
                <h3 className={cn(
                  "font-medium px-2",
                  isSidebarCollapsed && "hidden"
                )}>
                  Pinned
                </h3>
                {notes
                  .filter(note => pinnedNotes.includes(note.id))
                  .map(note => {
                    const SmartIcon = getSmartIcon(note.title);
                    return (
                      <div
                        key={note.id}
                        onClick={() => setSelectedNote(note)}
                        className={cn(
                          "flex items-center gap-2 p-2 cursor-pointer hover:bg-accent rounded-md transition-colors",
                          selectedNote?.id === note.id && "bg-accent",
                          "animate-fade-in"
                        )}
                      >
                        {SmartIcon && <SmartIcon className="h-4 w-4 shrink-0" />}
                        <span className={cn(
                          "truncate",
                          isSidebarCollapsed && "hidden"
                        )}>
                          {getNoteTitle(note)}
                        </span>
                      </div>
                    );
                  })}
              </div>
            )}

            {/* All Notes */}
            <div className="space-y-2">
              <h3 className={cn(
                "font-medium px-2",
                isSidebarCollapsed && "hidden"
              )}>
                All Notes
              </h3>
              {notes
                .filter(note => !pinnedNotes.includes(note.id))
                .map(note => {
                  const SmartIcon = getSmartIcon(note.title);
                  return (
                    <div
                      key={note.id}
                      onClick={() => setSelectedNote(note)}
                      className={cn(
                        "flex items-center gap-2 p-2 cursor-pointer hover:bg-accent rounded-md transition-colors",
                        selectedNote?.id === note.id && "bg-accent",
                        "animate-fade-in"
                      )}
                    >
                      {SmartIcon && <SmartIcon className="h-4 w-4 shrink-0" />}
                      <span className={cn(
                        "truncate",
                        isSidebarCollapsed && "hidden"
                      )}>
                        {getNoteTitle(note)}
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {selectedNote ? (
            <div className="animate-fade-in space-y-4">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h2 className="text-2xl font-semibold">{selectedNote.title}</h2>
                  <p className="text-sm text-muted-foreground">
                    {format(selectedNote.createdAt.toDate(), "dd MMMM yyyy, HH:mm:ss")}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => togglePin(selectedNote.id)}
                  >
                    {pinnedNotes.includes(selectedNote.id) ? 'Unpin' : 'Pin'}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteNote(selectedNote.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
              <div
                contentEditable
                suppressContentEditableWarning
                className="prose prose-sm max-w-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md p-2"
                onBlur={(e) => handleNoteContentUpdate(selectedNote.id, e.currentTarget.textContent || '')}
                dangerouslySetInnerHTML={{
                  __html: formatTextWithLinks(selectedNote.description).map(part => 
                    typeof part === 'string' ? part : part?.props?.href ? 
                      `<a href="${part.props.href}" target="_blank" rel="noopener noreferrer" class="text-primary hover:text-primary/80 underline break-all">${part.props.children}</a>` : 
                      ''
                  ).join('')
                }}
              />
            </div>
          ) : (
            <div className="text-center text-muted-foreground">
              Select a note to view its contents
            </div>
          )}
        </div>
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
    </div>
  );
};

export default Notes;
