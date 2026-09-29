import React, { useState, useEffect, useCallback } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  ArrowRight,
  Clock,
  RotateCcw
} from 'lucide-react';
import { QuizGame, TrueFalseQuestion, PlayerAnswer } from '../types';
import { playClickSound, playCorrectSound, playWrongSound } from '../utils/audio';

interface QuizPlayerProps {
  quiz: QuizGame;
  onFinishQuiz: (answers: PlayerAnswer[]) => void;
  onExit: () => void;
  filterQuestions?: TrueFalseQuestion[]; // For retrying only wrong questions
}

export const QuizPlayer: React.FC<QuizPlayerProps> = ({
  quiz,
  onFinishQuiz,
  onExit,
  filterQuestions,
}) => {
  const [questions, setQuestions] = useState<TrueFalseQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<PlayerAnswer[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState<boolean | null>(null);
  const [timeLeft, setTimeLeft] = useState(quiz.timeLimitPerQuestion || 0);

  // Initialize questions
  useEffect(() => {
    let pool = filterQuestions && filterQuestions.length > 0 ? [...filterQuestions] : [...quiz.questions];
    if (quiz.shuffleQuestions && !filterQuestions) {
      pool = pool.sort(() => Math.random() - 0.5);
    }
    setQuestions(pool);
    setCurrentIndex(0);
    setAnswers([]);
    setRevealed(false);
    setSelectedChoice(null);
  }, [quiz, filterQuestions]);

  const currentQuestion = questions[currentIndex];

  const handleAnswer = useCallback(
    (choice: boolean | null) => {
      if (revealed || !currentQuestion) return;

      const isCorrect = choice !== null && choice === currentQuestion.isTrue;
      setSelectedChoice(choice);
      setRevealed(true);

      if (quiz.soundEnabled) {
        if (isCorrect) {
          playCorrectSound();
        } else {
          playWrongSound();
        }
      }

      const record: PlayerAnswer = {
        questionId: currentQuestion.id,
        question: currentQuestion,
        userChoice: choice ?? false,
        isCorrect,
        answeredAt: new Date().toISOString(),
      };

      setAnswers((prev) => [...prev, record]);
    },
    [revealed, currentQuestion, quiz.soundEnabled]
  );

  // Timer countdown per question
  useEffect(() => {
    if (!quiz.timeLimitPerQuestion || quiz.timeLimitPerQuestion <= 0 || revealed) return;

    setTimeLeft(quiz.timeLimitPerQuestion);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAnswer(null); // Time's up!
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentIndex, quiz.timeLimitPerQuestion, revealed, handleAnswer]);

  const handleNext = useCallback(() => {
    if (quiz.soundEnabled) {
      playClickSound();
    }
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setRevealed(false);
      setSelectedChoice(null);
    } else {
      onFinishQuiz(answers);
    }
  }, [currentIndex, questions.length, answers, onFinishQuiz]);

  const handleRestart = useCallback(() => {
    if (quiz.soundEnabled) {
      playClickSound();
    }
    setCurrentIndex(0);
    setAnswers([]);
    setRevealed(false);
    setSelectedChoice(null);
    let pool = filterQuestions && filterQuestions.length > 0 ? [...filterQuestions] : [...quiz.questions];
    if (quiz.shuffleQuestions && !filterQuestions) {
      pool = pool.sort(() => Math.random() - 0.5);
    }
    setQuestions(pool);
  }, [quiz, filterQuestions]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (!revealed) {
        if (e.key === 'v' || e.key === 'V' || e.key === 'ArrowLeft') {
          handleAnswer(true);
        } else if (e.key === 'f' || e.key === 'F' || e.key === 'ArrowRight') {
          handleAnswer(false);
        }
      } else {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight') {
          e.preventDefault();
          handleNext();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [revealed, handleAnswer, handleNext]);

  if (!currentQuestion) {
    return (
      <div className="text-center py-20 text-slate-500">
        <p>Carregando perguntas...</p>
      </div>
    );
  }

  const isCurrentCorrect = selectedChoice !== null && selectedChoice === currentQuestion.isTrue;
  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

  // Typography options
  const typo = quiz.typography || {
    questionSize: 'md',
    questionFont: 'sans',
    questionWeight: 'bold',
    buttonSize: 'md',
    buttonFont: 'sans',
    buttonWeight: 'bold',
  };

  const questionSizeClass = {
    sm: 'text-base sm:text-lg',
    md: 'text-lg sm:text-xl',
    lg: 'text-xl sm:text-2xl',
    xl: 'text-2xl sm:text-3xl',
  }[typo.questionSize] || 'text-lg sm:text-xl';

  const questionFontClass = {
    sans: 'font-sans',
    display: 'font-display',
    serif: 'font-serif',
    mono: 'font-mono',
  }[typo.questionFont] || 'font-sans';

  const questionWeightClass = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  }[typo.questionWeight] || 'font-bold';

  const buttonSizeClass = {
    sm: 'text-sm py-3 px-4',
    md: 'text-base sm:text-lg py-4 sm:py-5 px-6',
    lg: 'text-lg sm:text-xl py-4 sm:py-5 px-6',
    xl: 'text-xl sm:text-2xl py-5 sm:py-6 px-6',
  }[typo.buttonSize] || 'text-base sm:text-lg py-4 sm:py-5 px-6';

  const buttonFontClass = {
    sans: 'font-sans',
    display: 'font-display',
    serif: 'font-serif',
    mono: 'font-mono',
  }[typo.buttonFont] || 'font-sans';

  const buttonWeightClass = {
    normal: 'font-normal',
    semibold: 'font-semibold',
    bold: 'font-bold',
    black: 'font-black',
  }[typo.buttonWeight] || 'font-bold';

  const correctCount = answers.filter((a) => a.isCorrect).length;
  const wrongCount = answers.filter((a) => !a.isCorrect).length;
  const isSmall = quiz.quizSize === 'sm';

  return (
    <div className={`${isSmall ? 'max-w-sm py-2 space-y-2' : 'max-w-2xl py-4 sm:py-8 space-y-4'} mx-auto px-3 sm:px-4`}>
      
      {/* Top Meta: Questão X de Y & Timer */}
      {(quiz.showQuestionNumber !== false || quiz.timeLimitPerQuestion > 0) && (
        <div className={`flex items-center justify-between font-semibold text-slate-500 px-1 ${isSmall ? 'text-[11px]' : 'text-xs'}`}>
          {quiz.showQuestionNumber !== false ? (
            <span>Questão {currentIndex + 1} de {questions.length}</span>
          ) : <span />}
          {quiz.timeLimitPerQuestion > 0 && (
            <div className={`flex items-center gap-1.5 font-mono font-bold px-2 py-0.5 rounded-full border ${isSmall ? 'text-[10px]' : 'text-xs'} ${
              timeLeft <= 5 
                ? 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse' 
                : 'bg-amber-50 text-amber-800 border-amber-200'
            }`}>
              <Clock className={isSmall ? "w-3 h-3 text-amber-600" : "w-3.5 h-3.5 text-amber-600"} />
              <span>{timeLeft}s</span>
            </div>
          )}
        </div>
      )}

      {/* Barra de progresso condicional */}
      {quiz.showProgressBar !== false && (
        <div className={`w-full bg-slate-200 rounded-full overflow-hidden border border-slate-300/80 shadow-2xs ${isSmall ? 'h-1.5' : 'h-2.5'}`}>
          <div
            className="bg-blue-600 h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}

      {/* Main Game Card with White Background */}
      <div className={`relative ${isSmall ? 'rounded-2xl' : 'rounded-3xl'} border transition-all duration-300 overflow-hidden shadow-sm bg-white text-slate-900 ${
        revealed
          ? isCurrentCorrect
            ? 'border-emerald-300 ring-2 ring-emerald-200'
            : 'border-rose-300 ring-2 ring-rose-200'
          : 'border-slate-200'
      }`}>

        {/* Statement area with configured typography and optional image */}
        <div className={isSmall ? "px-3.5 py-3.5 space-y-2" : "px-6 sm:px-8 py-8 sm:py-10 space-y-4"}>
          {(currentQuestion.statementType === 'image' || currentQuestion.statementType === 'both' || (currentQuestion.imageUrl && currentQuestion.statementType !== 'text')) && currentQuestion.imageUrl && (
            <div className={`w-full flex items-center justify-center overflow-hidden ${isSmall ? 'rounded-xl' : 'rounded-2xl'} border border-slate-100 bg-slate-50 p-1.5 shadow-2xs`}>
              <img
                src={currentQuestion.imageUrl}
                alt="Imagem da questão"
                className={`w-auto max-w-full object-contain ${isSmall ? 'rounded-lg max-h-36' : 'rounded-xl max-h-72'}`}
              />
            </div>
          )}

          {currentQuestion.statementType !== 'image' && currentQuestion.statement && (
            <h2 className={`${isSmall ? 'text-[12px] leading-snug' : questionSizeClass} ${questionFontClass} ${questionWeightClass} text-slate-900 text-center sm:text-left`}>
              {currentQuestion.statement}
            </h2>
          )}
        </div>

        {/* Interactive Choice Buttons - Softer, less saturated colors with configured typography */}
        {!revealed ? (
          <div className={isSmall ? "px-3.5 pb-3.5 pt-0" : "px-6 sm:px-8 pb-8 pt-1"}>
            <div className={`grid grid-cols-2 ${isSmall ? 'gap-2' : 'gap-4'}`}>
              
              {/* Botão VERDADEIRO */}
              <button
                onClick={() => handleAnswer(true)}
                className={`group relative flex items-center justify-center rounded-2xl bg-emerald-100/90 hover:bg-emerald-200 active:bg-emerald-300 hover:scale-[1.01] active:scale-[0.99] transition-all text-slate-900 border-2 border-emerald-300 shadow-xs cursor-pointer ${
                  isSmall ? 'text-[12px] py-2 px-2.5 rounded-xl gap-1.5' : `${buttonSizeClass} gap-2.5`
                }`}
              >
                <div className={`flex items-center justify-center bg-emerald-200/80 text-emerald-800 shrink-0 ${
                  isSmall ? 'h-6 w-6 rounded-md' : 'h-8 w-8 rounded-xl'
                }`}>
                  <CheckCircle2 className={isSmall ? "w-3.5 h-3.5 stroke-[2.5]" : "w-5 h-5 stroke-[2.5]"} />
                </div>
                <span className={`${buttonFontClass} ${buttonWeightClass} tracking-tight text-slate-900`}>
                  VERDADEIRO
                </span>
              </button>

              {/* Botão FALSO */}
              <button
                onClick={() => handleAnswer(false)}
                className={`group relative flex items-center justify-center rounded-2xl bg-rose-100/90 hover:bg-rose-200 active:bg-rose-300 hover:scale-[1.01] active:scale-[0.99] transition-all text-slate-900 border-2 border-rose-300 shadow-xs cursor-pointer ${
                  isSmall ? 'text-[12px] py-2 px-2.5 rounded-xl gap-1.5' : `${buttonSizeClass} gap-2.5`
                }`}
              >
                <div className={`flex items-center justify-center bg-rose-200/80 text-rose-800 shrink-0 ${
                  isSmall ? 'h-6 w-6 rounded-md' : 'h-8 w-8 rounded-xl'
                }`}>
                  <XCircle className={isSmall ? "w-3.5 h-3.5 stroke-[2.5]" : "w-5 h-5 stroke-[2.5]"} />
                </div>
                <span className={`${buttonFontClass} ${buttonWeightClass} tracking-tight text-slate-900`}>
                  FALSO
                </span>
              </button>

            </div>
          </div>
        ) : (
          /* Revealed Result & Feedback Section */
          <div className={isSmall ? "px-3.5 pb-3.5 pt-0 space-y-2.5" : "px-6 sm:px-8 pb-8 pt-1 space-y-5"}>
            
            {/* CREATOR'S CUSTOM FEEDBACK MESSAGES */}
            {isCurrentCorrect ? (
              <div className={`border border-emerald-200 bg-emerald-50/60 shadow-xs ${isSmall ? 'rounded-xl p-2.5 text-[12px]' : 'rounded-2xl p-4 sm:p-5'}`}>
                <div className={`flex items-center gap-1.5 text-emerald-800 font-bold ${isSmall ? 'text-xs mb-1' : 'text-sm mb-1.5'}`}>
                  <CheckCircle2 className={isSmall ? "w-3.5 h-3.5 text-emerald-600" : "w-4 h-4 text-emerald-600"} />
                  <span>Você Acertou!</span>
                </div>
                <p className={`${isSmall ? 'text-[12px]' : 'text-sm'} text-slate-800 font-medium leading-normal`}>
                  "{currentQuestion.successMessage}"
                </p>
              </div>
            ) : (
              <div className={`border border-rose-200 bg-rose-50/60 shadow-xs ${isSmall ? 'rounded-xl p-2.5 text-[12px]' : 'rounded-2xl p-4 sm:p-5'}`}>
                <div className={`flex items-center gap-1.5 text-rose-800 font-bold ${isSmall ? 'text-xs mb-1' : 'text-sm mb-1.5'}`}>
                  <AlertCircle className={isSmall ? "w-3.5 h-3.5 text-rose-600" : "w-4 h-4 text-rose-600"} />
                  <span>Feedback Explicativo do Criador:</span>
                </div>
                <p className={`${isSmall ? 'text-[12px]' : 'text-sm'} text-slate-800 font-medium leading-normal`}>
                  "{currentQuestion.errorMessage}"
                </p>
              </div>
            )}

            {/* Action Bar inside the box */}
            <div className={`border-t border-slate-100 ${isSmall ? 'pt-2 space-y-2 mt-2' : 'pt-3 space-y-3 mt-4'}`}>
              {/* Next Button Row */}
              <div className="flex justify-end">
                {(currentIndex + 1 < questions.length || quiz.showFinalResults) && (
                  <button
                    onClick={handleNext}
                    autoFocus
                    className={`flex items-center gap-1.5 font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-xs transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer ml-auto ${
                      isSmall ? 'px-3 py-1.5 text-xs rounded-lg' : 'px-5 py-3 text-sm rounded-xl'
                    }`}
                  >
                    <span>{currentIndex + 1 < questions.length ? 'Próxima Pergunta' : 'Ver Resultado Final'}</span>
                    <ArrowRight className={isSmall ? "w-3.5 h-3.5" : "w-4 h-4"} />
                  </button>
                )}
              </div>

              {/* Status e opção Reiniciar: centralizados na última questão e dentro do box */}
              {currentIndex + 1 >= questions.length && (
                <div className={`flex flex-wrap items-center justify-center text-center gap-2 font-medium text-slate-500 ${isSmall ? 'text-[11px] pt-0.5' : 'text-xs sm:text-sm pt-1'}`}>
                  {quiz.showLiveScore !== false && questions.length > 1 && (
                    <span>
                      Você acertou <strong className="text-slate-800 font-bold">{correctCount}</strong> {correctCount === 1 ? 'questão' : 'questões'} e errou <strong className="text-slate-800 font-bold">{wrongCount}</strong> {wrongCount === 1 ? 'questão' : 'questões'}.
                    </span>
                  )}
                  {quiz.showRestartOption !== false && (
                    <button
                      type="button"
                      onClick={handleRestart}
                      className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800 font-semibold hover:underline transition-colors cursor-pointer"
                    >
                      {quiz.showLiveScore !== false && questions.length > 1 && <span className="text-slate-300 mr-0.5">·</span>}
                      <RotateCcw className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="text-slate-500 hover:text-slate-800">Reiniciar</span>
                    </button>
                  )}
                </div>
              )}
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
