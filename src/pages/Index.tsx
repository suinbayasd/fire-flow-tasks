import { useState, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useBoards } from '@/hooks/useBoards';
import { useFavorites } from '@/hooks/useFavorites';
import { Header } from '@/components/Header';
import { BoardCard } from '@/components/BoardCard';
import { BoardFilters, FilterType } from '@/components/BoardFilters';
import { CreateBoardModal } from '@/components/CreateBoardModal';
import { Button } from '@/components/ui/button';
import { Plus, Inbox } from 'lucide-react';

const Index = () => {
  const { user, userData } = useAuth();
  const { boards, loading: boardsLoading, createBoard } = useBoards(user?.uid);
  const { toggleFavorite } = useFavorites();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const handleCreateBoard = async (title: string, background: string) => {
    if (user) {
      await createBoard(title, background, user.uid);
    }
  };

  const handleToggleFavorite = async (boardId: string) => {
    if (user && userData) {
      const isFavorite = userData.favorites?.includes(boardId) || false;
      await toggleFavorite(user.uid, boardId, isFavorite);
    }
  };

  const filteredBoards = useMemo(() => {
    let filtered = boards;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(board => 
        board.title.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    switch (activeFilter) {
      case 'favorites':
        filtered = filtered.filter(board => 
          userData?.favorites?.includes(board.id)
        );
        break;
      case 'recent':
        filtered = filtered.filter(board => 
          userData?.recentlyViewed?.includes(board.id)
        );
        break;
      default:
        break;
    }

    return filtered;
  }, [boards, searchQuery, activeFilter, userData]);

  if (boardsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mx-auto" />
          <p className="text-lg text-muted-foreground font-medium">Загрузка досок...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onCreateBoard={() => setIsCreateModalOpen(true)} 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main className="max-w-7xl mx-auto p-8 space-y-8">
        <div className="flex items-center justify-between animate-fade-in">
          <BoardFilters activeFilter={activeFilter} onFilterChange={setActiveFilter} />
        </div>

        <section className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
          {boards.length === 0 ? (
            <div className="text-center py-20 bg-gradient-to-br from-secondary to-muted rounded-2xl border-2 border-dashed border-border">
              <div className="max-w-md mx-auto space-y-4">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Plus className="w-10 h-10 text-primary" />
                </div>
                <p className="text-lg text-muted-foreground">
                  У вас пока нет досок
                </p>
                <p className="text-sm text-muted-foreground">
                  Создайте свою первую доску, чтобы начать организовывать задачи
                </p>
                <Button
                  onClick={() => setIsCreateModalOpen(true)}
                  size="lg"
                  className="mt-4"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Создать первую доску
                </Button>
              </div>
            </div>
          ) : filteredBoards.length === 0 ? (
            <div className="text-center py-20 bg-gradient-to-br from-secondary to-muted rounded-2xl border border-border">
              <div className="max-w-md mx-auto space-y-4">
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto">
                  <Inbox className="w-10 h-10 text-muted-foreground" />
                </div>
                <p className="text-lg text-muted-foreground">
                  {searchQuery ? 'Ничего не найдено' : 'Нет досок в этой категории'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {searchQuery 
                    ? `По запросу "${searchQuery}" не найдено ни одной доски`
                    : 'Попробуйте выбрать другой фильтр или создать новую доску'
                  }
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {filteredBoards.map((board) => (
                <BoardCard 
                  key={board.id} 
                  board={board}
                  isFavorite={userData?.favorites?.includes(board.id) || false}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <CreateBoardModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateBoard={handleCreateBoard}
      />
    </div>
  );
};

export default Index;
