import { useState } from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { Plus, MoreHorizontal, Trash2 } from 'lucide-react';
import { Column, Card } from '@/types';
import { BoardCardItem } from './BoardCardItem';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface BoardColumnProps {
  column: Column;
  cards: Card[];
  index: number;
  onCreateCard: (columnId: string) => void;
  onUpdateColumn: (columnId: string, title: string) => void;
  onDeleteColumn: (columnId: string) => void;
  onCardClick: (card: Card) => void;
}

export const BoardColumn = ({
  column,
  cards,
  index,
  onCreateCard,
  onUpdateColumn,
  onDeleteColumn,
  onCardClick,
}: BoardColumnProps) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState(column.title);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');

  const handleTitleSubmit = () => {
    if (title.trim() && title !== column.title) {
      onUpdateColumn(column.id, title);
    }
    setIsEditingTitle(false);
  };

  const handleAddCard = () => {
    if (newCardTitle.trim()) {
      onCreateCard(column.id);
      setNewCardTitle('');
      setIsAddingCard(false);
    }
  };

  return (
    <Draggable draggableId={column.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="bg-card rounded-xl w-80 flex-shrink-0 flex flex-col max-h-full shadow-card border border-border"
        >
          <div
            {...provided.dragHandleProps}
            className="p-4 flex items-center justify-between border-b border-border"
          >
            {isEditingTitle ? (
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleTitleSubmit}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleTitleSubmit();
                  if (e.key === 'Escape') {
                    setTitle(column.title);
                    setIsEditingTitle(false);
                  }
                }}
                className="h-8 font-semibold"
                autoFocus
              />
            ) : (
              <h3
                className="font-semibold text-base cursor-pointer hover:text-primary transition-smooth px-2 py-1 -ml-2 rounded-lg hover:bg-secondary"
                onDoubleClick={() => setIsEditingTitle(true)}
              >
                {column.title}
                <span className="ml-2 text-xs text-muted-foreground font-normal">
                  {cards.length}
                </span>
              </h3>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-secondary">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => setIsEditingTitle(true)}>
                  Переименовать
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDeleteColumn(column.id)}
                  className="text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Удалить
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Droppable droppableId={column.id} type="card">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`flex-1 overflow-y-auto p-4 space-y-3 min-h-[100px] transition-smooth ${
                  snapshot.isDraggingOver ? 'bg-primary/5 ring-2 ring-primary/20 ring-inset' : ''
                }`}
              >
                {cards.map((card, index) => (
                  <BoardCardItem
                    key={card.id}
                    card={card}
                    index={index}
                    onClick={() => onCardClick(card)}
                  />
                ))}
                {provided.placeholder}
                {cards.length === 0 && !snapshot.isDraggingOver && (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    Перетащите сюда карточку
                  </div>
                )}
              </div>
            )}
          </Droppable>

          <div className="p-3 border-t border-border">
            {isAddingCard ? (
              <div className="space-y-2 animate-fade-in">
                <Input
                  value={newCardTitle}
                  onChange={(e) => setNewCardTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddCard();
                    if (e.key === 'Escape') {
                      setNewCardTitle('');
                      setIsAddingCard(false);
                    }
                  }}
                  placeholder="Введите название карточки..."
                  className="border-primary/50 focus:border-primary"
                  autoFocus
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleAddCard} disabled={!newCardTitle.trim()}>
                    Добавить
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setNewCardTitle('');
                      setIsAddingCard(false);
                    }}
                  >
                    Отмена
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start hover:bg-primary/10 hover:text-primary"
                onClick={() => setIsAddingCard(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Добавить карточку
              </Button>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
};
