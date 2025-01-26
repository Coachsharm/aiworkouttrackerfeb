import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Save, X } from 'lucide-react';
import { getSmartIcon, getAllIcons } from '@/utils/iconSelector';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const [selectedIconKey, setSelectedIconKey] = useState<string>('');
  const allIcons = getAllIcons();

  useEffect(() => {
    if (!selectedIconKey) {
      const icon = getSmartIcon(title);
      setSmartIcon(icon);
    }
  }, [title, selectedIconKey]);

  const handleIconSelect = (iconKey: string) => {
    if (iconKey === 'no icon') {
      setSmartIcon(null);
      setSelectedIconKey(iconKey);
      return;
    }

    const selected = allIcons.find(i => i.keywords === iconKey);
    if (selected) {
      setSmartIcon(selected.icon);
      setSelectedIconKey(iconKey);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Select value={selectedIconKey} onValueChange={handleIconSelect}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Icon" />
          </SelectTrigger>
          <SelectContent>
            {allIcons.map(({ icon: Icon, keywords }) => (
              <SelectItem key={keywords} value={keywords}>
                <div className="flex items-center gap-2">
                  {Icon ? <Icon className="h-4 w-4" /> : <span>No Icon</span>}
                  <span className="capitalize">{keywords}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex-1">
          <Input
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Title (optional)"
          />
        </div>
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