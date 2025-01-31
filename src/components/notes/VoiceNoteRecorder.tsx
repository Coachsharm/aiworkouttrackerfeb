import React, { useState, useEffect } from 'react';
import { useReactMediaRecorder } from 'react-media-recorder';
import { Button } from '../ui/button';
import { Mic, Square, Save } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from '../ui/input';
import { useToast } from '@/hooks/use-toast';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuth } from '@/contexts/AuthContext';

interface VoiceNoteRecorderProps {
  onSave: (title: string, audioUrl: string) => void;
}

const VoiceNoteRecorder = ({ onSave }: VoiceNoteRecorderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [timeLeft, setTimeLeft] = useState(15);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const {
    status,
    startRecording,
    stopRecording,
    mediaBlobUrl
  } = useReactMediaRecorder({
    audio: true,
    onStop: async (blobUrl, blob) => {
      setIsOpen(true);
      if (blob) {
        try {
          const storage = getStorage();
          const fileName = `voice-notes/${user?.uid}/${Date.now()}.wav`;
          const storageRef = ref(storage, fileName);
          await uploadBytes(storageRef, blob);
          const downloadUrl = await getDownloadURL(storageRef);
          setMediaUrl(downloadUrl);
        } catch (error) {
          console.error('Error uploading voice note:', error);
          toast({
            variant: "destructive",
            title: "Error saving voice note",
            description: "Please try again."
          });
        }
      }
    }
  });

  const [mediaUrl, setMediaUrl] = useState<string | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (status === 'recording') {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            stopRecording();
            return 15;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [status, stopRecording]);

  const handleSave = () => {
    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for your voice note",
        variant: "destructive",
      });
      return;
    }
    if (mediaUrl) {
      onSave(title, mediaUrl);
      setTitle('');
      setIsOpen(false);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className={`voice-recorder-trigger ${status === 'recording' ? 'bg-red-500 hover:bg-red-600' : ''}`}
        onClick={() => {
          if (status === 'recording') {
            stopRecording();
          } else {
            startRecording();
            setTimeLeft(15);
          }
        }}
      >
        {status === 'recording' ? (
          <Square className="h-4 w-4" />
        ) : (
          <Mic className="h-4 w-4" />
        )}
      </Button>

      {status === 'recording' && (
        <div className="fixed bottom-4 right-4 bg-black/80 text-white px-4 py-2 rounded-full">
          Recording: {timeLeft}s
        </div>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Voice Note</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Enter title for your voice note"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            {mediaUrl && (
              <audio controls className="w-full">
                <source src={mediaUrl} type="audio/wav" />
              </audio>
            )}
          </div>
          <DialogFooter>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Voice Note
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VoiceNoteRecorder;