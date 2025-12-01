import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Avatar, AvatarFallback } from './ui/avatar';
import { MemberRole, BoardMember, User } from '@/types';
import { UserPlus, X, Crown, Edit3, Eye } from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from '@/hooks/use-toast';

interface InviteMemberModalProps {
  open: boolean;
  onClose: () => void;
  onInviteMember: (userId: string, role: MemberRole) => Promise<void>;
  currentMembers: BoardMember[];
  ownerId: string;
}

export const InviteMemberModal = ({ 
  open, 
  onClose, 
  onInviteMember,
  currentMembers,
  ownerId 
}: InviteMemberModalProps) => {
  const [email, setEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState<MemberRole>('editor');
  const [searchedUser, setSearchedUser] = useState<User | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const getRoleIcon = (role: MemberRole) => {
    switch (role) {
      case 'owner': return <Crown className="w-4 h-4 text-yellow-500" />;
      case 'editor': return <Edit3 className="w-4 h-4 text-blue-500" />;
      case 'viewer': return <Eye className="w-4 h-4 text-gray-500" />;
    }
  };

  const getRoleLabel = (role: MemberRole) => {
    switch (role) {
      case 'owner': return 'Владелец';
      case 'editor': return 'Редактор';
      case 'viewer': return 'Наблюдатель';
    }
  };

  const handleSearchUser = async () => {
    if (!email.trim()) {
      toast({
        title: "Введите email",
        description: "Пожалуйста, введите email пользователя",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    try {
      const usersRef = collection(db, 'users');
      const userQuery = query(usersRef, where('email', '==', email.toLowerCase().trim()));
      const snapshot = await getDocs(userQuery);

      if (snapshot.empty) {
        toast({
          title: "Пользователь не найден",
          description: "Пользователь с таким email не зарегистрирован",
          variant: "destructive",
        });
        setSearchedUser(null);
        return;
      }

      const userData = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as User;

      // Check if user is already a member
      if (userData.id === ownerId) {
        toast({
          title: "Это владелец доски",
          description: "Владелец доски уже имеет полный доступ",
          variant: "destructive",
        });
        setSearchedUser(null);
        return;
      }

      if (currentMembers.some(m => m.userId === userData.id)) {
        toast({
          title: "Уже участник",
          description: "Этот пользователь уже является участником доски",
          variant: "destructive",
        });
        setSearchedUser(null);
        return;
      }

      setSearchedUser(userData);
      toast({
        title: "Пользователь найден",
        description: `${userData.name} (${userData.email})`,
      });
    } catch (error) {
      console.error('Error searching user:', error);
      toast({
        title: "Ошибка поиска",
        description: "Не удалось найти пользователя",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleInvite = async () => {
    if (!searchedUser) return;

    try {
      await onInviteMember(searchedUser.id, selectedRole);
      toast({
        title: "Участник добавлен",
        description: `${searchedUser.name} добавлен с ролью ${getRoleLabel(selectedRole)}`,
      });
      setEmail('');
      setSearchedUser(null);
      setSelectedRole('editor');
      onClose();
    } catch (error) {
      console.error('Error inviting member:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось добавить участника",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md animate-scale-in">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-primary" />
            Пригласить участника
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-3">
            <Label htmlFor="email" className="text-sm font-semibold">Email пользователя</Label>
            <div className="flex gap-2">
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearchUser()}
                placeholder="user@example.com"
                className="flex-1"
              />
              <Button 
                onClick={handleSearchUser} 
                disabled={isSearching || !email.trim()}
                variant="secondary"
              >
                {isSearching ? 'Поиск...' : 'Найти'}
              </Button>
            </div>
          </div>

          {searchedUser && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg border border-border">
                <Avatar className="h-10 w-10 border-2 border-primary/20">
                  <AvatarFallback className="bg-gradient-primary text-white font-semibold">
                    {searchedUser.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{searchedUser.name}</p>
                  <p className="text-xs text-muted-foreground">{searchedUser.email}</p>
                </div>
                <button
                  onClick={() => setSearchedUser(null)}
                  className="p-1 hover:bg-secondary rounded-md transition-smooth"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>

              <div className="space-y-3">
                <Label htmlFor="role" className="text-sm font-semibold">Роль</Label>
                <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as MemberRole)}>
                  <SelectTrigger id="role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="editor">
                      <div className="flex items-center gap-2">
                        {getRoleIcon('editor')}
                        <div>
                          <p className="font-medium">Редактор</p>
                          <p className="text-xs text-muted-foreground">Может редактировать карточки и колонки</p>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="viewer">
                      <div className="flex items-center gap-2">
                        {getRoleIcon('viewer')}
                        <div>
                          <p className="font-medium">Наблюдатель</p>
                          <p className="text-xs text-muted-foreground">Может только просматривать доску</p>
                        </div>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <div className="flex gap-3 justify-end pt-4 border-t border-border">
            <Button variant="outline" onClick={onClose}>
              Отмена
            </Button>
            <Button 
              onClick={handleInvite} 
              disabled={!searchedUser}
              className="gap-2"
            >
              <UserPlus className="w-4 h-4" />
              Добавить участника
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
