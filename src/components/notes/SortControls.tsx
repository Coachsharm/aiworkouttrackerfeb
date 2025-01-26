import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SortControlsProps {
  onSort: (field: 'title' | 'createdAt' | 'modifiedAt') => void;
}

export const SortControls = ({ onSort }: SortControlsProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onSort('title')}>
          Sort by Title
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSort('createdAt')}>
          Sort by Creation Date
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSort('modifiedAt')}>
          Sort by Modified Date
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};