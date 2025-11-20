import { Search, Plus, User, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { useAuth } from '@/hooks/useAuth';

interface HeaderProps {
  onCreateBoard: () => void;
}

export const Header = ({ onCreateBoard }: HeaderProps) => {
  const { userData, signOut } = useAuth();

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-card/95">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              TaskFlow
            </h1>
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Поиск досок..." 
                className="pl-10 pr-4 py-2 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary w-72 transition-smooth"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              onClick={onCreateBoard}
              size="sm"
              className="shadow-sm hover:shadow-md"
            >
              <Plus className="w-4 h-4 mr-2" />
              Создать доску
            </Button>
            
            <div className="relative group">
              <Avatar className="cursor-pointer ring-2 ring-transparent group-hover:ring-primary/20 transition-smooth">
                <AvatarFallback className="bg-gradient-primary text-primary-foreground font-semibold">
                  {userData?.name?.charAt(0).toUpperCase() || <User className="w-4 h-4" />}
                </AvatarFallback>
              </Avatar>
              
              <div className="absolute right-0 mt-3 w-56 bg-card rounded-xl shadow-lg border border-border py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-smooth animate-fade-in">
                <div className="px-4 py-3 border-b border-border">
                  <p className="font-semibold text-sm">{userData?.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{userData?.email}</p>
                </div>
                <button 
                  onClick={signOut}
                  className="w-full text-left px-4 py-2.5 text-sm hover:bg-secondary transition-fast flex items-center gap-2 text-destructive"
                >
                  <LogOut className="w-4 h-4" />
                  Выйти
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
