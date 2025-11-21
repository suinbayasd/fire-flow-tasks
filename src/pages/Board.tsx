import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import { useAuth } from '@/hooks/useAuth';
import { useColumns } from '@/hooks/useColumns';
import { useCards } from '@/hooks/useCards';
import { doc, getDoc, updateDoc, arrayUnion, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Board as BoardType, Card } from '@/types';
import { BoardColumn } from '@/components/BoardColumn';
import { CardModal } from '@/components/CardModal';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Board = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { columns, createColumn, updateColumn, deleteColumn } = useColumns(boardId);
  const { cards, createCard, updateCard, deleteCard } = useCards(boardId);
  
  const [board, setBoard] = useState<BoardType | null>(null);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!boardId || !user) return;

    const fetchBoard = async () => {
      try {
        const boardDoc = await getDoc(doc(db, 'boards', boardId));
        if (boardDoc.exists()) {
          const boardData = {
            id: boardDoc.id,
            ...boardDoc.data(),
            createdAt: boardDoc.data().createdAt?.toDate(),
            updatedAt: boardDoc.data().updatedAt?.toDate(),
          } as BoardType;
          setBoard(boardData);

          // Update recently viewed
          await updateDoc(doc(db, 'users', user.uid), {
            recentlyViewed: arrayUnion(boardId)
          });
        } else {
          toast({
            title: "Доска не найдена",
            variant: "destructive",
          });
          navigate('/');
        }
      } catch (error) {
        console.error('Error fetching board:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBoard();
  }, [boardId, user, navigate]);

  useEffect(() => {
    if (columns.length === 0 && boardId && !loading) {
      // Create default columns
      createColumn('To Do', boardId, 0);
      createColumn('In Progress', boardId, 1);
      createColumn('Done', boardId, 2);
    }
  }, [columns.length, boardId, loading]);

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination, type } = result;

    if (type === 'column') {
      const reorderedColumns = Array.from(columns);
      const [movedColumn] = reorderedColumns.splice(source.index, 1);
      reorderedColumns.splice(destination.index, 0, movedColumn);

      // Update orders
      reorderedColumns.forEach((col, index) => {
        updateColumn(col.id, { order: index });
      });
      return;
    }

    if (type === 'card') {
      const sourceColumn = source.droppableId;
      const destColumn = destination.droppableId;
      const cardId = result.draggableId;

      if (sourceColumn === destColumn) {
        // Reorder within same column
        const columnCards = cards
          .filter(card => card.columnId === sourceColumn)
          .sort((a, b) => a.order - b.order);
        
        const [movedCard] = columnCards.splice(source.index, 1);
        columnCards.splice(destination.index, 0, movedCard);

        columnCards.forEach((card, index) => {
          updateCard(card.id, { order: index });
        });
      } else {
        // Move to different column
        await updateCard(cardId, { 
          columnId: destColumn,
          order: destination.index 
        });
      }
    }
  };

  const handleCreateCard = async (columnId: string, cardTitle: string) => {
    const columnCards = cards.filter(card => card.columnId === columnId);
    const newOrder = columnCards.length;
    if (boardId) {
      await createCard(cardTitle, columnId, boardId, newOrder);
    }
  };

  const handleCardClick = (card: Card) => {
    setSelectedCard(card);
    setIsCardModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">Загрузка доски...</p>
        </div>
      </div>
    );
  }

  if (!board) return null;

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: board.background.startsWith('gradient-')
          ? `var(--${board.background})`
          : board.background,
      }}
    >
      <header className="bg-black/20 backdrop-blur-sm text-white p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Назад
            </Button>
            <h1 className="text-2xl font-bold">{board.title}</h1>
          </div>

          <Button
            size="sm"
            onClick={() => {
              const newOrder = columns.length;
              if (boardId) {
                createColumn('Новая колонка', boardId, newOrder);
              }
            }}
            className="bg-white/20 hover:bg-white/30 text-white border-none"
          >
            <Plus className="w-4 h-4 mr-2" />
            Добавить колонку
          </Button>
        </div>
      </header>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="board" type="column" direction="horizontal">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="flex-1 overflow-x-auto p-6"
            >
              <div className="flex gap-4 h-full">
                {columns.map((column, index) => (
                  <BoardColumn
                    key={column.id}
                    column={column}
                    cards={cards.filter(card => card.columnId === column.id)}
                    index={index}
                    onCreateCard={handleCreateCard}
                    onUpdateColumn={(columnId, title) => updateColumn(columnId, { title })}
                    onDeleteColumn={deleteColumn}
                    onCardClick={handleCardClick}
                  />
                ))}
                {provided.placeholder}
              </div>
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <CardModal
        card={selectedCard}
        open={isCardModalOpen}
        onClose={() => {
          setIsCardModalOpen(false);
          setSelectedCard(null);
        }}
        onUpdateCard={updateCard}
        onDeleteCard={deleteCard}
      />
    </div>
  );
};

export default Board;
