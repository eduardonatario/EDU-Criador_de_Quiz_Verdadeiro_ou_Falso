export type StatementType = 'text' | 'image' | 'both';

export interface TrueFalseQuestion {
  id: string;
  statement: string; // A pergunta ou afirmação (opcional se statementType for 'image')
  statementType?: StatementType; // 'text' | 'image' | 'both' (padrão 'text')
  imageUrl?: string; // URL ou data URL da imagem
  imageAlt?: string; // Descrição opcional da imagem
  isTrue: boolean; // Gabarito oficial: true = Verdadeiro, false = Falso
  successMessage: string; // Mensagem de acerto (mensagem de parabéns / elogio)
  errorMessage: string; // Mensagem de erro (feedback de erro / explicação)
  category?: string; // Tópico ou categoria (ex: Ciência, História, Curiosidade)
  explanationDetail?: string; // Informação complementar ou fonte (opcional)
}

export type QuizSize = 'sm' | 'md'; // 'sm' = Pequeno | 'md' = Médio (padrão)

export interface QuizTypography {
  questionSize: 'sm' | 'md' | 'lg' | 'xl'; // Pequeno (16px), Médio (20px), Grande (24px), Muito Grande (28px)
  questionFont: 'sans' | 'display' | 'serif' | 'mono'; // Sem serifa, Display, Serifada, Monoespaçada
  questionWeight: 'normal' | 'medium' | 'semibold' | 'bold';
  buttonSize: 'sm' | 'md' | 'lg' | 'xl'; // Pequeno (14px), Médio (16px), Grande (18px), Muito Grande (22px)
  buttonFont: 'sans' | 'display' | 'serif' | 'mono';
  buttonWeight: 'normal' | 'semibold' | 'bold' | 'black';
}

export interface QuizGame {
  id: string;
  title: string;
  description: string;
  themeTopic?: string; // Tema do jogo
  author?: string;
  createdAt: string;
  updatedAt: string;
  themeColor: 'emerald' | 'blue' | 'purple' | 'amber' | 'rose';
  timeLimitPerQuestion: number; // 0 significa sem limite de tempo
  shuffleQuestions: boolean;
  soundEnabled: boolean;
  showFinalResults: boolean;
  showQuestionNumber?: boolean;
  showProgressBar?: boolean;
  showLiveScore?: boolean;
  showRestartOption?: boolean;
  showAnswerReview?: boolean;
  quizSize?: QuizSize;
  typography?: QuizTypography;
  questions: TrueFalseQuestion[];
}

export interface PlayerAnswer {
  questionId: string;
  question: TrueFalseQuestion;
  userChoice: boolean;
  isCorrect: boolean;
  answeredAt: string;
}

export type AppView = 'editor' | 'play' | 'library';
