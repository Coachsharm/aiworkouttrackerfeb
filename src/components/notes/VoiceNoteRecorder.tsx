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
  const [isRecording, setIsRecording] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const {
    status,
    startRecording,
    stopRecording,
    mediaBlobUrl,
    clearBlobUrl
  } = useReactMediaRecorder({
    audio: true,
    onStop: async (blobUrl, blob) => {
      setIsOpen(true);
      setIsRecording(false);
      if (blob) {
        try {
          const storage = getStorage();
          const fileName = `voice-notes/${user?.uid}/${Date.now()}.wav`;
          const storageRef = ref(storage, fileName);
          await uploadBytes(storageRef, blob);
          const downloadUrl = await getDownloadURL(storageRef);
          setMediaUrl(downloadUrl);
          toast({
            title: "Recording completed",
            description: "You can now save your voice note."
          });
        } catch (error) {
          console.error('Error uploading voice note:', error);
          toast({
            variant: "destructive",
            title: "Error saving recording",
            description: "Please try again."
          });
        }
      }
    }
  });

  const [mediaUrl, setMediaUrl] = useState<string | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRecording) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            stopRecording();
            setIsRecording(false);
            return 15;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRecording, stopRecording]);

  const handleStartRecording = () => {
    setTimeLeft(15);
    setIsRecording(true);
    startRecording();
    toast({
      title: "Recording started",
      description: "Recording for 15 seconds..."
    });
  };

  const handleStopRecording = () => {
    stopRecording();
    setIsRecording(false);
    setTimeLeft(15);
  };

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
      clearBlobUrl();
      setMediaUrl(null);
      toast({
        title: "Voice note saved",
        description: "Your voice note has been saved successfully."
      });
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setTitle('');
    clearBlobUrl();
    setMediaUrl(null);
  };

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className={`voice-recorder-trigger ${isRecording ? 'bg-red-500 hover:bg-red-600' : ''}`}
        onClick={() => {
          if (isRecording) {
            handleStopRecording();
          } else {
            handleStartRecording();
          }
        }}
      >
        {isRecording ? (
          <Square className="h-4 w-4" />
        ) : (
          <Mic className="h-4 w-4" />
        )}
      </Button>

      {isRecording && (
        <div className="fixed bottom-4 right-4 bg-black/80 text-white px-4 py-2 rounded-full">
          Recording: {timeLeft}s
        </div>
      )}

      <Dialog open={isOpen} onOpenChange={handleClose}>
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
                Your browser does not support the audio element.
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