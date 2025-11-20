import { Board } from '@/types';
import { useNavigate } from 'react-router-dom';

interface BoardCardProps {
  board: Board;
}

export const BoardCard = ({ board }: BoardCardProps) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/board/${board.id}`)}
      className="relative h-28 rounded-lg cursor-pointer transition-all shadow-card hover:shadow-card-hover group overflow-hidden"
      style={{ 
        background: board.background.startsWith('gradient-') 
          ? `var(--${board.background})` 
          : board.background 
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 group-hover:to-black/30 transition-all" />
      <div className="relative h-full p-4 flex items-start">
        <h3 className="text-white font-semibold text-lg drop-shadow-md">
          {board.title}
        </h3>
      </div>
    </div>
  );
};
