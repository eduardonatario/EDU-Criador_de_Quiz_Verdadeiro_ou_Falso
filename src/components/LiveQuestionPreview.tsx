import React, { useState } from 'react';
import { CheckCircle2, XCircle, Sparkles, AlertCircle, Eye } from 'lucide-react';
import { TrueFalseQuestion } from '../types';

interface LiveQuestionPreviewProps {
  question: Partial<TrueFalseQuestion>;
}

export const LiveQuestionPreview: React.FC<LiveQuestionPreviewProps> = ({ question }) => {
  const [previewState, setPreviewState] = useState<'idle' | 'correct' | 'wrong'>('idle');

  const statement = question.statement?.trim() || 'Sua pergunta ou afirmação aparecerá aqui...';
  const statementType = question.statementType || (question.imageUrl && !question.statement ? 'image' : question.imageUrl ? 'both' : 'text');
  const imageUrl = question.imageUrl;
  const isTrue = question.isTrue ?? true;
  const successMsg = question.successMessage?.trim() || 'Mensagem de parabéns elaborada pelo criador para quem acertar.';
  const errorMsg = question.errorMessage?.trim() || 'Feedback explicativo elaborado pelo criador para quem errar.';
  const category = question.category?.trim();

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-inner">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Prévia em Tempo Real para o Jogador
          </span>
        </div>
        <div className="flex items-center gap-1 bg-slate-950/70 p-1 rounded-lg border border-slate-800">
          <button
            type="button"
            onClick={() => setPreviewState('idle')}
            className={`px-2 py-0.5 text-xs rounded transition-colors ${
              previewState === 'idle' ? 'bg-slate-800 text-white font-medium' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            Pergunta
          </button>
          <button
            type="button"
            onClick={() => setPreviewState('correct')}
            className={`px-2 py-0.5 text-xs rounded transition-colors ${
              previewState === 'correct' ? 'bg-emerald-950 text-emerald-300 font-medium border border-emerald-700/50' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            Acerto
          </button>
          <button
            type="button"
            onClick={() => setPreviewState('wrong')}
            className={`px-2 py-0.5 text-xs rounded transition-colors ${
              previewState === 'wrong' ? 'bg-rose-950 text-rose-300 font-medium border border-rose-700/50' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            Erro
          </button>
        </div>
      </div>

      {/* Mock Player Card */}
      <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 transition-all text-slate-900 shadow-xs">
        <div className="text-xs text-slate-500 mb-2 font-medium">
          <span>Gabarito: <strong className={isTrue ? 'text-emerald-700' : 'text-rose-700'}>{isTrue ? 'Verdadeiro' : 'Falso'}</strong></span>
        </div>

        {/* Statement area: Image Only, Image + Text, or Text Only */}
        <div className="mb-5 space-y-3">
          {(statementType === 'image' || statementType === 'both') && imageUrl && (
            <div className="w-full flex items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-slate-50 max-h-56">
              <img
                src={imageUrl}
                alt="Enunciado"
                className="max-h-52 w-auto max-w-full object-contain rounded-lg"
              />
            </div>
          )}

          {statementType !== 'image' && (
            <h4 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
              {statement}
            </h4>
          )}
        </div>

        {/* Buttons Mockup: Softer and less saturated */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div
            className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl font-bold text-sm transition-all bg-emerald-100/90 text-slate-900 border-2 border-emerald-300 ${
              previewState === 'correct' ? 'ring-2 ring-emerald-300 shadow-xs' : ''
            }`}
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-800 stroke-[2.5]" />
            <span>VERDADEIRO</span>
          </div>

          <div
            className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl font-bold text-sm transition-all bg-rose-100/90 text-slate-900 border-2 border-rose-300 ${
              previewState === 'wrong' ? 'ring-2 ring-rose-300 shadow-xs' : ''
            }`}
          >
            <XCircle className="w-5 h-5 text-rose-800 stroke-[2.5]" />
            <span>FALSO</span>
          </div>
        </div>

        {/* Dynamic Simulated Feedback */}
        {previewState === 'correct' && (
          <div className="rounded-xl border-2 border-emerald-300 bg-emerald-50 p-4 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 mb-1.5 text-emerald-900 font-bold text-sm">
              <Sparkles className="w-4 h-4 text-emerald-700" />
              <span>Mensagem de Acerto (Parabéns):</span>
            </div>
            <p className="text-sm text-slate-800 leading-relaxed font-normal">
              {successMsg}
            </p>
          </div>
        )}

        {previewState === 'wrong' && (
          <div className="rounded-xl border-2 border-rose-300 bg-rose-50 p-4 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 mb-1.5 text-rose-900 font-bold text-sm">
              <AlertCircle className="w-4 h-4 text-rose-700" />
              <span>Mensagem de Erro (Feedback Explicativo):</span>
            </div>
            <p className="text-sm text-slate-800 leading-relaxed font-normal">
              {errorMsg}
            </p>
          </div>
        )}

        {previewState === 'idle' && (
          <div className="text-center py-2 text-xs text-slate-500 italic">
            Clique em "Acerto" ou "Erro" acima para testar como sua mensagem aparecerá.
          </div>
        )}
      </div>
    </div>
  );
};
