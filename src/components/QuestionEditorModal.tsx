import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  AlertCircle, 
  Save, 
  Tag, 
  BookOpen,
  Image as ImageIcon,
  Upload,
  Trash2,
  Link,
  FileText
} from 'lucide-react';
import { TrueFalseQuestion, StatementType } from '../types';
import { LiveQuestionPreview } from './LiveQuestionPreview';
import { playClickSound } from '../utils/audio';

interface QuestionEditorModalProps {
  isOpen: boolean;
  questionToEdit: TrueFalseQuestion | null;
  questionIndex: number;
  onSave: (question: TrueFalseQuestion) => void;
  onClose: () => void;
}

const SUCCESS_PROMPTS = [
  'Parabéns, resposta perfeita!',
  'Mandou muito bem! Você domina esse assunto.',
  'Excelente raciocínio! Acertou na mosca.',
  'Sensacional! Você acertou em cheio!',
];

const ERROR_PROMPTS = [
  'Ops, não foi dessa vez! A afirmação correta é:',
  'Cuidado, essa é uma pegadinha clássica!',
  'Não desanime! Na verdade o correto é:',
  'Quase lá! Veja por que a resposta é diferente:',
];

export const QuestionEditorModal: React.FC<QuestionEditorModalProps> = ({
  isOpen,
  questionToEdit,
  questionIndex,
  onSave,
  onClose,
}) => {
  const [statement, setStatement] = useState(questionToEdit?.statement || '');
  const [statementType, setStatementType] = useState<StatementType>(
    questionToEdit?.statementType ||
      (questionToEdit?.imageUrl && !questionToEdit.statement
        ? 'image'
        : questionToEdit?.imageUrl
        ? 'both'
        : 'text')
  );
  const [imageUrl, setImageUrl] = useState(questionToEdit?.imageUrl || '');
  const [isTrue, setIsTrue] = useState<boolean>(questionToEdit?.isTrue ?? true);
  const [successMessage, setSuccessMessage] = useState(
    questionToEdit?.successMessage || ''
  );
  const [errorMessage, setErrorMessage] = useState(
    questionToEdit?.errorMessage || ''
  );
  const [category, setCategory] = useState(questionToEdit?.category || '');
  const [explanationDetail, setExplanationDetail] = useState(
    questionToEdit?.explanationDetail || ''
  );
  const [showValidationErrors, setShowValidationErrors] = useState(false);

  if (!isOpen) return null;

  const isStatementValid =
    statementType === 'image'
      ? imageUrl.trim().length > 0
      : statementType === 'both'
      ? statement.trim().length > 0 && imageUrl.trim().length > 0
      : statement.trim().length > 0;

  const isFormValid =
    isStatementValid &&
    successMessage.trim().length > 0 &&
    errorMessage.trim().length > 0;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('A imagem é muito grande. Escolha uma imagem de até 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const dataUrl = uploadEvent.target?.result as string;
      if (dataUrl) {
        setImageUrl(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
      setShowValidationErrors(true);
      return;
    }

    const savedQuestion: TrueFalseQuestion = {
      id: questionToEdit ? questionToEdit.id : `q_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      statement: statementType === 'image' ? (statement.trim() || 'Identifique se a imagem é Verdadeira ou Falsa.') : statement.trim(),
      statementType,
      imageUrl: (statementType === 'image' || statementType === 'both') ? imageUrl.trim() : undefined,
      isTrue,
      successMessage: successMessage.trim(),
      errorMessage: errorMessage.trim(),
      category: category.trim() || undefined,
      explanationDetail: explanationDetail.trim() || undefined,
    };

    playClickSound();
    onSave(savedQuestion);
  };

  const handleQuickSuccess = (prefix: string) => {
    playClickSound();
    if (!successMessage.trim()) {
      setSuccessMessage(prefix + ' ');
    } else {
      setSuccessMessage(prefix + ' ' + successMessage.trim());
    }
  };

  const handleQuickError = (prefix: string) => {
    playClickSound();
    if (!errorMessage.trim()) {
      setErrorMessage(prefix + ' ');
    } else {
      setErrorMessage(prefix + ' ' + errorMessage.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden my-6 max-h-[92vh] flex flex-col text-slate-900"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-headline"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/80 shrink-0">
          <div>
            <h3 id="modal-headline" className="text-lg font-bold text-slate-900 font-display">
              {questionToEdit ? `Editar Pergunta #${questionIndex + 1}` : `Nova Pergunta #${questionIndex + 1}`}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Defina a afirmação, o gabarito oficial, e as mensagens personalizadas de acerto e erro.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          <form id="question-form" onSubmit={handleSubmit} className="space-y-6">
            
            {/* 1. Formato e Conteúdo do Enunciado */}
            <div className="space-y-4 p-4 rounded-2xl border border-slate-200 bg-slate-50/60">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-xs font-bold">1</span>
                  <span>Formato do Enunciado</span>
                  <span className="text-rose-500">*</span>
                </label>

                {/* Seletor com 3 opções */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setStatementType('text');
                    }}
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      statementType === 'text'
                        ? 'border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-500/20 shadow-xs'
                        : 'border-slate-300 bg-white text-slate-600 hover:border-slate-400 hover:text-slate-900'
                    }`}
                  >
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span>Apenas Texto</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setStatementType('image');
                    }}
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      statementType === 'image'
                        ? 'border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-500/20 shadow-xs'
                        : 'border-slate-300 bg-white text-slate-600 hover:border-slate-400 hover:text-slate-900'
                    }`}
                  >
                    <ImageIcon className="w-4 h-4 text-blue-600" />
                    <span>Apenas Imagem</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setStatementType('both');
                    }}
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      statementType === 'both'
                        ? 'border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-500/20 shadow-xs'
                        : 'border-slate-300 bg-white text-slate-600 hover:border-slate-400 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-0.5">
                      <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
                      <span>+</span>
                      <FileText className="w-3.5 h-3.5 text-blue-600" />
                    </div>
                    <span>Imagem + Texto</span>
                  </button>
                </div>
              </div>

              {/* Seletor/Upload de Imagem (quando tipo for 'image' ou 'both') */}
              {(statementType === 'image' || statementType === 'both') && (
                <div className="space-y-3 p-4 rounded-xl border border-blue-200 bg-white shadow-2xs">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-blue-600" />
                      <span>Imagem do Enunciado (645x345)</span>
                      <span className="text-rose-500">*</span>
                    </label>
                    {imageUrl && (
                      <button
                        type="button"
                        onClick={() => setImageUrl('')}
                        className="text-xs text-rose-600 hover:text-rose-800 flex items-center gap-1 cursor-pointer font-semibold"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Remover imagem</span>
                      </button>
                    )}
                  </div>

                  {imageUrl ? (
                    <div className="relative rounded-xl border border-slate-200 bg-slate-50 p-2 flex items-center justify-center max-h-56 overflow-hidden">
                      <img
                        src={imageUrl}
                        alt="Prévia do enunciado"
                        className="max-h-52 w-auto max-w-full object-contain rounded-lg"
                      />
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <label className="flex flex-col items-center justify-center gap-2 p-5 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50/70 hover:bg-blue-50/50 hover:border-blue-300 cursor-pointer transition-colors text-center">
                        <Upload className="w-6 h-6 text-blue-600" />
                        <span className="text-xs font-bold text-slate-700">Clique para selecionar imagem do seu dispositivo</span>
                        <span className="text-[11px] text-slate-400">Suporta PNG, JPG, WEBP, GIF ou SVG</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageUpload}
                        />
                      </label>

                      <div className="relative flex items-center">
                        <Link className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="url"
                          placeholder="Ou cole a URL da imagem (https://...)"
                          value={imageUrl}
                          onChange={(e) => setImageUrl(e.target.value)}
                          className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-slate-300 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600"
                        />
                      </div>
                    </div>
                  )}

                  {showValidationErrors && !imageUrl.trim() && (
                    <p className="text-xs text-rose-500 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3.5 h-3.5" />
                      Por favor, escolha uma imagem ou insira a URL da imagem.
                    </p>
                  )}
                </div>
              )}

              {/* Caixa de Texto do Enunciado (visível se tipo for 'text' ou 'both') */}
              {statementType !== 'image' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-blue-600" />
                      <span>{statementType === 'both' ? 'Texto Complementar do Enunciado' : 'Texto da Pergunta ou Afirmação'}</span>
                      <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-xs text-slate-400">
                      {statement.length} caracteres
                    </span>
                  </div>
                  <textarea
                    value={statement}
                    onChange={(e) => setStatement(e.target.value)}
                    rows={3}
                    placeholder={statementType === 'both' ? "Ex: Observe a imagem acima. A afirmação a seguir é verdadeira?" : "Exemplo: Os polvos possuem três corações e o sangue deles é azul."}
                    className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                      showValidationErrors && !statement.trim()
                        ? 'border-rose-500 ring-rose-500/20'
                        : 'border-slate-300 focus:border-blue-600 focus:ring-blue-100'
                    }`}
                  />
                  {showValidationErrors && !statement.trim() && (
                    <p className="text-xs text-rose-500 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3.5 h-3.5" />
                      Por favor, escreva a pergunta ou afirmação para o jogo.
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* 2. Gabarito Oficial (Verdadeiro ou Falso) */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-xs font-bold">2</span>
                <span>Gabarito Oficial: Qual é a resposta correta?</span>
                <span className="text-rose-500">*</span>
              </label>
              
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    setIsTrue(true);
                  }}
                  className={`flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl border-2 font-black text-sm transition-all cursor-pointer ${
                    isTrue
                      ? 'border-emerald-600 bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:text-slate-900 hover:border-slate-300'
                  }`}
                >
                  <CheckCircle2 className={`w-5 h-5 stroke-[3] ${isTrue ? 'text-black' : 'text-slate-400'}`} />
                  <span>A resposta correta é VERDADEIRO</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    setIsTrue(false);
                  }}
                  className={`flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl border-2 font-black text-sm transition-all cursor-pointer ${
                    !isTrue
                      ? 'border-red-600 bg-red-500 text-black shadow-md shadow-red-500/20'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:text-slate-900 hover:border-slate-300'
                  }`}
                >
                  <XCircle className={`w-5 h-5 stroke-[3] ${!isTrue ? 'text-black' : 'text-slate-400'}`} />
                  <span>A resposta correta é FALSO</span>
                </button>
              </div>
            </div>

            {/* 3. Mensagem de Acerto (Mensagem de Parabéns) */}
            <div className="space-y-2 rounded-xl border border-emerald-200 bg-emerald-50/60 p-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-emerald-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>Mensagem de Acerto (Parabéns do Criador)</span>
                  <span className="text-rose-500">*</span>
                </label>
                <span className="text-xs text-slate-500">Exibida quando o jogador acertar</span>
              </div>
              <p className="text-xs text-slate-600">
                Elabore uma mensagem comemorativa e motivadora, elogiando o acerto e reforçando o conhecimento.
              </p>
              <textarea
                value={successMessage}
                onChange={(e) => setSuccessMessage(e.target.value)}
                rows={2}
                placeholder="Exemplo: Parabéns, acertou na mosca! Os polvos têm três corações e seu sangue é azul com cobre."
                className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                  showValidationErrors && !successMessage.trim()
                    ? 'border-rose-500 ring-rose-500/20'
                    : 'border-emerald-300 focus:border-emerald-500 focus:ring-emerald-100'
                }`}
              />
              
              {/* Quick suggestions */}
              <div className="pt-1">
                <span className="text-[11px] text-slate-600 font-medium block mb-1.5">Sugestões rápidas de abertura:</span>
                <div className="flex flex-wrap gap-1.5">
                  {SUCCESS_PROMPTS.map((prompt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleQuickSuccess(prompt)}
                      className="text-[11px] px-2.5 py-1 rounded-md bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-100 transition-colors cursor-pointer font-medium"
                    >
                      + {prompt}
                    </button>
                  ))}
                </div>
              </div>

              {showValidationErrors && !successMessage.trim() && (
                <p className="text-xs text-rose-500 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Elabore a mensagem de parabéns para quando o jogador acertar.
                </p>
              )}
            </div>

            {/* 4. Mensagem de Erro (Feedback Explicativo) */}
            <div className="space-y-2 rounded-xl border border-rose-200 bg-rose-50/60 p-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-rose-900 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  <span>Mensagem de Erro (Feedback do Criador)</span>
                  <span className="text-rose-500">*</span>
                </label>
                <span className="text-xs text-slate-500">Exibida quando o jogador errar</span>
              </div>
              <p className="text-xs text-slate-600">
                Elabore um feedback construtivo explicando por que a afirmação era {isTrue ? 'Verdadeira' : 'Falsa'} e tirando a dúvida.
              </p>
              <textarea
                value={errorMessage}
                onChange={(e) => setErrorMessage(e.target.value)}
                rows={2}
                placeholder={
                  isTrue
                    ? 'Exemplo: Ops, na verdade é VERDADEIRO! Os polvos têm 3 corações funcionais e sangue azul...'
                    : 'Exemplo: Não foi dessa vez! A afirmação é FALSA porque...'
                }
                className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                  showValidationErrors && !errorMessage.trim()
                    ? 'border-rose-500 ring-rose-500/20'
                    : 'border-rose-300 focus:border-rose-500 focus:ring-rose-100'
                }`}
              />

              {/* Quick suggestions */}
              <div className="pt-1">
                <span className="text-[11px] text-slate-600 font-medium block mb-1.5">Sugestões rápidas de abertura:</span>
                <div className="flex flex-wrap gap-1.5">
                  {ERROR_PROMPTS.map((prompt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleQuickError(prompt)}
                      className="text-[11px] px-2.5 py-1 rounded-md bg-white border border-rose-300 text-rose-800 hover:bg-rose-100 transition-colors cursor-pointer font-medium"
                    >
                      + {prompt}
                    </button>
                  ))}
                </div>
              </div>

              {showValidationErrors && !errorMessage.trim() && (
                <p className="text-xs text-rose-500 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Elabore o feedback de erro explicando a resposta para o jogador.
                </p>
              )}
            </div>

            {/* 5. Categoria & Detalhe Adicional (Opcionais) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-blue-600" />
                  <span>Categoria / Tópico (Opcional)</span>
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Ex: Biologia, História, Cinema..."
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                  <span>Curiosidade ou Fonte Extra (Opcional)</span>
                </label>
                <input
                  type="text"
                  value={explanationDetail}
                  onChange={(e) => setExplanationDetail(e.target.value)}
                  placeholder="Ex: Fonte: Revista Científica 2026"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:outline-none"
                />
              </div>
            </div>

            {/* Live Preview Component */}
            <LiveQuestionPreview
              question={{
                statement,
                statementType,
                imageUrl,
                isTrue,
                successMessage,
                errorMessage,
                category,
              }}
            />

          </form>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50 shrink-0">
          <button
            type="button"
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
          >
            Cancelar
          </button>

          <button
            type="submit"
            form="question-form"
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Salvar Pergunta</span>
          </button>
        </div>

      </div>
    </div>
  );
};
