import { Draggable } from '@hello-pangea/dnd';
import { Card } from '@/types';

interface BoardCardItemProps {
  card: Card;
  index: number;
  onClick: () => void;
}

export const BoardCardItem = ({ card, index, onClick }: BoardCardItemProps) => {
  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={onClick}
          className={`bg-card rounded-lg p-3 shadow-card hover:shadow-card-hover cursor-pointer transition-all ${
            snapshot.isDragging ? 'rotate-2 scale-105' : ''
          }`}
        >
          <p className="text-sm font-medium">{card.title}</p>
          {card.description && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {card.description}
            </p>
          )}
        </div>
      )}
    </Draggable>
  );
};
