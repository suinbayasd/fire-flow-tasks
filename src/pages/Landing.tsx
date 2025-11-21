import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Layout, Users, Zap } from 'lucide-react';
import { AuthForm } from '@/components/AuthForm';

const Landing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Layout className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                TaskFlow
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Marketing Content */}
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-4">
              <h2 className="text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                TaskFlow — Управляй задачами{' '}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  как профессионал
                </span>
              </h2>
              <p className="text-lg lg:text-xl text-muted-foreground">
                Интуитивный канбан-борд для команд и личных проектов
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <Feature
                icon={<Zap className="w-5 h-5" />}
                text="Создавайте доски за секунды"
              />
              <Feature
                icon={<Layout className="w-5 h-5" />}
                text="Перетаскивайте задачи между колонками"
              />
              <Feature
                icon={<Users className="w-5 h-5" />}
                text="Работайте вместе в реальном времени"
              />
              <Feature
                icon={<CheckCircle2 className="w-5 h-5" />}
                text="Доступно на всех устройствах"
              />
            </div>

            {/* Illustration */}
            <div className="relative hidden lg:block">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-3xl" />
              <div className="relative bg-card/50 backdrop-blur-sm border-2 border-border rounded-2xl p-6 shadow-card">
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="flex-1 bg-secondary/50 rounded-lg p-3 space-y-2">
                      <div className="h-2 bg-primary/20 rounded w-1/2" />
                      <div className="h-16 bg-background rounded" />
                      <div className="h-16 bg-background rounded" />
                    </div>
                    <div className="flex-1 bg-secondary/50 rounded-lg p-3 space-y-2">
                      <div className="h-2 bg-accent/20 rounded w-1/2" />
                      <div className="h-16 bg-background rounded" />
                    </div>
                    <div className="flex-1 bg-secondary/50 rounded-lg p-3 space-y-2">
                      <div className="h-2 bg-success/20 rounded w-1/2" />
                      <div className="h-16 bg-background rounded" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Auth Form */}
          <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <AuthForm />
          </div>
        </div>
      </main>
    </div>
  );
};

const Feature = ({ icon, text }: { icon: React.ReactNode; text: string }) => {
  return (
    <div className="flex items-center gap-3 group">
      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center text-primary group-hover:scale-110 transition-smooth">
        {icon}
      </div>
      <p className="text-base lg:text-lg text-foreground font-medium">{text}</p>
    </div>
  );
};

export default Landing;
