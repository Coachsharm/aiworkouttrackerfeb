import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Card } from '../ui/card';
import { getSmartIcon, getAllIcons } from '@/utils/iconSelector';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const [selectedIconKey, setSelectedIconKey] = useState<string>('');
  const allIcons = getAllIcons();

  useEffect(() => {
    if (!selectedIconKey) {
      const icon = getSmartIcon(title);
      setSmartIcon(icon);
    }
  }, [title, selectedIconKey]);

  const handleIconSelect = (iconKey: string) => {
    const selected = allIcons.find(i => i.keywords === iconKey);
    if (selected) {
      setSmartIcon(selected.icon);
      setSelectedIconKey(iconKey);
    }
  };

  return (
    <Card className="p-4 space-y-4">
      <div className="flex gap-4">
        <div className="flex-1">
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
        </div>
        <Select value={selectedIconKey} onValueChange={handleIconSelect}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select icon" />
          </SelectTrigger>
          <SelectContent>
            {allIcons.map(({ icon: Icon, keywords }) => (
              <SelectItem key={keywords} value={keywords}>
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  <span className="capitalize">{keywords}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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