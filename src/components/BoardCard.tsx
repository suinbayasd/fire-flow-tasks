import { Board } from '@/types';
import { useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BoardCardProps {
  board: Board;
  isFavorite?: boolean;
  onToggleFavorite?: (boardId: string) => void;
}

export const BoardCard = ({ board, isFavorite = false, onToggleFavorite }: BoardCardProps) => {
  const navigate = useNavigate();

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite?.(board.id);
  };

  return (
    <div
      onClick={() => navigate(`/board/${board.id}`)}
      className="relative h-32 rounded-xl cursor-pointer transition-smooth shadow-card hover:shadow-card-hover hover:-translate-y-1 group overflow-hidden"
      style={{ 
        background: board.background.startsWith('gradient-') 
          ? `var(--${board.background})` 
          : board.background 
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40 group-hover:to-black/50 transition-smooth" />
      <div className="relative h-full p-5 flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <h3 className="text-white font-semibold text-lg drop-shadow-lg line-clamp-2">
            {board.title}
          </h3>
          {onToggleFavorite && (
            <button 
              className={cn(
                "transition-smooth p-1.5 hover:bg-white/20 rounded-lg",
                isFavorite ? "opacity-100" : "opacity-0 group-hover:opacity-100"
              )}
              onClick={handleFavoriteClick}
            >
              <Star className={cn(
                "w-4 h-4 transition-smooth",
                isFavorite ? "fill-yellow-400 text-yellow-400" : "text-white"
              )} />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 text-white/90 text-xs">
          <div className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-md">
            Открыть
          </div>
        </div>
      </div>
    </div>
  );
};
