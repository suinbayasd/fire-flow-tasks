import { Board } from '@/types';
import { useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';

interface BoardCardProps {
  board: Board;
}

export const BoardCard = ({ board }: BoardCardProps) => {
  const navigate = useNavigate();

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
          <button 
            className="opacity-0 group-hover:opacity-100 transition-smooth p-1.5 hover:bg-white/20 rounded-lg"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Star className="w-4 h-4 text-white" />
          </button>
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
