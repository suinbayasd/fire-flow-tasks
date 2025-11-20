import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useBoards } from '@/hooks/useBoards';
import { Header } from '@/components/Header';
import { BoardCard } from '@/components/BoardCard';
import { CreateBoardModal } from '@/components/CreateBoardModal';
import { Button } from '@/components/ui/button';
import { Clock, Plus } from 'lucide-react';

const Index = () => {
  const { user, userData } = useAuth();
  const { boards, loading: boardsLoading, createBoard } = useBoards(user?.uid);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleCreateBoard = async (title: string, background: string) => {
    if (user) {
      await createBoard(title, background, user.uid);
    }
  };

  const recentBoards = boards.filter(board => 
    userData?.recentlyViewed?.includes(board.id)
  ).slice(0, 4);

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
      <Header onCreateBoard={() => setIsCreateModalOpen(true)} />

      <main className="max-w-7xl mx-auto p-8 space-y-10">
        {recentBoards.length > 0 && (
          <section className="animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
              <Clock className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-semibold">Недавно просмотренные</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {recentBoards.map((board) => (
                <BoardCard key={board.id} board={board} />
              ))}
            </div>
          </section>
        )}

        <section className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-xl font-semibold mb-6">Ваши доски</h2>
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
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {boards.map((board) => (
                <BoardCard key={board.id} board={board} />
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
