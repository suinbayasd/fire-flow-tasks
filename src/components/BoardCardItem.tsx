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
          className={`bg-card rounded-lg p-4 shadow-sm hover:shadow-md cursor-pointer transition-smooth border border-border hover:border-primary/30 group ${
            snapshot.isDragging ? 'rotate-2 scale-105 shadow-lg ring-2 ring-primary/20' : ''
          }`}
        >
          <p className="text-sm font-medium leading-snug group-hover:text-primary transition-smooth">{card.title}</p>
          {card.description && (
            <p className="text-xs text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
              {card.description}
            </p>
          )}
        </div>
      )}
    </Draggable>
  );
};
