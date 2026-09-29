import React, { useState } from 'react';
import { 
  Plus, 
  ArrowUp, 
  ArrowDown, 
  Copy, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  AlertCircle, 
  FileText, 
  Clock, 
  Shuffle, 
  Tag,
  Type,
  Code,
  Download,
  Check,
  ListOrdered,
  Sliders,
  BarChart2,
  Image as ImageIcon,
  Maximize2,
  RotateCcw
} from 'lucide-react';
import { QuizGame, TrueFalseQuestion, QuizTypography } from '../types';
import { playClickSound } from '../utils/audio';
import { generateStandaloneQuizHtml } from '../utils/exportHtml';

interface QuestionListProps {
  quiz: QuizGame;
  onUpdateQuiz: (updated: QuizGame) => void;
  onOpenQuestionModal: (question: TrueFalseQuestion | null, index: number) => void;
  onStartPlaying: () => void;
}

export const QuestionList: React.FC<QuestionListProps> = ({
  quiz,
  onUpdateQuiz,
  onOpenQuestionModal,
}) => {
  const [showTypography, setShowTypography] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const typography: QuizTypography = quiz.typography || {
    questionSize: 'md',
    questionFont: 'sans',
    questionWeight: 'bold',
    buttonSize: 'md',
    buttonFont: 'sans',
    buttonWeight: 'bold',
  };

  const handleCopyEmbedCode = () => {
    playClickSound();
    const html = generateStandaloneQuizHtml(quiz);
    navigator.clipboard.writeText(html);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleDownloadHtml = () => {
    playClickSound();
    const html = generateStandaloneQuizHtml(quiz);
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Verdadeiro_ou_Falso.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleMoveQuestion = (index: number, direction: 'up' | 'down') => {
    playClickSound();
    const newQuestions = [...quiz.questions];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newQuestions.length) return;
    
    const [moved] = newQuestions.splice(index, 1);
    newQuestions.splice(targetIndex, 0, moved);
    onUpdateQuiz({ ...quiz, questions: newQuestions, updatedAt: new Date().toISOString() });
  };

  const handleDuplicateQuestion = (index: number) => {
    playClickSound();
    const q = quiz.questions[index];
    const duplicated: TrueFalseQuestion = {
      ...q,
      id: `q_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      statement: `${q.statement} (Cópia)`,
    };
    const newQuestions = [...quiz.questions];
    newQuestions.splice(index + 1, 0, duplicated);
    onUpdateQuiz({ ...quiz, questions: newQuestions, updatedAt: new Date().toISOString() });
  };

  const handleDeleteQuestion = (index: number) => {
    playClickSound();
    const confirmed = window.confirm(`Deseja realmente excluir a pergunta #${index + 1}?`);
    if (!confirmed) return;
    const newQuestions = quiz.questions.filter((_, i) => i !== index);
    onUpdateQuiz({ ...quiz, questions: newQuestions, updatedAt: new Date().toISOString() });
  };

  const handleTitleChange = (val: string) => {
    onUpdateQuiz({ ...quiz, title: val, updatedAt: new Date().toISOString() });
  };

  const handleDescChange = (val: string) => {
    onUpdateQuiz({ ...quiz, description: val, updatedAt: new Date().toISOString() });
  };

  const handleThemeTopicChange = (val: string) => {
    onUpdateQuiz({ ...quiz, themeTopic: val, updatedAt: new Date().toISOString() });
  };

  const handleTypographyChange = (key: keyof QuizTypography, value: string) => {
    onUpdateQuiz({
      ...quiz,
      typography: {
        ...typography,
        [key]: value,
      },
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      
      {/* Quiz Configuration Panel with White Background */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Coluna da Esquerda: Título expandido, Subtítulo (1 linha) e Tema expandidos para alinhar à direita */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
            {/* Campo Título - ampliado para alinhar à altura da coluna direita */}
            <div className="space-y-1.5 flex-1 flex flex-col">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Título
              </label>
              <textarea
                value={quiz.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Título do Quiz..."
                rows={6}
                className="w-full flex-1 min-h-[170px] bg-white border border-slate-300 rounded-xl px-4 py-3 font-display text-xl sm:text-2xl font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all resize-none leading-relaxed"
              />
            </div>

            {/* Campo Subtítulo - 1 linha, como no tema */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Subtítulo
              </label>
              <input
                type="text"
                value={quiz.description}
                onChange={(e) => handleDescChange(e.target.value)}
                placeholder="Subtítulo ou breve descrição..."
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>

            {/* Campo Tema */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-blue-600" />
                <span>Tema</span>
              </label>
              <input
                type="text"
                value={quiz.themeTopic || ''}
                onChange={(e) => handleThemeTopicChange(e.target.value)}
                placeholder="Ex: Ciência, História, Cinema, Treinamento, Geral..."
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
          </div>

          {/* Coluna da Direita: Opções empilhadas e menu de texto */}
          <div className="lg:col-span-5 bg-slate-50/70 border border-slate-200/80 rounded-2xl p-5 space-y-3.5 flex flex-col justify-between">
            <div className="space-y-3.5">
              {/* 1. Tempo Limite */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1 text-xs flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  <span>Tempo Limite por Questão</span>
                </label>
                <select
                  value={quiz.timeLimitPerQuestion}
                  onChange={(e) =>
                    onUpdateQuiz({
                      ...quiz,
                      timeLimitPerQuestion: Number(e.target.value),
                      updatedAt: new Date().toISOString(),
                    })
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-600 font-medium h-9"
                >
                  <option value={0}>Sem limite de tempo</option>
                  <option value={10}>10 segundos</option>
                  <option value={15}>15 segundos</option>
                  <option value={20}>20 segundos</option>
                  <option value={30}>30 segundos</option>
                </select>
              </div>

              {/* 2. Tamanho do Quiz */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1 text-xs flex items-center gap-1.5">
                  <Maximize2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>Tamanho do Quiz</span>
                </label>
                <select
                  value={quiz.quizSize || 'md'}
                  onChange={(e) =>
                    onUpdateQuiz({
                      ...quiz,
                      quizSize: e.target.value as 'sm' | 'md',
                      updatedAt: new Date().toISOString(),
                    })
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-600 font-medium h-9"
                >
                  <option value="md">Médio (Padrão)</option>
                  <option value="sm">Pequeno (Compacto)</option>
                </select>
              </div>

              {/* Checkboxes empilhadas */}
              <div className="space-y-1.5 pt-1.5 border-t border-slate-200/80 text-xs">
                {/* 3. Embaralhar Perguntas */}
                <label className="flex items-center gap-2.5 cursor-pointer text-slate-800 font-medium p-2 rounded-lg bg-white border border-slate-200/80 hover:bg-slate-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={quiz.shuffleQuestions}
                    onChange={(e) =>
                      onUpdateQuiz({
                        ...quiz,
                        shuffleQuestions: e.target.checked,
                        updatedAt: new Date().toISOString(),
                      })
                    }
                    className="rounded border-slate-300 bg-white text-blue-600 focus:ring-0 w-4 h-4 cursor-pointer"
                  />
                  <span className="flex items-center gap-1.5">
                    <Shuffle className="w-3.5 h-3.5 text-blue-600" />
                    <span>Embaralhar perguntas</span>
                  </span>
                </label>

                {/* 4. Som */}
                <label className="flex items-center gap-2.5 cursor-pointer text-slate-800 font-medium p-2 rounded-lg bg-white border border-slate-200/80 hover:bg-slate-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={quiz.soundEnabled}
                    onChange={(e) =>
                      onUpdateQuiz({
                        ...quiz,
                        soundEnabled: e.target.checked,
                        updatedAt: new Date().toISOString(),
                      })
                    }
                    className="rounded border-slate-300 bg-white text-blue-600 focus:ring-0 w-4 h-4 cursor-pointer"
                  />
                  <span>Efeitos sonoros ativados</span>
                </label>

                {/* 5. Resultado Final */}
                <label className="flex items-center gap-2.5 cursor-pointer text-slate-800 font-medium p-2 rounded-lg bg-white border border-slate-200/80 hover:bg-slate-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={quiz.showFinalResults}
                    onChange={(e) =>
                      onUpdateQuiz({
                        ...quiz,
                        showFinalResults: e.target.checked,
                        updatedAt: new Date().toISOString(),
                      })
                    }
                    className="rounded border-slate-300 bg-white text-blue-600 focus:ring-0 w-4 h-4 cursor-pointer"
                  />
                  <span>Exibir estatística completa ao final</span>
                </label>

                {/* 6. Número da Questão */}
                <label className="flex items-center gap-2.5 cursor-pointer text-slate-800 font-medium p-2 rounded-lg bg-white border border-slate-200/80 hover:bg-slate-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={quiz.showQuestionNumber !== false}
                    onChange={(e) =>
                      onUpdateQuiz({
                        ...quiz,
                        showQuestionNumber: e.target.checked,
                        updatedAt: new Date().toISOString(),
                      })
                    }
                    className="rounded border-slate-300 bg-white text-blue-600 focus:ring-0 w-4 h-4 cursor-pointer"
                  />
                  <span className="flex items-center gap-1.5">
                    <ListOrdered className="w-3.5 h-3.5 text-blue-600" />
                    <span>Exibir "Questão 1 de 5"</span>
                  </span>
                </label>

                {/* 7. Barra de Progresso */}
                <label className="flex items-center gap-2.5 cursor-pointer text-slate-800 font-medium p-2 rounded-lg bg-white border border-slate-200/80 hover:bg-slate-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={quiz.showProgressBar !== false}
                    onChange={(e) =>
                      onUpdateQuiz({
                        ...quiz,
                        showProgressBar: e.target.checked,
                        updatedAt: new Date().toISOString(),
                      })
                    }
                    className="rounded border-slate-300 bg-white text-blue-600 focus:ring-0 w-4 h-4 cursor-pointer"
                  />
                  <span className="flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-blue-600" />
                    <span>Exibir barra de progresso</span>
                  </span>
                </label>

                {/* 8. Status de Acertos */}
                <label className="flex items-center gap-2.5 cursor-pointer text-slate-800 font-medium p-2 rounded-lg bg-white border border-slate-200/80 hover:bg-slate-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={quiz.showLiveScore !== false}
                    onChange={(e) =>
                      onUpdateQuiz({
                        ...quiz,
                        showLiveScore: e.target.checked,
                        updatedAt: new Date().toISOString(),
                      })
                    }
                    className="rounded border-slate-300 bg-white text-blue-600 focus:ring-0 w-4 h-4 cursor-pointer"
                  />
                  <span className="flex items-center gap-1.5">
                    <BarChart2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Exibir estatística simples ao final</span>
                  </span>
                </label>

                {/* 9. Revisão de Respostas */}
                <label className="flex items-center gap-2.5 cursor-pointer text-slate-800 font-medium p-2 rounded-lg bg-white border border-slate-200/80 hover:bg-slate-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={!!quiz.showAnswerReview}
                    onChange={(e) =>
                      onUpdateQuiz({
                        ...quiz,
                        showAnswerReview: e.target.checked,
                        updatedAt: new Date().toISOString(),
                      })
                    }
                    className="rounded border-slate-300 bg-white text-blue-600 focus:ring-0 w-4 h-4 cursor-pointer"
                  />
                  <span className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Exibir "Revisão de Respostas" ao final</span>
                  </span>
                </label>

                {/* Opção Reiniciar */}
                <label className="flex items-center gap-2.5 cursor-pointer text-slate-800 font-medium p-2 rounded-lg bg-white border border-slate-200/80 hover:bg-slate-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={quiz.showRestartOption !== false}
                    onChange={(e) =>
                      onUpdateQuiz({
                        ...quiz,
                        showRestartOption: e.target.checked,
                        updatedAt: new Date().toISOString(),
                      })
                    }
                    className="rounded border-slate-300 bg-white text-blue-600 focus:ring-0 w-4 h-4 cursor-pointer"
                  />
                  <span className="flex items-center gap-1.5">
                    <RotateCcw className="w-3.5 h-3.5 text-blue-600" />
                    <span>Exibir opção "Reiniciar" ao final</span>
                  </span>
                </label>
              </div>
            </div>

            {/* Menu de Configuração de Texto na Coluna da Direita */}
            <div className="pt-2 border-t border-slate-200/80">
              <button
                type="button"
                onClick={() => setShowTypography(!showTypography)}
                className="w-full flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200/80 hover:bg-slate-50 transition-colors text-xs font-semibold text-slate-700 cursor-pointer"
              >
                <span className="flex items-center gap-1.5">
                  <Type className="w-3.5 h-3.5 text-blue-600" />
                  <span>Configuração de Texto</span>
                </span>
                <span className="text-[11px] text-blue-600 font-bold">
                  {showTypography ? 'Ocultar' : 'Exibir'}
                </span>
              </button>

              {showTypography && (
                <div className="mt-2.5 space-y-3 p-3 rounded-xl border border-slate-200 bg-white text-xs">
                  {/* Fonte da Pergunta */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-slate-900 block border-b border-slate-100 pb-1">
                      Fonte da Pergunta
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-slate-600 text-[10px] mb-1">Tamanho</label>
                        <select
                          value={typography.questionSize}
                          onChange={(e) => handleTypographyChange('questionSize', e.target.value)}
                          className="w-full rounded-md border border-slate-300 bg-white p-1.5 text-xs text-slate-800 focus:border-blue-600 focus:outline-none"
                        >
                          <option value="sm">Pequeno (16px)</option>
                          <option value="md">Médio (20px)</option>
                          <option value="lg">Grande (24px)</option>
                          <option value="xl">Muito Grande (28px)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-slate-600 text-[10px] mb-1">Estilo</label>
                        <select
                          value={typography.questionFont}
                          onChange={(e) => handleTypographyChange('questionFont', e.target.value)}
                          className="w-full rounded-md border border-slate-300 bg-white p-1.5 text-xs text-slate-800 focus:border-blue-600 focus:outline-none"
                        >
                          <option value="sans">Sem Serifa</option>
                          <option value="display">Display</option>
                          <option value="serif">Serifada</option>
                          <option value="mono">Monoespaçada</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-slate-600 text-[10px] mb-1">Espessura (Peso)</label>
                      <select
                        value={typography.questionWeight}
                        onChange={(e) => handleTypographyChange('questionWeight', e.target.value)}
                        className="w-full rounded-md border border-slate-300 bg-white p-1.5 text-xs text-slate-800 focus:border-blue-600 focus:outline-none"
                      >
                        <option value="normal">Normal (400)</option>
                        <option value="medium">Médio (500)</option>
                        <option value="semibold">Semi-negrito (600)</option>
                        <option value="bold">Negrito (700)</option>
                      </select>
                    </div>
                  </div>

                  {/* Fonte dos Botões V e F */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <span className="text-[11px] font-bold text-slate-900 block border-b border-slate-100 pb-1">
                      Fonte nos Botões V e F
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-slate-600 text-[10px] mb-1">Tamanho</label>
                        <select
                          value={typography.buttonSize}
                          onChange={(e) => handleTypographyChange('buttonSize', e.target.value)}
                          className="w-full rounded-md border border-slate-300 bg-white p-1.5 text-xs text-slate-800 focus:border-blue-600 focus:outline-none"
                        >
                          <option value="sm">Pequeno (14px)</option>
                          <option value="md">Médio (16px)</option>
                          <option value="lg">Grande (18px)</option>
                          <option value="xl">Muito Grande (22px)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-slate-600 text-[10px] mb-1">Estilo</label>
                        <select
                          value={typography.buttonFont}
                          onChange={(e) => handleTypographyChange('buttonFont', e.target.value)}
                          className="w-full rounded-md border border-slate-300 bg-white p-1.5 text-xs text-slate-800 focus:border-blue-600 focus:outline-none"
                        >
                          <option value="sans">Sem Serifa</option>
                          <option value="display">Display</option>
                          <option value="serif">Serifada</option>
                          <option value="mono">Monoespaçada</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-slate-600 text-[10px] mb-1">Espessura (Peso)</label>
                      <select
                        value={typography.buttonWeight}
                        onChange={(e) => handleTypographyChange('buttonWeight', e.target.value)}
                        className="w-full rounded-md border border-slate-300 bg-white p-1.5 text-xs text-slate-800 focus:border-blue-600 focus:outline-none"
                      >
                        <option value="normal">Normal (400)</option>
                        <option value="semibold">Semi-negrito (600)</option>
                        <option value="bold">Negrito (700)</option>
                        <option value="black">Extra Negrito (900)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* Questions Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-display">
            Perguntas do Jogo ({quiz.questions.length})
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Cada pergunta conta com gabarito oficial, mensagem de parabéns e feedback de erro.
          </p>
        </div>

        <button
          onClick={() => {
            playClickSound();
            onOpenQuestionModal(null, quiz.questions.length);
          }}
          className="flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Criar Nova Pergunta</span>
        </button>
      </div>

      {/* Empty State */}
      {quiz.questions.length === 0 ? (
        <div className="text-center rounded-2xl border border-dashed border-slate-300 bg-white p-12 shadow-xs">
          <FileText className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-slate-800">
            Nenhuma pergunta adicionada ainda
          </h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto mt-1 mb-6">
            Comece elaborando sua primeira pergunta! Defina o enunciado, se é Verdadeiro ou Falso, e as mensagens de parabéns e feedback de erro.
          </p>
          <button
            onClick={() => {
              playClickSound();
              onOpenQuestionModal(null, 0);
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Criar Primeira Pergunta</span>
          </button>
        </div>
      ) : (
        /* Questions List */
        <div className="space-y-4">
          {quiz.questions.map((question, index) => (
            <div
              key={question.id}
              className="group rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-all p-5 sm:p-6 shadow-xs text-slate-900"
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                
                {/* Left: Question info & custom messages */}
                <div className="space-y-3 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-mono font-bold text-slate-500">
                      #{index + 1}
                    </span>
                    
                    <span aria-hidden="true" className="text-slate-300">·</span>

                    {/* Official answer badge: Softer green or red */}
                    <div
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg font-black text-xs ${
                        question.isTrue
                          ? 'bg-emerald-100 text-emerald-950 border border-emerald-300'
                          : 'bg-rose-100 text-rose-950 border border-rose-300'
                      }`}
                    >
                      {question.isTrue ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 stroke-[2.5]" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-rose-700 stroke-[2.5]" />
                      )}
                      <span>Gabarito: {question.isTrue ? 'VERDADEIRO' : 'FALSO'}</span>
                    </div>

                    {/* Badge de Imagem se houver */}
                    {question.imageUrl && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 font-bold text-[11px]">
                        <ImageIcon className="w-3 h-3" />
                        <span>{question.statementType === 'image' ? 'Apenas Imagem' : 'Imagem + Texto'}</span>
                      </span>
                    )}
                  </div>

                  {/* Statement with optional thumbnail */}
                  {question.imageUrl ? (
                    <div className="flex flex-col sm:flex-row items-start gap-3 pt-1">
                      <img
                        src={question.imageUrl}
                        alt="Imagem do enunciado"
                        className="h-20 w-32 object-cover rounded-xl border border-slate-200 shadow-2xs shrink-0 bg-slate-50"
                      />
                      {question.statementType !== 'image' && (
                        <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                          {question.statement}
                        </h3>
                      )}
                      {question.statementType === 'image' && (
                        <span className="text-xs text-slate-400 italic">
                          (Enunciado composto exclusivamente por imagem)
                        </span>
                      )}
                    </div>
                  ) : (
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                      {question.statement}
                    </h3>
                  )}

                  {/* Creator's Feedback Messages Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                    {/* Success Message Card */}
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3 text-xs">
                      <div className="flex items-center gap-1.5 text-emerald-800 font-bold mb-1">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Mensagem de Acerto (Parabéns):</span>
                      </div>
                      <p className="text-slate-800 leading-relaxed font-normal">
                        {question.successMessage}
                      </p>
                    </div>

                    {/* Error Message Card */}
                    <div className="rounded-xl border border-rose-200 bg-rose-50/70 p-3 text-xs">
                      <div className="flex items-center gap-1.5 text-rose-800 font-bold mb-1">
                        <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                        <span>Mensagem de Erro (Feedback):</span>
                      </div>
                      <p className="text-slate-800 leading-relaxed font-normal">
                        {question.errorMessage}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center lg:flex-col gap-1.5 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                  <button
                    onClick={() => {
                      playClickSound();
                      onOpenQuestionModal(question, index);
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-xs transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                    title="Editar pergunta e mensagens"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-white" />
                    <span>Editar</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleMoveQuestion(index, 'up')}
                      disabled={index === 0}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-20 disabled:hover:bg-transparent transition-colors cursor-pointer"
                      title="Mover para cima"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleMoveQuestion(index, 'down')}
                      disabled={index === quiz.questions.length - 1}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-20 disabled:hover:bg-transparent transition-colors cursor-pointer"
                      title="Mover para baixo"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDuplicateQuestion(index)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 transition-colors cursor-pointer"
                      title="Duplicar pergunta"
                    >
                      <Copy className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDeleteQuestion(index)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Excluir pergunta"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ))}

          {/* Add question bottom shortcut */}
          <div className="pt-2 text-center">
            <button
              onClick={() => {
                playClickSound();
                onOpenQuestionModal(null, quiz.questions.length);
              }}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-dashed border-slate-300 bg-white text-slate-700 hover:text-blue-600 hover:border-blue-400 hover:bg-blue-50/30 text-sm font-semibold transition-all cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4 text-blue-600" />
              <span>Adicionar Mais Uma Pergunta</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
