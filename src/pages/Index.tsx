import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useBoards } from '@/hooks/useBoards';
import { Header } from '@/components/Header';
import { BoardCard } from '@/components/BoardCard';
import { CreateBoardModal } from '@/components/CreateBoardModal';
import { Clock } from 'lucide-react';

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onCreateBoard={() => setIsCreateModalOpen(true)} />

      <main className="max-w-7xl mx-auto p-6 space-y-8">
        {recentBoards.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-muted-foreground" />
              <h2 className="text-lg font-semibold">Недавно просмотренные</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {recentBoards.map((board) => (
                <BoardCard key={board.id} board={board} />
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="text-lg font-semibold mb-4">Ваши доски</h2>
          {boards.length === 0 ? (
            <div className="text-center py-12 bg-muted rounded-lg">
              <p className="text-muted-foreground mb-4">
                У вас пока нет досок
              </p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="text-primary hover:underline font-medium"
              >
                Создайте первую доску
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
