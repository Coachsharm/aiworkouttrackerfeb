import { useState, useEffect, useCallback } from 'react';
import { getFirestore, collection, addDoc, deleteDoc, doc, updateDoc, onSnapshot, Timestamp, query, where } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Button } from './ui/button';
import { Plus, Search, X, Share2, Copy, Pin, Trash2, Upload } from 'lucide-react';
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
import { ResizeHandle } from './notes/ResizeHandle';
import { SortControls } from './notes/SortControls';
import { IconSelector } from './notes/IconSelector';
import {
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

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
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const saved = localStorage.getItem('sidebarWidth');
    return saved ? parseInt(saved) : 30; // Default to 30% if not saved
  });

  const [sortField, setSortField] = useState<'title' | 'createdAt' | 'modifiedAt'>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [storageUsed, setStorageUsed] = useState(0);
  const storage = getStorage();

  useEffect(() => {
    localStorage.setItem('sidebarWidth', sidebarWidth.toString());
  }, [sidebarWidth]);

  useEffect(() => {
    if (!user) return;

    const notesQuery = query(
      collection(db, 'notes'),
      where('userId', '==', user.uid),
      where('isDeleted', '==', false)
    );

    const unsubscribe = onSnapshot(
      notesQuery,
      (snapshot) => {
        const notesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Note[];
        
        const sortedNotes = [...notesData].sort((a, b) => {
          if (sortField === 'title') {
            return sortDirection === 'asc' 
              ? (a.title || '').localeCompare(b.title || '')
              : (b.title || '').localeCompare(a.title || '');
          }
          return sortDirection === 'asc'
            ? a[sortField].seconds - b[sortField].seconds
            : b[sortField].seconds - a[sortField].seconds;
        });

        const extractedKeywords = extractKeywords(sortedNotes);
        setKeywords(extractedKeywords);

        const filteredNotes = searchQuery
          ? sortedNotes.filter(note => 
              note.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
              note.description.toLowerCase().includes(searchQuery.toLowerCase())
            )
          : sortedNotes;
        
        setNotes(filteredNotes);

        const totalSize = notesData.reduce((acc, note) => {
          return acc + (note.imageUrl ? 0.5 : 0); // 0.5MB per image
        }, 0);
        setStorageUsed(totalSize);
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

    const deletedNotesQuery = query(
      collection(db, 'notes'),
      where('userId', '==', user.uid),
      where('isDeleted', '==', true)
    );

    const deletedUnsubscribe = onSnapshot(deletedNotesQuery, (snapshot) => {
      const deletedNotesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Note[];

      deletedNotesData.forEach(note => {
        if (note.deletedAt && 
            (Date.now() - note.deletedAt.toDate().getTime()) > 7 * 24 * 60 * 60 * 1000) {
          deleteNote(note.id, true);
        }
      });
    });

    return () => {
      unsubscribe();
      deletedUnsubscribe();
    };
  }, [db, toast, user, searchQuery, sortField, sortDirection]);

  const handleQuickNoteAdd = async () => {
    if (!user || !quickNote.trim()) return;

    try {
      const titles = quickNote.split(',').map(title => title.trim());
      
      for (const title of titles) {
        await addDoc(collection(db, 'notes'), {
          title,
          description: '',
          createdAt: Timestamp.now(),
          modifiedAt: Timestamp.now(),
          userId: user.uid,
          isDeleted: false
        });
      }
      
      setQuickNote('');
      toast({
        title: "Notes added",
        description: "Your notes have been created successfully."
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error adding notes",
        description: "Please try again."
      });
    }
  };

  const handleKeywordClick = (keyword: string) => {
    setSearchQuery(keyword);
  };

  const getNoteTitle = (note: Note) => {
    if (note.title && note.title.trim() !== '') {
      return note.title;
    }
    const firstLine = note.description.split('\n')[0];
    return firstLine.length > 30 ? firstLine.substring(0, 30) + '...' : firstLine;
  };

  const handleDragOver = useCallback((event: React.DragEvent<Element>) => {
    event.preventDefault();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent<Element>) => {
    event.preventDefault();
    setDragActive(false);
  }, []);

  const handleDrop = useCallback(async (event: React.DragEvent<Element>) => {
    event.preventDefault();
    setDragActive(false);

    if (!user) return;

    const file = event.dataTransfer.files[0];
    if (!file || !file.type.startsWith('image/')) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload an image file."
      });
      return;
    }

    if (file.size > 0.5 * 1024 * 1024) { // 0.5MB
      toast({
        variant: "destructive",
        title: "File too large",
        description: "Image size must be less than 0.5MB."
      });
      return;
    }

    if (storageUsed + 0.5 > 500) { // 500MB limit
      toast({
        variant: "destructive",
        title: "Storage limit reached",
        description: "You have reached the 500MB storage limit."
      });
      return;
    }

    try {
      const storageRef = ref(storage, `notes/${user.uid}/${file.name}`);
      await uploadBytes(storageRef, file);
      const imageUrl = await getDownloadURL(storageRef);

      if (selectedNote) {
        const noteRef = doc(db, 'notes', selectedNote.id);
        await updateDoc(noteRef, {
          imageUrl,
          modifiedAt: Timestamp.now()
        });
        toast({
          title: "Image uploaded",
          description: "The image has been added to your note."
        });
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        variant: "destructive",
        title: "Error uploading image",
        description: "Please try again."
      });
    }
  }, [user, selectedNote, storage, storageUsed]);

  const handleShare = async (note: Note) => {
    const noteText = `${note.title}\n${format(note.createdAt.toDate(), "dd MMMM yyyy, HH:mm:ss")}\n\n${note.description}`;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: note.title || 'Shared Note',
          text: noteText,
        });
        toast({
          title: "Shared successfully",
          description: "The note has been shared."
        });
      } else {
        await navigator.clipboard.writeText(noteText);
        toast({
          title: "Copied to clipboard",
          description: "The note has been copied to your clipboard."
        });
      }
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        toast({
          variant: "destructive",
          title: "Error sharing note",
          description: "Please try again."
        });
      }
    }
  };

  const handleIconSelect = async (noteId: string, icon: string) => {
    try {
      const noteRef = doc(db, 'notes', noteId);
      await updateDoc(noteRef, {
        selectedIcon: icon,
        modifiedAt: Timestamp.now()
      });
      toast({
        title: "Icon updated",
        description: "The note icon has been updated."
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error updating icon",
        description: "Please try again."
      });
    }
  };

  const deleteNote = async (noteId: string, permanent: boolean = false) => {
    try {
      if (permanent) {
        await deleteDoc(doc(db, 'notes', noteId));
        toast({
          title: "Note permanently deleted",
          description: "The note has been permanently removed."
        });
      } else {
        const noteRef = doc(db, 'notes', noteId);
        await updateDoc(noteRef, {
          isDeleted: true,
          deletedAt: Timestamp.now()
        });
        toast({
          title: "Note moved to trash",
          description: "The note will be permanently deleted in 7 days."
        });
      }
    } catch (error) {
      console.error('Error deleting note:', error);
      toast({
        variant: "destructive",
        title: "Error deleting note",
        description: "Please try again."
      });
    }
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
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              window.open(href, '_blank');
            }}
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  const handleCopy = async (note: Note) => {
    try {
      const noteText = `${note.title}\n${format(note.createdAt.toDate(), "dd MMMM yyyy, HH:mm:ss")}\n\n${note.description}`;
      await navigator.clipboard.writeText(noteText);
      toast({
        title: "Copied to clipboard",
        description: "The note has been copied to your clipboard."
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error copying note",
        description: "Please try again."
      });
    }
  };

  const togglePin = async (noteId: string) => {
    try {
      if (pinnedNotes.includes(noteId)) {
        setPinnedNotes(prev => prev.filter(id => id !== noteId));
      } else {
        setPinnedNotes(prev => [...prev, noteId]);
      }
      toast({
        title: pinnedNotes.includes(noteId) ? "Note unpinned" : "Note pinned",
        description: pinnedNotes.includes(noteId) 
          ? "The note has been unpinned." 
          : "The note has been pinned to the top."
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error updating pin status",
        description: "Please try again."
      });
    }
  };

  const handleNoteContentUpdate = async (noteId: string, newContent: string) => {
    try {
      const noteRef = doc(db, 'notes', noteId);
      await updateDoc(noteRef, {
        description: newContent,
        modifiedAt: Timestamp.now()
      });
      toast({
        title: "Note updated",
        description: "Your changes have been saved."
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error updating note",
        description: "Please try again."
      });
    }
  };

  const addNote = async () => {
    if (!user) return;

    try {
      await addDoc(collection(db, 'notes'), {
        title: newTitle,
        description: newDescription,
        createdAt: Timestamp.now(),
        modifiedAt: Timestamp.now(),
        userId: user.uid,
        isDeleted: false
      });

      setNewTitle('');
      setNewDescription('');
      setIsAdding(false);
      toast({
        title: "Note added",
        description: "Your note has been created successfully."
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error adding note",
        description: "Please try again."
      });
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-4">
      <div className="space-y-4">
        <div className="flex flex-col gap-4">
          {/* Quick Note Input */}
          <div className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="Title (use comma to separate)"
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

          {/* Keywords */}
          <KeywordTags keywords={keywords} onKeywordClick={handleKeywordClick} />
        </div>
      </div>

      <Separator className="my-4" />

      <ResizablePanelGroup
        direction="horizontal"
        className={cn(
          "min-h-[calc(100vh-16rem)] rounded-lg border",
          dragActive && "border-primary border-2"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <ResizablePanel 
          defaultSize={sidebarWidth}
          onResize={(size) => setSidebarWidth(size)}
          className="bg-background"
        >
          <div className="h-full space-y-4 overflow-y-auto p-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold px-2 text-yellow-500">Notes</h3>
              <SortControls onSort={(field) => {
                if (field === sortField) {
                  setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
                } else {
                  setSortField(field);
                  setSortDirection('desc');
                }
              }} />
            </div>

            {/* Pinned Notes */}
            {pinnedNotes.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-bold px-2 text-yellow-500 flex items-center gap-2">
                  <Pin className="h-4 w-4" />
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
              <h3 className="font-bold px-2 text-yellow-500">
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
                      <span className="truncate max-w-[180px]">
                        {getNoteTitle(note)}
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>
        </ResizablePanel>

        <ResizeHandle />

        <ResizablePanel defaultSize={100 - sidebarWidth}>
          <div className="p-4">
            {selectedNote ? (
              <div className="animate-fade-in space-y-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-semibold text-yellow-500">
                      {selectedNote.title}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Created: {format(selectedNote.createdAt.toDate(), "dd MMMM yyyy, HH:mm:ss")}
                    </p>
                    {selectedNote.modifiedAt && (
                      <p className="text-sm text-muted-foreground">
                        Modified: {format(selectedNote.modifiedAt.toDate(), "dd MMMM yyyy, HH:mm:ss")}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = 'image/*';
                        input.onchange = async (e) => {
                          const file = (e.target as HTMLInputElement).files?.[0];
                          if (file) {
                            const event = new DragEvent('drop', { dataTransfer: new DataTransfer() });
                            event.dataTransfer?.items.add(file);
                            await handleDrop(event);
                          }
                        };
                        input.click();
                      }}
                      title="Upload image"
                    >
                      <Upload className="h-4 w-4" />
                    </Button>
                    <IconSelector
                      selectedIcon={selectedNote.selectedIcon || ''}
                      onSelectIcon={(icon) => handleIconSelect(selectedNote.id, icon)}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleShare(selectedNote)}
                      title="Share note"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleCopy(selectedNote)}
                      title="Copy note"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => togglePin(selectedNote.id)}
                      title={pinnedNotes.includes(selectedNote.id) ? "Unpin" : "Pin"}
                    >
                      <Pin className={cn(
                        "h-4 w-4",
                        pinnedNotes.includes(selectedNote.id) && "text-yellow-500"
                      )} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteNote(selectedNote.id)}
                      title="Move to trash"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {selectedNote.imageUrl && (
                  <div className="relative w-full max-w-md mx-auto">
                    <img
                      src={selectedNote.imageUrl}
                      alt="Note attachment"
                      className="w-full h-auto rounded-lg shadow-md"
                    />
                  </div>
                )}

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
        </ResizablePanel>
      </ResizablePanelGroup>

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
