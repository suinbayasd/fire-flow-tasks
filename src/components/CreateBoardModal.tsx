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
      <DialogContent className="sm:max-w-lg animate-scale-in">
        <DialogHeader>
          <DialogTitle className="text-2xl">Создать новую доску</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="title" className="text-base font-semibold">Название доски</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Введите название доски..."
              className="h-11 text-base"
              autoFocus
            />
          </div>

          <div className="space-y-3">
            <Label className="text-base font-semibold">Выберите фон доски</Label>
            <div className="grid grid-cols-3 gap-3">
              {backgrounds.map((bg) => (
                <button
                  key={bg.id}
                  type="button"
                  onClick={() => setSelectedBackground(bg.id)}
                  className={`h-20 rounded-xl transition-smooth hover:scale-105 relative overflow-hidden ${
                    selectedBackground === bg.id 
                      ? 'ring-4 ring-primary ring-offset-2 scale-105 shadow-lg' 
                      : 'shadow-card hover:shadow-md'
                  }`}
                  style={{ background: `var(--${bg.id})` }}
                  aria-label={bg.label}
                >
                  {selectedBackground === bg.id && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-lg">
                        <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="px-6">
              Отмена
            </Button>
            <Button type="submit" disabled={!title.trim()} className="px-6">
              Создать доску
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
