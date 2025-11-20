import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';

interface CreateBoardModalProps {
  open: boolean;
  onClose: () => void;
  onCreateBoard: (title: string, background: string) => void;
}

const backgrounds = [
  { id: 'gradient-board-1', label: 'Синий градиент' },
  { id: 'gradient-board-2', label: 'Фиолетовый градиент' },
  { id: 'gradient-board-3', label: 'Красный градиент' },
  { id: 'gradient-board-4', label: 'Зелёный градиент' },
  { id: 'gradient-board-5', label: 'Оранжевый градиент' },
];

export const CreateBoardModal = ({ open, onClose, onCreateBoard }: CreateBoardModalProps) => {
  const [title, setTitle] = useState('');
  const [selectedBackground, setSelectedBackground] = useState(backgrounds[0].id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onCreateBoard(title, selectedBackground);
      setTitle('');
      setSelectedBackground(backgrounds[0].id);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Создать доску</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Название доски</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Введите название..."
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label>Фон доски</Label>
            <div className="grid grid-cols-3 gap-2">
              {backgrounds.map((bg) => (
                <button
                  key={bg.id}
                  type="button"
                  onClick={() => setSelectedBackground(bg.id)}
                  className={`h-16 rounded-lg transition-all ${
                    selectedBackground === bg.id 
                      ? 'ring-2 ring-primary ring-offset-2' 
                      : 'hover:scale-105'
                  }`}
                  style={{ background: `var(--${bg.id})` }}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Отмена
            </Button>
            <Button type="submit" disabled={!title.trim()}>
              Создать
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
