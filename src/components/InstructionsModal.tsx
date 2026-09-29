import React from 'react';
import { X, Lightbulb, Sparkles, AlertCircle, CheckCircle2, BookOpen } from 'lucide-react';
import { playClickSound } from '../utils/audio';

interface InstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstructionsModal: React.FC<InstructionsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden my-6 flex flex-col max-h-[88vh]"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60 shrink-0">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-bold text-white font-display">
              Como Elaborar um Excelente Jogo de V/F
            </h3>
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

        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-300">
          
          <div className="space-y-2">
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>1. A Pergunta ou Afirmação</span>
            </h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              Escreva afirmações claras, diretas e sem ambiguidades. Boas afirmações desafiam mitos comuns, ensinam curiosidades científicas ou cobrem conteúdos curriculares.
            </p>
          </div>

          <div className="space-y-2 rounded-xl border border-emerald-900/40 bg-emerald-950/20 p-4">
            <h4 className="text-base font-bold text-emerald-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>2. Mensagem de Acerto (Parabéns)</span>
            </h4>
            <p className="text-emerald-200/90 text-xs leading-relaxed">
              Quando o jogador acertar, celebre o conhecimento dele! Aproveite a mensagem de parabéns para aprofundar um detalhe fascinante ou contextualizar o acerto.
            </p>
            <div className="p-2.5 rounded-lg bg-emerald-950/50 border border-emerald-800/40 text-[11px] text-emerald-300 font-mono">
              "Sensacional! Você acertou! O Sol é uma anã amarela e sua temperatura superficial é de cerca de 5.500 °C."
            </div>
          </div>

          <div className="space-y-2 rounded-xl border border-rose-900/40 bg-rose-950/20 p-4">
            <h4 className="text-base font-bold text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400" />
              <span>3. Mensagem de Erro (Feedback Explicativo)</span>
            </h4>
            <p className="text-rose-200/90 text-xs leading-relaxed">
              O erro é a melhor oportunidade de aprendizado. Evite apenas dizer "Você errou". Explique com gentileza <em>por que</em> a afirmação era Verdadeira ou Falsa, desfazendo a confusão.
            </p>
            <div className="p-2.5 rounded-lg bg-rose-950/50 border border-rose-800/40 text-[11px] text-rose-300 font-mono">
              "Ops, na verdade é FALSO! O mito de que usamos 10% do cérebro já foi refutado pela neurociência moderna."
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>4. Compartilhamento e Prática</span>
            </h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              Use o botão "Compartilhar" para enviar o link direto do seu jogo pronto para outras pessoas jogarem no celular ou computador, ou use a versão para impressão em sala de aula!
            </p>
          </div>

        </div>

        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/60 flex justify-end shrink-0">
          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="px-4 py-2 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors"
          >
            Entendido, vamos criar!
          </button>
        </div>
      </div>
    </div>
  );
};
