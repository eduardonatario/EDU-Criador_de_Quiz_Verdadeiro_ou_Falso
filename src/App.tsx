import React, { useState, useEffect } from 'react';
import { 
  QuizGame, 
  TrueFalseQuestion, 
  PlayerAnswer, 
  AppView 
} from './types';
import { DEFAULT_QUIZZES } from './data/defaultQuizzes';
import { Header } from './components/Header';
import { QuestionList } from './components/QuestionList';
import { QuestionEditorModal } from './components/QuestionEditorModal';
import { QuizPlayer } from './components/QuizPlayer';
import { QuizResults } from './components/QuizResults';
import { GamesLibraryModal } from './components/GamesLibraryModal';
import { ShareExportModal } from './components/ShareExportModal';
import { InstructionsModal } from './components/InstructionsModal';
import { isAudioEnabled, setAudioEnabled } from './utils/audio';

const STORAGE_KEY = 'tf_quizmaster_quizzes_v1';
const ACTIVE_QUIZ_KEY = 'tf_quizmaster_active_id_v1';

export default function App() {
  const [quizzes, setQuizzes] = useState<QuizGame[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback
    }
    return DEFAULT_QUIZZES;
  });

  const [activeQuizId, setActiveQuizId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(ACTIVE_QUIZ_KEY);
      if (saved) return saved;
    } catch {
      // Fallback
    }
    return DEFAULT_QUIZZES[0].id;
  });

  const [currentView, setCurrentView] = useState<AppView>('editor');
  const [playerResults, setPlayerResults] = useState<PlayerAnswer[] | null>(null);
  const [retryQuestions, setRetryQuestions] = useState<TrueFalseQuestion[] | undefined>(undefined);
  const [soundEnabled, setSound] = useState<boolean>(() => isAudioEnabled());

  // Modals state
  const [questionModalOpen, setQuestionModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<TrueFalseQuestion | null>(null);
  const [editingQuestionIndex, setEditingQuestionIndex] = useState(0);

  const [libraryModalOpen, setLibraryModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [instructionsModalOpen, setInstructionsModalOpen] = useState(false);

  // Sync quizzes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(quizzes));
    } catch (e) {
      console.warn('Erro ao salvar no localStorage', e);
    }
  }, [quizzes]);

  // Sync activeQuizId
  useEffect(() => {
    try {
      localStorage.setItem(ACTIVE_QUIZ_KEY, activeQuizId);
    } catch (e) {
      console.warn('Erro ao salvar activeQuizId', e);
    }
  }, [activeQuizId]);

  // Check URL hash for shared quiz
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hash = window.location.hash;
    if (hash.startsWith('#quiz_data=')) {
      try {
        const b64 = hash.replace('#quiz_data=', '');
        const jsonStr = decodeURIComponent(escape(atob(b64)));
        const sharedQuiz: QuizGame = JSON.parse(jsonStr);
        if (sharedQuiz && sharedQuiz.title && Array.isArray(sharedQuiz.questions)) {
          // Check if exists or add
          const existing = quizzes.find((q) => q.id === sharedQuiz.id);
          if (!existing) {
            setQuizzes((prev) => [sharedQuiz, ...prev]);
          }
          setActiveQuizId(sharedQuiz.id);
          setCurrentView('play'); // directly launch play mode for shared link!
        }
      } catch (err) {
        console.error('Falha ao decodificar quiz do hash', err);
      }
    }
  }, []);

  const activeQuiz =
    quizzes.find((q) => q.id === activeQuizId) ||
    quizzes[0] ||
    DEFAULT_QUIZZES[0];

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSound(next);
    setAudioEnabled(next);
  };

  const handleUpdateActiveQuiz = (updated: QuizGame) => {
    setQuizzes((prev) =>
      prev.map((q) => (q.id === updated.id ? updated : q))
    );
  };

  const handleOpenQuestionModal = (
    question: TrueFalseQuestion | null,
    index: number
  ) => {
    setEditingQuestion(question);
    setEditingQuestionIndex(index);
    setQuestionModalOpen(true);
  };

  const handleSaveQuestion = (savedQuestion: TrueFalseQuestion) => {
    let updatedQuestions = [...activeQuiz.questions];
    if (editingQuestion) {
      updatedQuestions = updatedQuestions.map((q) =>
        q.id === savedQuestion.id ? savedQuestion : q
      );
    } else {
      updatedQuestions.push(savedQuestion);
    }

    const updatedQuiz: QuizGame = {
      ...activeQuiz,
      questions: updatedQuestions,
      updatedAt: new Date().toISOString(),
    };

    handleUpdateActiveQuiz(updatedQuiz);
    setQuestionModalOpen(false);
    setEditingQuestion(null);
  };

  const handleCreateNewQuiz = () => {
    const newId = `quiz_${Date.now()}`;
    const newQuiz: QuizGame = {
      id: newId,
      title: 'Título',
      description: 'Subtítulo',
      themeTopic: 'Geral',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      themeColor: 'emerald',
      timeLimitPerQuestion: 0,
      shuffleQuestions: false,
      soundEnabled: true,
      showFinalResults: true,
      showQuestionNumber: true,
      showProgressBar: true,
      showLiveScore: true,
      showRestartOption: true,
      questions: [],
    };
    setQuizzes((prev) => [newQuiz, ...prev]);
    setActiveQuizId(newId);
    setCurrentView('editor');
    // Open question modal directly to start creating question 1
    handleOpenQuestionModal(null, 0);
  };

  const handleDuplicateQuiz = (quizToDup: QuizGame) => {
    const dupId = `quiz_${Date.now()}_dup`;
    const duplicated: QuizGame = {
      ...quizToDup,
      id: dupId,
      title: `${quizToDup.title} (Cópia)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setQuizzes((prev) => [duplicated, ...prev]);
    setActiveQuizId(dupId);
  };

  const handleDeleteQuiz = (quizId: string) => {
    const remaining = quizzes.filter((q) => q.id !== quizId);
    setQuizzes(remaining);
    if (activeQuizId === quizId) {
      setActiveQuizId(remaining[0]?.id || DEFAULT_QUIZZES[0].id);
    }
  };

  const handleResetTemplates = () => {
    setQuizzes(DEFAULT_QUIZZES);
    setActiveQuizId(DEFAULT_QUIZZES[0].id);
    setLibraryModalOpen(false);
  };

  const handleStartPlaying = () => {
    setPlayerResults(null);
    setRetryQuestions(undefined);
    setCurrentView('play');
  };

  const handleFinishQuiz = (answers: PlayerAnswer[]) => {
    if (activeQuiz.showFinalResults) {
      setPlayerResults(answers);
    } else {
      setCurrentView('editor');
    }
  };

  const handlePlayAgain = (onlyWrong = false) => {
    if (onlyWrong && playerResults) {
      const wrong = playerResults
        .filter((a) => !a.isCorrect)
        .map((a) => a.question);
      setRetryQuestions(wrong);
    } else {
      setRetryQuestions(undefined);
    }
    setPlayerResults(null);
  };

  const [copiedCode, setCopiedCode] = useState(false);

  const handleCopyEmbedCode = () => {
    import('./utils/exportHtml').then(({ generateStandaloneQuizHtml }) => {
      const html = generateStandaloneQuizHtml(activeQuiz);
      navigator.clipboard.writeText(html);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2500);
    });
  };

  const handleDownloadHtml = () => {
    import('./utils/exportHtml').then(({ generateStandaloneQuizHtml }) => {
      const html = generateStandaloneQuizHtml(activeQuiz);
      const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Verdadeiro_ou_Falso.html';
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  const handleImportQuiz = (imported: QuizGame) => {
    const withId: QuizGame = {
      ...imported,
      id: `imported_${Date.now()}`,
      updatedAt: new Date().toISOString(),
    };
    setQuizzes((prev) => [withId, ...prev]);
    setActiveQuizId(withId.id);
    setCurrentView('editor');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      
      {/* Universal Header */}
      <Header
        currentView={currentView}
        onViewChange={(view) => {
          if (view === 'editor') {
            setPlayerResults(null);
          }
          setCurrentView(view);
        }}
        activeQuiz={activeQuiz}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onCopyEmbedCode={handleCopyEmbedCode}
        onDownloadHtml={handleDownloadHtml}
        copiedCode={copiedCode}
      />

      {/* Main View Port */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* VIEW 1: Editor */}
        {currentView === 'editor' && (
          <QuestionList
            quiz={activeQuiz}
            onUpdateQuiz={handleUpdateActiveQuiz}
            onOpenQuestionModal={handleOpenQuestionModal}
            onStartPlaying={handleStartPlaying}
          />
        )}

        {/* VIEW 2: Play Game or Results */}
        {currentView === 'play' && (
          <>
            {playerResults === null ? (
              <QuizPlayer
                quiz={activeQuiz}
                filterQuestions={retryQuestions}
                onFinishQuiz={handleFinishQuiz}
                onExit={() => setCurrentView('editor')}
              />
            ) : (
              <QuizResults
                quiz={activeQuiz}
                answers={playerResults}
                onPlayAgain={handlePlayAgain}
                onBackToEditor={() => {
                  setPlayerResults(null);
                  setCurrentView('editor');
                }}
                onOpenShareModal={() => setShareModalOpen(true)}
              />
            )}
          </>
        )}

      </main>

      {/* Modals */}
      <QuestionEditorModal
        isOpen={questionModalOpen}
        questionToEdit={editingQuestion}
        questionIndex={editingQuestionIndex}
        onSave={handleSaveQuestion}
        onClose={() => {
          setQuestionModalOpen(false);
          setEditingQuestion(null);
        }}
      />

      <GamesLibraryModal
        isOpen={libraryModalOpen}
        onClose={() => setLibraryModalOpen(false)}
        savedQuizzes={quizzes}
        activeQuizId={activeQuizId}
        onSelectQuiz={(quiz) => {
          setActiveQuizId(quiz.id);
          setPlayerResults(null);
          setCurrentView('editor');
        }}
        onCreateNewQuiz={handleCreateNewQuiz}
        onDuplicateQuiz={handleDuplicateQuiz}
        onDeleteQuiz={handleDeleteQuiz}
        onResetTemplates={handleResetTemplates}
      />

      <ShareExportModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        quiz={activeQuiz}
        onImportQuiz={handleImportQuiz}
      />

      <InstructionsModal
        isOpen={instructionsModalOpen}
        onClose={() => setInstructionsModalOpen(false)}
      />

    </div>
  );
}
