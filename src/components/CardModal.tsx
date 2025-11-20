import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Card } from '@/types';
import { Trash2 } from 'lucide-react';

interface CardModalProps {
  card: Card | null;
  open: boolean;
  onClose: () => void;
  onUpdateCard: (cardId: string, updates: Partial<Card>) => void;
  onDeleteCard: (cardId: string) => void;
}

export const CardModal = ({ card, open, onClose, onUpdateCard, onDeleteCard }: CardModalProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (card) {
      setTitle(card.title);
      setDescription(card.description || '');
    }
  }, [card]);

  const handleSave = () => {
    if (card && title.trim()) {
      onUpdateCard(card.id, { title, description });
      onClose();
    }
  };

  const handleDelete = () => {
    if (card) {
      onDeleteCard(card.id);
      onClose();
    }
  };

  if (!card) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Редактирование карточки</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="card-title">Название</Label>
            <Input
              id="card-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Введите название..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="card-description">Описание</Label>
            <Textarea
              id="card-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Добавьте подробное описание..."
              rows={6}
            />
          </div>

          <div className="flex gap-2 justify-between">
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Удалить
            </Button>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Отмена
              </Button>
              <Button onClick={handleSave} disabled={!title.trim()}>
                Сохранить
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
