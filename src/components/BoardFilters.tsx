import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { LayoutGrid, Star, Clock } from 'lucide-react';

export type FilterType = 'all' | 'favorites' | 'recent';

interface BoardFiltersProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export const BoardFilters = ({ activeFilter, onFilterChange }: BoardFiltersProps) => {
  return (
    <Tabs value={activeFilter} onValueChange={(value) => onFilterChange(value as FilterType)}>
      <TabsList className="bg-secondary/50 p-1">
        <TabsTrigger value="all" className="gap-2">
          <LayoutGrid className="w-4 h-4" />
          <span>Все доски</span>
        </TabsTrigger>
        <TabsTrigger value="favorites" className="gap-2">
          <Star className="w-4 h-4" />
          <span>Избранные</span>
        </TabsTrigger>
        <TabsTrigger value="recent" className="gap-2">
          <Clock className="w-4 h-4" />
          <span>Недавние</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
