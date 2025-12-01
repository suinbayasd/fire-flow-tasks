import { useAuth } from '@/hooks/useAuth';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Plus, LogOut } from 'lucide-react';
import { SearchBar } from './SearchBar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface HeaderProps {
  onCreateBoard: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export const Header = ({ onCreateBoard, searchQuery = '', onSearchChange }: HeaderProps) => {
  const { userData, signOut } = useAuth();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-8">
          <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent whitespace-nowrap">
            TaskFlow
          </h1>
        </div>

        {onSearchChange && (
          <div className="flex-1 max-w-md hidden md:block">
            <SearchBar 
              value={searchQuery} 
              onChange={onSearchChange}
              placeholder="Поиск досок и карточек..."
            />
          </div>
        )}

        <div className="flex items-center gap-4">
          <Button 
            onClick={onCreateBoard}
            className="shadow-elegant hover:shadow-glow transition-smooth"
          >
            <Plus className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Создать доску</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="focus:outline-none">
                <Avatar className="h-9 w-9 border-2 border-primary/20 hover:border-primary/40 transition-smooth cursor-pointer">
                  <AvatarFallback className="bg-gradient-primary text-white text-sm font-semibold">
                    {userData?.name ? getInitials(userData.name) : 'U'}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 animate-scale-in">
              <div className="px-2 py-1.5 text-sm">
                <p className="font-semibold">{userData?.name}</p>
                <p className="text-xs text-muted-foreground">{userData?.email}</p>
              </div>
              <DropdownMenuItem onClick={signOut} className="text-destructive focus:text-destructive cursor-pointer">
                <LogOut className="w-4 h-4 mr-2" />
                Выйти
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
