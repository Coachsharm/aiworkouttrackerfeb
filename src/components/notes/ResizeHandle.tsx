import { GripVertical } from 'lucide-react';

export const ResizeHandle = () => {
  return (
    <div className="flex items-center justify-center w-2 bg-border hover:bg-primary/20 transition-colors cursor-col-resize group">
      <div className="w-px h-full bg-border group-hover:bg-primary/50" />
      <GripVertical className="h-4 w-4 text-muted-foreground absolute" />
    </div>
  );
};