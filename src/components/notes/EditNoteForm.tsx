import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Save, X } from 'lucide-react';
import { getSmartIcon } from '@/utils/iconSelector';

interface EditNoteFormProps {
  title: string;
  description: string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

const EditNoteForm = ({
  title,
  description,
  onTitleChange,
  onDescriptionChange,
  onSave,
  onCancel,
}: EditNoteFormProps) => {
  const [SmartIcon, setSmartIcon] = useState<any>(null);

  useEffect(() => {
    const icon = getSmartIcon(title);
    setSmartIcon(icon);
  }, [title]);

  return (
    <div className="space-y-4">
      <div className="relative">
        <Input
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className={SmartIcon ? "pl-10" : ""}
          placeholder="Title (optional)"
        />
        {SmartIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <SmartIcon className="h-4 w-4" />
          </div>
        )}
      </div>
      <Textarea
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
        placeholder="Description"
      />
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
        <Button onClick={onSave}>
          <Save className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default EditNoteForm;