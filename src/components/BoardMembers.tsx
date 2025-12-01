import { useState } from 'react';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Button } from './ui/button';
import { UserPlus, Crown, Edit3, Eye, X } from 'lucide-react';
import { BoardMember, User, MemberRole } from '@/types';
import { useBoardMembers } from '@/hooks/useBoardMembers';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from './ui/dropdown-menu';

interface BoardMembersProps {
  members: BoardMember[];
  ownerId: string;
  currentUserId: string;
  onInvite: () => void;
  onRemoveMember: (userId: string) => void;
  onUpdateRole: (userId: string, role: MemberRole) => void;
}

export const BoardMembers = ({ 
  members, 
  ownerId, 
  currentUserId,
  onInvite,
  onRemoveMember,
  onUpdateRole
}: BoardMembersProps) => {
  const allMemberIds = [ownerId, ...members.map(m => m.userId)];
  const { members: memberUsers, loading } = useBoardMembers(allMemberIds);

  const getRoleIcon = (role: MemberRole) => {
    switch (role) {
      case 'owner': return <Crown className="w-3 h-3 text-yellow-500" />;
      case 'editor': return <Edit3 className="w-3 h-3 text-blue-500" />;
      case 'viewer': return <Eye className="w-3 h-3 text-gray-500" />;
    }
  };

  const getRoleLabel = (role: MemberRole) => {
    switch (role) {
      case 'owner': return 'Владелец';
      case 'editor': return 'Редактор';
      case 'viewer': return 'Наблюдатель';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getMemberRole = (userId: string): MemberRole => {
    if (userId === ownerId) return 'owner';
    return members.find(m => m.userId === userId)?.role || 'viewer';
  };

  const getUserData = (userId: string): User | undefined => {
    return memberUsers.find(u => u.id === userId);
  };

  const isOwner = currentUserId === ownerId;
  const canManageMembers = isOwner;

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-secondary animate-pulse" />
        <div className="w-8 h-8 rounded-full bg-secondary animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <TooltipProvider>
        <div className="flex items-center -space-x-2">
          {allMemberIds.slice(0, 5).map((memberId) => {
            const userData = getUserData(memberId);
            const role = getMemberRole(memberId);
            
            if (!userData) return null;

            return (
              <Tooltip key={memberId}>
                <TooltipTrigger asChild>
                  <div className="relative group cursor-pointer">
                    {canManageMembers && memberId !== ownerId ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <div>
                            <Avatar className="h-8 w-8 border-2 border-background hover:border-primary/40 transition-smooth">
                              <AvatarFallback className="bg-gradient-primary text-white text-xs font-semibold">
                                {getInitials(userData.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-0.5">
                              {getRoleIcon(role)}
                            </div>
                          </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-48">
                          <div className="px-2 py-1.5 text-sm border-b border-border">
                            <p className="font-semibold">{userData.name}</p>
                            <p className="text-xs text-muted-foreground">{userData.email}</p>
                          </div>
                          <DropdownMenuItem onClick={() => onUpdateRole(memberId, 'editor')}>
                            <Edit3 className="w-4 h-4 mr-2" />
                            Сделать редактором
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onUpdateRole(memberId, 'viewer')}>
                            <Eye className="w-4 h-4 mr-2" />
                            Сделать наблюдателем
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => onRemoveMember(memberId)}
                            className="text-destructive focus:text-destructive"
                          >
                            <X className="w-4 h-4 mr-2" />
                            Удалить из доски
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      <>
                        <Avatar className="h-8 w-8 border-2 border-background">
                          <AvatarFallback className="bg-gradient-primary text-white text-xs font-semibold">
                            {getInitials(userData.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-0.5">
                          {getRoleIcon(role)}
                        </div>
                      </>
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-center">
                    <p className="font-semibold">{userData.name}</p>
                    <p className="text-xs text-muted-foreground">{getRoleLabel(role)}</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            );
          })}
          
          {allMemberIds.length > 5 && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="h-8 w-8 rounded-full bg-secondary border-2 border-background flex items-center justify-center text-xs font-semibold cursor-pointer hover:bg-secondary/80 transition-smooth">
                  +{allMemberIds.length - 5}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Еще {allMemberIds.length - 5} участников</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </TooltipProvider>

      {canManageMembers && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onInvite}
          className="h-8 gap-2 text-white hover:bg-white/20"
        >
          <UserPlus className="w-4 h-4" />
          <span className="hidden sm:inline">Пригласить</span>
        </Button>
      )}
    </div>
  );
};
