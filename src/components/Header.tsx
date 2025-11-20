import { Search, Plus, User } from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { useAuth } from '@/hooks/useAuth';

interface HeaderProps {
  onCreateBoard: () => void;
}

export const Header = ({ onCreateBoard }: HeaderProps) => {
  const { userData, signOut } = useAuth();

  return (
    <header className="bg-primary text-primary-foreground py-3 px-4 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">TaskFlow</h1>
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-70" />
            <input 
              type="text" 
              placeholder="Поиск..." 
              className="pl-10 pr-4 py-2 rounded-md bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary-foreground/30 w-64"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            onClick={onCreateBoard}
            size="sm"
            className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Создать доску
          </Button>
          
          <div className="relative group">
            <Avatar className="cursor-pointer">
              <AvatarFallback className="bg-accent text-accent-foreground">
                {userData?.name?.charAt(0).toUpperCase() || <User className="w-4 h-4" />}
              </AvatarFallback>
            </Avatar>
            
            <div className="absolute right-0 mt-2 w-48 bg-card rounded-lg shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
              <div className="px-4 py-2 border-b border-border">
                <p className="font-medium text-sm">{userData?.name}</p>
                <p className="text-xs text-muted-foreground">{userData?.email}</p>
              </div>
              <button 
                onClick={signOut}
                className="w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors"
              >
                Выйти
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
