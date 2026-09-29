import React, { useEffect } from 'react';
import { 
  Trophy, 
  RotateCcw, 
  Edit3, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  AlertCircle, 
  Share2, 
  Flame,
  Award
} from 'lucide-react';
import { QuizGame, PlayerAnswer } from '../types';
import { playClickSound, playFanfareSound } from '../utils/audio';
import { launchConfetti } from '../utils/confetti';

interface QuizResultsProps {
  quiz: QuizGame;
  answers: PlayerAnswer[];
  onPlayAgain: (onlyWrong?: boolean) => void;
  onBackToEditor: () => void;
  onOpenShareModal: () => void;
}

export const QuizResults: React.FC<QuizResultsProps> = ({
  quiz,
  answers,
  onPlayAgain,
  onBackToEditor,
  onOpenShareModal,
}) => {
  const total = answers.length;
  const correct = answers.filter((a) => a.isCorrect).length;
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
  const wrongAnswers = answers.filter((a) => !a.isCorrect);

  useEffect(() => {
    if (percentage >= 60) {
      playFanfareSound();
      launchConfetti();
    }
  }, [percentage]);

  const getEvaluation = () => {
    if (percentage === 100) {
      return {
        title: 'Pontuação Perfeita!',
        desc: 'Você acertou todas as perguntas! Um verdadeiro mestre neste assunto.',
      };
    }
    if (percentage >= 80) {
      return {
        title: 'Excelente Desempenho!',
        desc: 'Você demonstrou grande domínio sobre as afirmações.',
      };
    }
    if (percentage >= 50) {
      return {
        title: 'Bom Trabalho!',
        desc: 'Você teve um bom resultado, mas ainda há alguns conceitos para revisar.',
      };
    }
    return {
      title: 'Continue Praticando!',
      desc: 'Que tal revisar as mensagens explicativas do criador e tentar novamente?',
    };
  };

  const evaluation = getEvaluation();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      
      {/* Score Hero Card (White Background) */}
      <div className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-10 text-center shadow-sm text-slate-900 relative overflow-hidden">
        
        <div className="relative space-y-4">
          
          {/* Big Score Numbers */}
          <div className="pt-4 flex items-center justify-center gap-6">
            <div className="text-center">
              <span className="font-display text-4xl sm:text-5xl font-black text-emerald-600 tracking-tight">
                {percentage}%
              </span>
              <span className="block text-xs uppercase tracking-wider text-slate-500 mt-1 font-bold">
                Aproveitamento
              </span>
            </div>

            <div className="h-12 w-px bg-slate-200" />

            <div className="text-center">
              <span className="font-display text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
                {correct}<span className="text-slate-400 text-2xl font-normal">/{total}</span>
              </span>
              <span className="block text-xs uppercase tracking-wider text-slate-500 mt-1 font-bold">
                Acertos
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => {
                playClickSound();
                onPlayAgain(false);
              }}
              className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-500 text-white shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Jogar Novamente</span>
            </button>

            {wrongAnswers.length > 0 && (
              <button
                onClick={() => {
                  playClickSound();
                  onPlayAgain(true);
                }}
                className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm bg-rose-500 hover:bg-rose-400 text-white shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <Flame className="w-4 h-4" />
                <span>tentar novamente as que errei</span>
              </button>
            )}

            <button
              onClick={() => {
                playClickSound();
                onBackToEditor();
              }}
              className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm border border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors cursor-pointer"
            >
              <Edit3 className="w-4 h-4 text-blue-600" />
              <span>Voltar ao Editor</span>
            </button>
          </div>
        </div>
      </div>

        {/* Review Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-display">
              Revisão de Respostas
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-500">
            {correct} acertos · {wrongAnswers.length} erros
          </span>
        </div>

        <div className="space-y-4">
          {answers.map((answer, index) => {
            const { question, userChoice, isCorrect } = answer;
            return (
              <div
                key={question.id}
                className={`rounded-2xl border p-5 sm:p-6 transition-all bg-white text-slate-900 ${
                  isCorrect
                    ? 'border-emerald-200 shadow-sm'
                    : 'border-rose-200 shadow-sm'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-500">
                      #{index + 1}
                    </span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    
                    {/* Badge: Soft Green or Soft Red */}
                    <div
                      className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-lg text-xs font-bold ${
                        isCorrect
                          ? 'bg-emerald-100 text-emerald-950 border border-emerald-300'
                          : 'bg-rose-100 text-rose-950 border border-rose-300'
                      }`}
                    >
                      {isCorrect ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 stroke-[2.5]" />
                          <span>Acertou</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5 text-rose-700 stroke-[2.5]" />
                          <span>Errou</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {question.imageUrl && (
                  <div className="mb-3 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 max-h-48 flex items-center justify-center p-1.5">
                    <img
                      src={question.imageUrl}
                      alt="Imagem da pergunta"
                      className="max-h-44 w-auto object-contain rounded-lg"
                    />
                  </div>
                )}

                {question.statementType !== 'image' && (
                  <h4 className="text-base font-bold text-slate-900 mb-4">
                    {question.statement}
                  </h4>
                )}

                {/* Feedback box */}
                {isCorrect ? (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3.5 text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-900 font-bold mb-1">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Parabéns:</span>
                    </div>
                    <p className="text-slate-800 leading-relaxed font-normal">
                      {question.successMessage}
                    </p>
                  </div>
                ) : (
                  <div className="rounded-xl border border-rose-200 bg-rose-50/60 p-3.5 text-xs">
                    <div className="flex items-center gap-1.5 text-rose-900 font-bold mb-1">
                      <AlertCircle className="w-3.5 h-3.5 text-rose-700" />
                      <span>Explicação:</span>
                    </div>
                    <p className="text-slate-800 leading-relaxed font-normal">
                      {question.errorMessage}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
