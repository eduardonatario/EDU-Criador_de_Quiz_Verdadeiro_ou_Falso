import React from 'react';
import { 
  X, 
  Plus, 
  FolderOpen, 
  Play, 
  Trash2, 
  Copy, 
  BookMarked, 
  Sparkles,
  Calendar
} from 'lucide-react';
import { QuizGame } from '../types';
import { playClickSound } from '../utils/audio';
import { DEFAULT_QUIZZES } from '../data/defaultQuizzes';

interface GamesLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedQuizzes: QuizGame[];
  activeQuizId: string;
  onSelectQuiz: (quiz: QuizGame) => void;
  onCreateNewQuiz: () => void;
  onDuplicateQuiz: (quiz: QuizGame) => void;
  onDeleteQuiz: (quizId: string) => void;
  onResetTemplates: () => void;
}

export const GamesLibraryModal: React.FC<GamesLibraryModalProps> = ({
  isOpen,
  onClose,
  savedQuizzes,
  activeQuizId,
  onSelectQuiz,
  onCreateNewQuiz,
  onDuplicateQuiz,
  onDeleteQuiz,
  onResetTemplates,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-3xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden my-6 flex flex-col max-h-[88vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <FolderOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-display">
                Biblioteca de Jogos de V/F
              </h3>
              <p className="text-xs text-slate-400">
                Selecione, crie ou gerencie seus quizzes salvos localmente.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action bar */}
        <div className="px-6 py-3 border-b border-slate-800/80 bg-slate-950/30 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-400 font-medium">
            {savedQuizzes.length} {savedQuizzes.length === 1 ? 'jogo salvo' : 'jogos salvos'}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                playClickSound();
                onResetTemplates();
              }}
              className="text-xs text-slate-400 hover:text-slate-200 px-3 py-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 transition-colors"
              title="Restaurar modelos prontos de demonstração"
            >
              Restaurar Modelos Prontos
            </button>

            <button
              onClick={() => {
                playClickSound();
                onCreateNewQuiz();
                onClose();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg shadow transition-all"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Novo Jogo em Branco</span>
            </button>
          </div>
        </div>

        {/* List of Quizzes */}
        <div className="p-6 overflow-y-auto space-y-3">
          {savedQuizzes.map((quiz) => {
            const isActive = quiz.id === activeQuizId;
            return (
              <div
                key={quiz.id}
                className={`rounded-xl border p-4 sm:p-5 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isActive
                    ? 'border-emerald-500/60 bg-emerald-950/15 ring-1 ring-emerald-500/30'
                    : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                }`}
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-bold text-white truncate">
                      {quiz.title}
                    </h4>
                    {isActive && (
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        Ativo
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-1">
                    {quiz.description || 'Sem descrição.'}
                  </p>

                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span>{quiz.questions.length} perguntas</span>
                    <span aria-hidden="true">·</span>
                    <span>Tema: {quiz.themeTopic || 'Geral'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      playClickSound();
                      onSelectQuiz(quiz);
                      onClose();
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-emerald-500 text-slate-950 font-bold'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                    }`}
                  >
                    <span>{isActive ? 'Abrir no Editor' : 'Selecionar'}</span>
                  </button>

                  <button
                    onClick={() => {
                      playClickSound();
                      onDuplicateQuiz(quiz);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    title="Duplicar jogo"
                  >
                    <Copy className="w-4 h-4 text-blue-400" />
                  </button>

                  <button
                    onClick={() => {
                      playClickSound();
                      if (savedQuizzes.length <= 1) {
                        alert('Você precisa ter pelo menos um jogo salvo.');
                        return;
                      }
                      if (window.confirm(`Deseja realmente excluir o jogo "${quiz.title}"?`)) {
                        onDeleteQuiz(quiz.id);
                      }
                    }}
                    disabled={savedQuizzes.length <= 1}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 disabled:opacity-20 transition-colors"
                    title="Excluir jogo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
