import React, { useState, useEffect } from 'react';
import { useMediaRecorder } from 'react-media-recorder';
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

interface VoiceNoteRecorderProps {
  onSave: (title: string, audioUrl: string) => void;
}

const VoiceNoteRecorder = ({ onSave }: VoiceNoteRecorderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [timeLeft, setTimeLeft] = useState(15);
  const { toast } = useToast();
  
  const {
    status,
    startRecording,
    stopRecording,
    mediaBlobUrl
  } = useMediaRecorder({
    audio: true,
    onStop: (blobUrl) => {
      setIsOpen(true);
    }
  });

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
    if (mediaBlobUrl) {
      onSave(title, mediaBlobUrl);
      setTitle('');
      setIsOpen(false);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className={status === 'recording' ? 'bg-red-500 hover:bg-red-600' : ''}
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
            {mediaBlobUrl && (
              <audio controls className="w-full">
                <source src={mediaBlobUrl} type="audio/wav" />
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