import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Save, X } from 'lucide-react';

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
  return (
    <div className="space-y-4">
      <Input
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
      />
      <Textarea
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
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