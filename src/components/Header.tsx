import React from 'react';
import { 
  Play, 
  Settings, 
  Volume2, 
  VolumeX,
  Code,
  Download,
  Check
} from 'lucide-react';
import { AppView, QuizGame } from '../types';
import { playClickSound } from '../utils/audio';

interface HeaderProps {
  currentView: AppView;
  onViewChange: (view: AppView) => void;
  activeQuiz: QuizGame;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onCopyEmbedCode: () => void;
  onDownloadHtml: () => void;
  copiedCode: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onViewChange,
  activeQuiz,
  soundEnabled,
  onToggleSound,
  onCopyEmbedCode,
  onDownloadHtml,
  copiedCode,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-xs">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Zone 1: Wordmark with title and subtitle */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              playClickSound();
              onViewChange('editor');
            }}
            className="flex items-center gap-2.5 text-left focus:outline-none group cursor-pointer"
            title="Ir para Configuração"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white font-black shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <span className="font-display text-lg tracking-tighter">V/F</span>
            </div>
            <div>
              <span className="text-base sm:text-lg font-extrabold tracking-tight text-slate-900 block leading-tight">
                Verdadeiro ou Falso
              </span>
              <span className="text-xs font-medium text-slate-500 block leading-tight">
                Criador de quiz de V ou F
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Buttons on the same line */}
        <nav className="flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200">
          <button
            onClick={() => {
              playClickSound();
              onViewChange('editor');
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              currentView === 'editor'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80 font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Settings className="w-3.5 h-3.5 text-blue-600" />
            <span>Configuração</span>
          </button>

          <button
            onClick={() => {
              playClickSound();
              onViewChange('play');
            }}
            disabled={activeQuiz.questions.length === 0}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              currentView === 'play'
                ? 'bg-blue-600 text-white shadow-sm font-bold'
                : activeQuiz.questions.length === 0
                ? 'text-slate-400 cursor-not-allowed'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title={activeQuiz.questions.length === 0 ? 'Adicione ao menos uma pergunta para testar o preview' : 'Ver Preview do quiz'}
          >
            <Play className={`w-3.5 h-3.5 ${currentView === 'play' ? 'text-white fill-white' : 'text-blue-600 fill-blue-600'}`} />
            <span>Preview</span>
          </button>
        </nav>

        {/* Zone 3: Copiar código e Baixar HTML (reduced size, aligned to the right) */}
        <div className="flex items-center gap-2">
          
          {/* Botão Copiar código reduzido */}
          <button
            onClick={onCopyEmbedCode}
            disabled={activeQuiz.questions.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow-xs transition-all cursor-pointer disabled:opacity-40"
            title="Copiar código HTML do quiz"
          >
            {copiedCode ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span className="hidden sm:inline">Copiado!</span>
              </>
            ) : (
              <>
                <Code className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Copiar código</span>
              </>
            )}
          </button>

          {/* Botão Baixar HTML reduzido */}
          <button
            onClick={onDownloadHtml}
            disabled={activeQuiz.questions.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow-xs transition-all cursor-pointer disabled:opacity-40"
            title="Baixar arquivo HTML"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Baixar HTML</span>
          </button>

          {/* Audio toggle button */}
          <button
            onClick={() => {
              playClickSound();
              onToggleSound();
            }}
            aria-label={soundEnabled ? 'Silenciar efeitos de som' : 'Ativar efeitos de som'}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 hover:text-slate-900 hover:border-slate-300 transition-colors cursor-pointer ml-1"
            title={soundEnabled ? 'Sons ativados (Clique para silenciar)' : 'Sons silenciados (Clique para ativar)'}
          >
            {soundEnabled ? (
              <Volume2 className="h-4 w-4 text-blue-600" />
            ) : (
              <VolumeX className="h-4 w-4 text-slate-400" />
            )}
          </button>
        </div>

      </div>
    </header>
  );
};
