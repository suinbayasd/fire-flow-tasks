import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from './ui/input';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SearchBar = ({ value, onChange, placeholder = "Поиск досок..." }: SearchBarProps) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`relative transition-all duration-300 ${isFocused ? 'w-full sm:w-96' : 'w-full sm:w-72'}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className="pl-10 pr-10 h-10 bg-secondary/50 border-border/50 focus:bg-background transition-smooth"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-secondary rounded-md transition-smooth"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      )}
    </div>
  );
};
