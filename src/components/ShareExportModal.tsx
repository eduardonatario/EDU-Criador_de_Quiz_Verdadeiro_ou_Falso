import React, { useState } from 'react';
import { 
  X, 
  Share2, 
  Copy, 
  Check, 
  Download, 
  Upload, 
  Printer, 
  Link as LinkIcon, 
  FileCode,
  FileCheck
} from 'lucide-react';
import { QuizGame } from '../types';
import { playClickSound } from '../utils/audio';

interface ShareExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  quiz: QuizGame;
  onImportQuiz: (quiz: QuizGame) => void;
}

export const ShareExportModal: React.FC<ShareExportModalProps> = ({
  isOpen,
  onClose,
  quiz,
  onImportQuiz,
}) => {
  const [activeTab, setActiveTab] = useState<'link' | 'json' | 'print'>('link');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);
  const [jsonInput, setJsonInput] = useState('');
  const [importError, setImportError] = useState('');

  if (!isOpen) return null;

  // Generate shareable link
  const getShareableUrl = () => {
    try {
      const serialized = encodeURIComponent(JSON.stringify(quiz));
      const b64 = btoa(unescape(serialized));
      const base = window.location.origin + window.location.pathname;
      return `${base}#quiz_data=${b64}`;
    } catch {
      return window.location.href;
    }
  };

  const handleCopyLink = () => {
    playClickSound();
    const url = getShareableUrl();
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyJson = () => {
    playClickSound();
    const data = JSON.stringify(quiz, null, 2);
    navigator.clipboard.writeText(data);
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2500);
  };

  const handleDownloadJson = () => {
    playClickSound();
    const data = JSON.stringify(quiz, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${quiz.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_quiz.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJson = () => {
    playClickSound();
    setImportError('');
    try {
      const parsed = JSON.parse(jsonInput);
      if (!parsed.title || !Array.isArray(parsed.questions)) {
        throw new Error('Formato inválido. O JSON precisa ter "title" e um array "questions".');
      }
      onImportQuiz(parsed);
      onClose();
    } catch (err: unknown) {
      setImportError((err as Error).message || 'JSON inválido.');
    }
  };

  const handlePrint = () => {
    playClickSound();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden my-6 flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60 shrink-0">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-indigo-400" />
            <h3 className="text-lg font-bold text-white font-display">
              Compartilhar & Exportar Jogo
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

        {/* Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-6 shrink-0 gap-2">
          <button
            onClick={() => {
              playClickSound();
              setActiveTab('link');
            }}
            className={`py-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'link'
                ? 'border-emerald-400 text-emerald-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>Link Direto</span>
          </button>

          <button
            onClick={() => {
              playClickSound();
              setActiveTab('json');
            }}
            className={`py-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'json'
                ? 'border-emerald-400 text-emerald-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Exportar / Importar JSON</span>
          </button>

          <button
            onClick={() => {
              playClickSound();
              setActiveTab('print');
            }}
            className={`py-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'print'
                ? 'border-emerald-400 text-emerald-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Versão para Impressão</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {activeTab === 'link' && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white">
                  Link de Jogo Instantâneo
                </h4>
                <p className="text-xs text-slate-400">
                  Compartilhe este link com amigos, alunos ou colegas. Ao abrir, o jogo carregará diretamente com todas as suas perguntas, mensagens de acerto e de erro!
                </p>
              </div>

              <div className="flex items-center gap-2 p-2 rounded-xl border border-slate-800 bg-slate-950">
                <input
                  type="text"
                  readOnly
                  value={getShareableUrl()}
                  className="w-full bg-transparent text-xs text-slate-300 px-2 font-mono truncate focus:outline-none"
                />
                <button
                  onClick={handleCopyLink}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shrink-0 transition-colors"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar Link</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-4 rounded-xl border border-emerald-950 bg-emerald-950/20 text-xs text-emerald-300">
                💡 <strong>Dica:</strong> Todos os dados do jogo ficam embutidos no próprio link de forma segura, permitindo jogar mesmo sem ter conta criada.
              </div>
            </div>
          )}

          {activeTab === 'json' && (
            <div className="space-y-6">
              {/* Export */}
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-white">Exportar Jogo Atual</h4>
                <div className="flex gap-2">
                  <button
                    onClick={handleCopyJson}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-800 bg-slate-950 hover:bg-slate-800 text-xs font-semibold text-slate-200 transition-colors"
                  >
                    {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedJson ? 'Copiado para Área de Transferência' : 'Copiar JSON'}</span>
                  </button>
                  <button
                    onClick={handleDownloadJson}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-800 bg-slate-950 hover:bg-slate-800 text-xs font-semibold text-slate-200 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Baixar Arquivo .json</span>
                  </button>
                </div>
              </div>

              <div className="border-t border-slate-800 pt-4 space-y-2">
                <h4 className="text-sm font-bold text-white">Importar Jogo de um JSON</h4>
                <p className="text-xs text-slate-400">
                  Cole o código JSON de outro jogo para carregá-lo no editor:
                </p>
                <textarea
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  rows={4}
                  placeholder='Cole o JSON aqui: { "title": "Meu Quiz", "questions": [...] }'
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 font-mono text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                />
                {importError && (
                  <p className="text-xs text-rose-400 font-medium">{importError}</p>
                )}
                <button
                  onClick={handleImportJson}
                  disabled={!jsonInput.trim()}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:opacity-30 text-slate-950 font-bold text-xs transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Importar e Abrir no Editor</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'print' && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white">
                  Imprimir Folha de Questões
                </h4>
                <p className="text-xs text-slate-400">
                  Gere uma versão limpa para imprimir em papel, ideal para provas, gincanas escolares ou atividades presenciais.
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 max-h-60 overflow-y-auto space-y-3 text-xs">
                <div className="border-b border-slate-800 pb-2">
                  <h3 className="font-bold text-white text-sm">{quiz.title}</h3>
                  <p className="text-slate-400">{quiz.description}</p>
                </div>
                {quiz.questions.map((q, idx) => (
                  <div key={q.id} className="space-y-1 border-b border-slate-800/60 pb-2">
                    <p className="font-semibold text-slate-200">
                      {idx + 1}. [ &nbsp; ] V &nbsp;&nbsp; [ &nbsp; ] F &nbsp;— {q.statement}
                    </p>
                    <p className="text-[11px] text-slate-500 italic">
                      Gabarito: {q.isTrue ? 'Verdadeiro' : 'Falso'} · Explicação: {q.errorMessage}
                    </p>
                  </div>
                ))}
              </div>

              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-slate-950 font-bold text-xs transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir Folha com o Navegador</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
