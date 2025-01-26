import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getAllIcons } from "@/utils/iconSelector";

interface IconSelectorProps {
  selectedIcon: string;
  onSelectIcon: (icon: string) => void;
}

export const IconSelector = ({ selectedIcon, onSelectIcon }: IconSelectorProps) => {
  const allIcons = getAllIcons();
  const SelectedIcon = allIcons.find(i => i.keywords === selectedIcon)?.icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          {SelectedIcon ? <SelectedIcon className="h-4 w-4" /> : 'Select Icon'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {allIcons.map(({ icon: Icon, keywords }) => (
          <DropdownMenuItem key={keywords} onClick={() => onSelectIcon(keywords)}>
            <div className="flex items-center gap-2">
              <Icon className="h-4 w-4" />
              <span className="capitalize">{keywords}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};