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
      <DialogContent className="sm:max-w-2xl animate-scale-in">
        <DialogHeader>
          <DialogTitle className="text-2xl">Редактирование карточки</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="card-title" className="text-base font-semibold">Название</Label>
            <Input
              id="card-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Введите название карточки..."
              className="h-11 text-base"
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="card-description" className="text-base font-semibold">Описание</Label>
            <Textarea
              id="card-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Добавьте подробное описание задачи..."
              rows={8}
              className="text-base resize-none"
            />
          </div>

          <div className="flex gap-3 justify-between pt-4 border-t border-border">
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              className="px-4"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Удалить карточку
            </Button>
            
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose} className="px-6">
                Отмена
              </Button>
              <Button onClick={handleSave} disabled={!title.trim()} className="px-6">
                Сохранить изменения
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
