import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Card } from '../ui/card';
import { getSmartIcon } from '@/utils/iconSelector';

interface AddNoteFormProps {
  title: string;
  description: string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

const AddNoteForm = ({
  title,
  description,
  onTitleChange,
  onDescriptionChange,
  onSave,
  onCancel,
}: AddNoteFormProps) => {
  const [SmartIcon, setSmartIcon] = useState<any>(null);

  useEffect(() => {
    const icon = getSmartIcon(title);
    setSmartIcon(icon);
  }, [title]);

  return (
    <Card className="p-4 space-y-4">
      <div className="relative">
        <Input
          placeholder="Title (optional)"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className={SmartIcon ? "pl-10" : ""}
        />
        {SmartIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <SmartIcon className="h-4 w-4" />
          </div>
        )}
      </div>
      <Textarea
        placeholder="Description"
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
      />
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onSave}>Save Note</Button>
      </div>
    </Card>
  );
};

export default AddNoteForm;