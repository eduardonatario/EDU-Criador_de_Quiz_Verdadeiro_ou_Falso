import { QuizGame } from '../types';

export function generateStandaloneQuizHtml(quiz: QuizGame): string {
  const typo = quiz.typography || {
    questionSize: 'md',
    questionFont: 'sans',
    questionWeight: 'bold',
    buttonSize: 'md',
    buttonFont: 'sans',
    buttonWeight: 'bold',
  };

  const questionSizeMap = {
    sm: '1rem',
    md: '1.25rem',
    lg: '1.5rem',
    xl: '1.85rem',
  };

  const questionFontMap = {
    sans: "'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    display: "'Outfit', 'Plus Jakarta Sans', system-ui, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    mono: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  };

  const questionWeightMap = {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  };

  const buttonSizeMap = {
    sm: '0.95rem',
    md: '1.1rem',
    lg: '1.25rem',
    xl: '1.45rem',
  };

  const buttonFontMap = {
    sans: "'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    display: "'Outfit', 'Plus Jakarta Sans', system-ui, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    mono: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  };

  const buttonWeightMap = {
    normal: '400',
    semibold: '600',
    bold: '700',
    black: '900',
  };

  const qSizeCss = questionSizeMap[typo.questionSize] || '1.25rem';
  const qFontCss = questionFontMap[typo.questionFont] || questionFontMap.sans;
  const qWeightCss = questionWeightMap[typo.questionWeight] || '700';

  const bSizeCss = buttonSizeMap[typo.buttonSize] || '1.1rem';
  const bFontCss = buttonFontMap[typo.buttonFont] || buttonFontMap.sans;
  const bWeightCss = buttonWeightMap[typo.buttonWeight] || '700';

  const isSmall = quiz.quizSize === 'sm';
  const containerMaxWidth = isSmall ? '420px' : '680px';
  const cardBodyPadding = isSmall ? '0.85rem 0.95rem' : '2.25rem 2rem';
  const actionsGridColumns = '1fr 1fr';
  const imageMaxHeight = isSmall ? '150px' : '320px';
  const activeQSizeCss = isSmall ? '12px' : qSizeCss;
  const activeBSizeCss = isSmall ? '12px' : bSizeCss;

  // Safely encode JSON to be inserted into a <script type="application/json">
  const safeJson = JSON.stringify(quiz).replace(/</g, '\\u003c');

  // Random unique instance ID to avoid conflict if embedded multiple times on the same page
  const instanceId = Math.random().toString(36).substring(2, 9);

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(quiz.title || 'Jogo de Verdadeiro ou Falso')}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Outfit:wght@500;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    /* Standalone body styling only applied if opened directly as a page */
    body.vf-standalone-page {
      background-color: #f8fafc;
      color: #0f172a;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 1.5rem 1rem;
      margin: 0;
      font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
    }

    /* ALL EMBED WIDGET STYLES SCOPED TO #vf-quiz-embed-${instanceId} TO AVOID INTERFERENCE */
    #vf-quiz-embed-${instanceId} {
      width: 100%;
      max-width: ${containerMaxWidth};
      margin: 0 auto;
      box-sizing: border-box;
      font-family: 'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 16px;
      line-height: 1.5;
      color: #0f172a;
      text-align: left;
      position: relative;
    }

    /* Isolated reset for widget children so host site styles (WordPress, Bootstrap, etc.) don't break the quiz */
    #vf-quiz-embed-${instanceId} *,
    #vf-quiz-embed-${instanceId} *::before,
    #vf-quiz-embed-${instanceId} *::after {
      box-sizing: border-box;
    }

    #vf-quiz-embed-${instanceId} p,
    #vf-quiz-embed-${instanceId} h1,
    #vf-quiz-embed-${instanceId} h2,
    #vf-quiz-embed-${instanceId} h3,
    #vf-quiz-embed-${instanceId} h4,
    #vf-quiz-embed-${instanceId} div,
    #vf-quiz-embed-${instanceId} span,
    #vf-quiz-embed-${instanceId} button {
      margin: 0;
      padding: 0;
      border: 0;
      font: inherit;
      vertical-align: baseline;
    }

    /* Meta bar (Questão X de Y & Timer) */
    #vf-quiz-embed-${instanceId} .vf-meta-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 0.5rem;
      font-size: 0.8rem;
      font-weight: 600;
      color: #64748b;
      min-height: 1.5rem;
    }

    #vf-quiz-embed-${instanceId} .vf-timer-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.2rem 0.6rem;
      background: #fef3c7;
      color: #b45309;
      border: 1px solid #fde68a;
      border-radius: 9999px;
      font-weight: 700;
      font-size: 0.75rem;
      font-family: ui-monospace, SFMono-Regular, monospace;
    }

    #vf-quiz-embed-${instanceId} .vf-timer-badge.danger {
      background: #fee2e2;
      color: #b91c1c;
      border-color: #fca5a5;
      animation: vf-pulse 1s infinite;
    }

    @keyframes vf-pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.6; }
    }
    
    /* Progress bar */
    #vf-quiz-embed-${instanceId} .vf-progress-bar-bg {
      width: 100%;
      height: 8px;
      background: #e2e8f0;
      border-radius: 9999px;
      overflow: hidden;
      margin-bottom: 1rem;
    }

    #vf-quiz-embed-${instanceId} .vf-progress-bar-fill {
      height: 100%;
      background: #2563eb;
      transition: width 0.3s ease;
    }
    
    /* Main Question Card */
    #vf-quiz-embed-${instanceId} .vf-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 1.5rem;
      box-shadow: 0 4px 12px -2px rgba(0,0,0,0.05);
      overflow: hidden;
    }

    #vf-quiz-embed-${instanceId} .vf-card-body {
      padding: ${cardBodyPadding};
    }

    /* Statement Image */
    #vf-quiz-embed-${instanceId} .vf-img-wrap {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: ${isSmall ? '0.75rem' : '1rem'};
      padding: ${isSmall ? '0.35rem' : '0.5rem'};
      margin-bottom: ${isSmall ? '0.75rem' : '1.25rem'};
      overflow: hidden;
    }

    #vf-quiz-embed-${instanceId} .vf-statement-img {
      max-height: ${imageMaxHeight};
      width: auto;
      max-width: 100%;
      object-fit: contain;
      border-radius: ${isSmall ? '0.5rem' : '0.75rem'};
    }
    
    /* Statement */
    #vf-quiz-embed-${instanceId} .vf-statement { 
      font-size: ${activeQSizeCss}; 
      font-family: ${qFontCss}; 
      font-weight: ${qWeightCss}; 
      line-height: ${isSmall ? '1.4' : '1.5'}; 
      color: #0f172a; 
      margin-bottom: ${isSmall ? '0.85rem' : '1.5rem'}; 
      word-break: break-word;
    }
    
    /* Choice Buttons */
    #vf-quiz-embed-${instanceId} .vf-actions-grid {
      display: grid;
      grid-template-columns: ${actionsGridColumns};
      gap: ${isSmall ? '0.5rem' : '0.85rem'};
      margin-top: ${isSmall ? '0.5rem' : '1rem'};
    }
    
    #vf-quiz-embed-${instanceId} .vf-btn-true { 
      background: #d1fae5; 
      color: #064e3b; 
      border: 2px solid #a7f3d0; 
      padding: ${isSmall ? '0.55rem 0.75rem' : '1.05rem 1.2rem'}; 
      border-radius: ${isSmall ? '0.75rem' : '1rem'}; 
      font-size: ${activeBSizeCss}; 
      font-family: ${bFontCss}; 
      font-weight: ${bWeightCss}; 
      cursor: pointer; 
      transition: transform 0.15s, background 0.15s, border-color 0.15s; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      gap: ${isSmall ? '0.35rem' : '0.6rem'}; 
      width: 100%;
    }

    #vf-quiz-embed-${instanceId} .vf-btn-true:hover {
      background: #a7f3d0;
      border-color: #6ee7b7;
      transform: translateY(-1px);
    }

    #vf-quiz-embed-${instanceId} .vf-btn-true:active { transform: translateY(0); }
    
    #vf-quiz-embed-${instanceId} .vf-btn-false { 
      background: #ffe4e6; 
      color: #881337; 
      border: 2px solid #fecdd3; 
      padding: ${isSmall ? '0.55rem 0.75rem' : '1.05rem 1.2rem'}; 
      border-radius: ${isSmall ? '0.75rem' : '1rem'}; 
      font-size: ${activeBSizeCss}; 
      font-family: ${bFontCss}; 
      font-weight: ${bWeightCss}; 
      cursor: pointer; 
      transition: transform 0.15s, background 0.15s, border-color 0.15s; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      gap: ${isSmall ? '0.35rem' : '0.6rem'}; 
      width: 100%;
    }

    #vf-quiz-embed-${instanceId} .vf-btn-false:hover {
      background: #fecdd3;
      border-color: #fda4af;
      transform: translateY(-1px);
    }

    #vf-quiz-embed-${instanceId} .vf-btn-false:active { transform: translateY(0); }

    #vf-quiz-embed-${instanceId} .vf-btn-true svg,
    #vf-quiz-embed-${instanceId} .vf-btn-false svg {
      width: ${isSmall ? '14px' : '20px'};
      height: ${isSmall ? '14px' : '20px'};
      flex-shrink: 0;
    }

    #vf-quiz-embed-${instanceId} .vf-btn-disabled {
      opacity: 0.6;
      cursor: not-allowed !important;
      transform: none !important;
    }

    /* Feedback Box */
    #vf-quiz-embed-${instanceId} .vf-feedback-box {
      margin-top: ${isSmall ? '0.75rem' : '1.25rem'};
      padding: ${isSmall ? '0.65rem 0.85rem' : '1.15rem'};
      border-radius: ${isSmall ? '0.75rem' : '1rem'};
      font-size: ${isSmall ? '12px' : '0.95rem'};
      line-height: ${isSmall ? '1.4' : '1.5'};
    }

    #vf-quiz-embed-${instanceId} .vf-feedback-success {
      background: #ecfdf5;
      border: 1px solid #6ee7b7;
      color: #064e3b;
    }

    #vf-quiz-embed-${instanceId} .vf-feedback-error {
      background: #fef2f2;
      border: 1px solid #fca5a5;
      color: #7f1d1d;
    }

    #vf-quiz-embed-${instanceId} .vf-feedback-title {
      font-weight: 800;
      font-size: ${isSmall ? '12px' : '0.95rem'};
      margin-bottom: 0.3rem;
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }
    
    #vf-quiz-embed-${instanceId} .vf-action-footer {
      display: flex;
      flex-direction: column;
      gap: ${isSmall ? '0.5rem' : '0.75rem'};
      margin-top: ${isSmall ? '0.75rem' : '1.25rem'};
      padding-top: ${isSmall ? '0.65rem' : '1rem'};
      border-top: 1px solid #f1f5f9;
    }

    #vf-quiz-embed-${instanceId} .vf-next-btn-row {
      display: flex;
      justify-content: flex-end;
      width: 100%;
    }

    #vf-quiz-embed-${instanceId} .vf-final-status-text {
      font-size: ${isSmall ? '11px' : '0.825rem'};
      color: #64748b;
      font-weight: 500;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      width: 100%;
      gap: 0.35rem;
      flex-wrap: wrap;
      padding-top: 0.15rem;
    }

    #vf-quiz-embed-${instanceId} .vf-final-status-text strong {
      color: #0f172a;
      font-weight: 700;
    }

    #vf-quiz-embed-${instanceId} .vf-dot-sep {
      color: #cbd5e1;
      margin: 0 0.15rem;
    }

    #vf-quiz-embed-${instanceId} .vf-btn-inline-restart {
      background: transparent;
      border: none;
      color: #64748b;
      font-weight: 600;
      font-size: ${isSmall ? '11px' : '0.825rem'};
      cursor: pointer;
      text-decoration: underline;
      padding: 0;
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      transition: color 0.15s;
    }

    #vf-quiz-embed-${instanceId} .vf-btn-inline-restart svg {
      stroke: #94a3b8;
    }

    #vf-quiz-embed-${instanceId} .vf-btn-inline-restart:hover {
      color: #1e293b;
    }
    
    #vf-quiz-embed-${instanceId} .vf-btn-next {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      background: #2563eb;
      color: #ffffff;
      padding: ${isSmall ? '0.45rem 0.9rem' : '0.75rem 1.4rem'};
      border-radius: ${isSmall ? '0.5rem' : '0.75rem'};
      font-weight: 700;
      font-size: ${isSmall ? '11px' : '0.875rem'};
      border: none;
      cursor: pointer;
      transition: background 0.15s, transform 0.15s;
      margin-left: auto;
    }

    #vf-quiz-embed-${instanceId} .vf-btn-next:hover {
      background: #1d4ed8;
      transform: translateY(-1px);
    }

    #vf-quiz-embed-${instanceId} .vf-btn-next:active { transform: translateY(0); }

    /* Results Screen */
    #vf-quiz-embed-${instanceId} .vf-results-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 1.5rem;
      padding: 2.25rem 1.5rem;
      text-align: center;
      box-shadow: 0 4px 12px -2px rgba(0,0,0,0.05);
      margin-bottom: 1.5rem;
    }

    #vf-quiz-embed-${instanceId} .vf-results-score-row {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 2rem;
      padding-top: 0.5rem;
    }

    #vf-quiz-embed-${instanceId} .vf-results-stat {
      text-align: center;
    }

    #vf-quiz-embed-${instanceId} .vf-results-stat-num {
      font-size: 2.75rem;
      font-weight: 900;
      line-height: 1;
      font-family: 'Outfit', 'Plus Jakarta Sans', sans-serif;
    }

    #vf-quiz-embed-${instanceId} .vf-results-stat-label {
      font-size: 0.75rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #64748b;
      margin-top: 0.4rem;
    }

    #vf-quiz-embed-${instanceId} .vf-results-divider {
      height: 3rem;
      width: 1px;
      background: #e2e8f0;
    }

    #vf-quiz-embed-${instanceId} .vf-results-actions {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      margin-top: 1.75rem;
    }

    #vf-quiz-embed-${instanceId} .vf-btn-restart {
      background: #2563eb;
      color: #ffffff;
      border: none;
      padding: 0.75rem 1.4rem;
      border-radius: 0.75rem;
      font-weight: 700;
      font-size: 0.875rem;
      cursor: pointer;
      transition: background 0.15s;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }

    #vf-quiz-embed-${instanceId} .vf-btn-restart:hover { background: #1d4ed8; }
    
    #vf-quiz-embed-${instanceId} .vf-btn-retry-wrong {
      background: #f43f5e;
      color: #ffffff;
      border: none;
      padding: 0.75rem 1.4rem;
      border-radius: 0.75rem;
      font-weight: 700;
      font-size: 0.875rem;
      cursor: pointer;
      transition: background 0.15s;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }

    #vf-quiz-embed-${instanceId} .vf-btn-retry-wrong:hover { background: #e11d48; }

    /* Review section */
    #vf-quiz-embed-${instanceId} .vf-review-section {
      margin-top: 2rem;
      text-align: left;
    }

    #vf-quiz-embed-${instanceId} .vf-review-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1rem;
    }

    #vf-quiz-embed-${instanceId} .vf-review-title {
      font-size: 1.15rem;
      font-weight: 800;
      color: #0f172a;
    }

    #vf-quiz-embed-${instanceId} .vf-review-item {
      background: #ffffff;
      border-radius: 1rem;
      border: 1px solid #e2e8f0;
      padding: 1.25rem;
      margin-bottom: 1rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.04);
    }

    #vf-quiz-embed-${instanceId} .vf-review-item.correct {
      border-color: #a7f3d0;
    }

    #vf-quiz-embed-${instanceId} .vf-review-item.incorrect {
      border-color: #fecdd3;
    }

    #vf-quiz-embed-${instanceId} .vf-review-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.2rem 0.6rem;
      border-radius: 0.5rem;
      font-size: 0.75rem;
      font-weight: 800;
      margin-bottom: 0.6rem;
    }

    #vf-quiz-embed-${instanceId} .vf-badge-correct {
      background: #d1fae5;
      color: #065f46;
      border: 1px solid #a7f3d0;
    }

    #vf-quiz-embed-${instanceId} .vf-badge-incorrect {
      background: #ffe4e6;
      color: #9f1239;
      border: 1px solid #fecdd3;
    }

    #vf-quiz-embed-${instanceId} .vf-review-img-wrap {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 0.75rem;
      padding: 0.35rem;
      margin-bottom: 0.75rem;
      max-height: 180px;
      overflow: hidden;
    }

    #vf-quiz-embed-${instanceId} .vf-review-img {
      max-height: 170px;
      width: auto;
      max-width: 100%;
      object-fit: contain;
      border-radius: 0.5rem;
    }

    #vf-quiz-embed-${instanceId} .vf-review-statement {
      font-size: 0.95rem;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 0.75rem;
    }

    #vf-quiz-embed-${instanceId} .vf-review-feedback {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 0.75rem;
      padding: 0.75rem 1rem;
      font-size: 0.85rem;
      color: #334155;
      line-height: 1.5;
    }

    #vf-quiz-embed-${instanceId} .vf-confetti-canvas {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 9999;
    }
  </style>
</head>
<body class="vf-standalone-page">

<!-- Isolated Quiz Embed Container -->
<div id="vf-quiz-embed-${instanceId}">
  <canvas class="vf-confetti-canvas" id="vf-confetti-${instanceId}"></canvas>
  <div id="vf-app-${instanceId}">
    <!-- Dynamic game loaded via scoped JS -->
  </div>
</div>

<script id="vf-quiz-data-${instanceId}" type="application/json">
${safeJson}
</script>

<script>
  (function () {
    const instanceKey = '${instanceId}';
    let quiz;
    try {
      const dataEl = document.getElementById('vf-quiz-data-' + instanceKey);
      quiz = JSON.parse(dataEl.textContent);
    } catch (e) {
      const appEl = document.getElementById('vf-app-' + instanceKey);
      if (appEl) {
        appEl.innerHTML = '<div style="padding: 1.5rem; background: #fff; border: 1px solid #fee2e2; border-radius: 1rem; color: #b91c1c;">Erro ao carregar os dados do quiz.</div>';
      }
      return;
    }

    const app = document.getElementById('vf-app-' + instanceKey);
    let currentIndex = 0;
    let score = 0;
    let revealed = false;
    let timerInterval = null;
    let timeLeft = 0;
    let answersRecord = [];

    // Setup active pool of questions
    let activeQuestions = quiz.shuffleQuestions
      ? [...quiz.questions].sort(() => Math.random() - 0.5)
      : [...quiz.questions];

    function startTimer() {
      clearInterval(timerInterval);
      if (!quiz.timeLimitPerQuestion || quiz.timeLimitPerQuestion <= 0) return;

      timeLeft = quiz.timeLimitPerQuestion;
      updateTimerBadge();

      timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerBadge();
        if (timeLeft <= 0) {
          clearInterval(timerInterval);
          answer(null, true);
        }
      }, 1000);
    }

    function updateTimerBadge() {
      const badge = document.getElementById('vf-timer-' + instanceKey);
      if (!badge) return;
      badge.textContent = timeLeft + 's';
      if (timeLeft <= 5) {
        badge.classList.add('danger');
      } else {
        badge.classList.remove('danger');
      }
    }

    function renderQuestion() {
      if (!activeQuestions || activeQuestions.length === 0) {
        app.innerHTML = '<div class="vf-card" style="padding: 2rem; text-align: center;"><p>Nenhuma pergunta disponível.</p></div>';
        return;
      }

      if (currentIndex >= activeQuestions.length) {
        if (quiz.showFinalResults !== false) {
          renderResults();
        } else {
          app.innerHTML = \`
            <div class="vf-results-card">
              <h2 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 0.75rem;">Quiz Concluído!</h2>
              <p style="color: #64748b; font-size: 1rem; margin-bottom: 1.5rem;">Você respondeu todas as perguntas do quiz.</p>
              <button class="vf-btn-restart" id="vf-btn-restart-all-\${instanceKey}">Jogar Novamente</button>
            </div>
          \`;
          const btn = document.getElementById('vf-btn-restart-all-' + instanceKey);
          if (btn) btn.onclick = restartAll;
        }
        return;
      }

      const q = activeQuestions[currentIndex];
      const progress = Math.round(((currentIndex + 1) / activeQuestions.length) * 100);
      revealed = false;

      const hasMeta = (quiz.showQuestionNumber !== false) || (quiz.timeLimitPerQuestion > 0);
      const showProgress = quiz.showProgressBar !== false;
      const showLiveScore = (quiz.showLiveScore !== false) && (activeQuestions.length > 1);

      const hasImage = (q.statementType === 'image' || q.statementType === 'both' || (q.imageUrl && q.statementType !== 'text')) && q.imageUrl;
      const showText = q.statementType !== 'image' && q.statement;

      const hits = score;
      const misses = answersRecord.filter(a => !a.isCorrect).length;
      const hitLabel = hits === 1 ? 'questão' : 'questões';
      const missLabel = misses === 1 ? 'questão' : 'questões';

      app.innerHTML = \`
        \${hasMeta ? \`
          <div class="vf-meta-bar">
            <span>\${quiz.showQuestionNumber !== false ? 'Questão ' + (currentIndex + 1) + ' de ' + activeQuestions.length : ''}</span>
            \${quiz.timeLimitPerQuestion > 0 ? \`
              <span class="vf-timer-badge" id="vf-timer-\${instanceKey}">\${quiz.timeLimitPerQuestion}s</span>
            \` : ''}
          </div>
        \` : ''}

        \${showProgress ? \`
          <div class="vf-progress-bar-bg">
            <div class="vf-progress-bar-fill" style="width: \${progress}%"></div>
          </div>
        \` : ''}

        <div class="vf-card">
          <div class="vf-card-body">
            \${hasImage ? \`
              <div class="vf-img-wrap">
                <img src="\${escapeXml(q.imageUrl)}" alt="Enunciado" class="vf-statement-img" />
              </div>
            \` : ''}

            \${showText ? \`
              <div class="vf-statement">\${escapeXml(q.statement || '')}</div>
            \` : ''}

            <div id="vf-action-zone-\${instanceKey}">
              <div class="vf-actions-grid">
                <button class="vf-btn-true" id="vf-btn-true-\${instanceKey}">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  <span>VERDADEIRO</span>
                </button>
                <button class="vf-btn-false" id="vf-btn-false-\${instanceKey}">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                  <span>FALSO</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      \`;

      const btnTrue = document.getElementById('vf-btn-true-' + instanceKey);
      const btnFalse = document.getElementById('vf-btn-false-' + instanceKey);
      if (btnTrue) btnTrue.onclick = () => answer(true, false);
      if (btnFalse) btnFalse.onclick = () => answer(false, false);

      startTimer();
    }

    function answer(choice, isTimeout) {
      if (revealed) return;
      revealed = true;
      clearInterval(timerInterval);

      const q = activeQuestions[currentIndex];
      const isCorrect = choice !== null && choice === q.isTrue;

      if (isCorrect) {
        score++;
        if (quiz.soundEnabled !== false) {
          playAudio(523, 659, 784);
        }
      } else {
        if (quiz.soundEnabled !== false) {
          playAudio(293, 220);
        }
      }

      answersRecord.push({
        question: q,
        choice: choice,
        isCorrect: isCorrect,
        isTimeout: isTimeout
      });

      const isLast = currentIndex + 1 >= activeQuestions.length;
      const canProceed = !isLast || quiz.showFinalResults !== false;

      const hits = score;
      const misses = answersRecord.filter(a => !a.isCorrect).length;
      const hitLabel = hits === 1 ? 'questão' : 'questões';
      const missLabel = misses === 1 ? 'questão' : 'questões';

      const showFinalStatus = isLast && (quiz.showLiveScore !== false && activeQuestions.length > 1);
      const showRestart = isLast && (quiz.showRestartOption !== false);

      const actionZone = document.getElementById('vf-action-zone-' + instanceKey);
      if (!actionZone) return;

      actionZone.innerHTML = \`
        <div class="vf-actions-grid">
          <button class="vf-btn-true vf-btn-disabled" disabled>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            <span>VERDADEIRO</span>
          </button>
          <button class="vf-btn-false vf-btn-disabled" disabled>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
            <span>FALSO</span>
          </button>
        </div>

        <div class="vf-feedback-box \${isCorrect ? 'vf-feedback-success' : 'vf-feedback-error'}">
          <div class="vf-feedback-title">
            \${isCorrect 
              ? '🎉 Parabéns, você acertou!' 
              : (isTimeout ? '⏰ Tempo esgotado! Gabarito: ' + (q.isTrue ? 'VERDADEIRO' : 'FALSO') : '❌ Você errou! Gabarito: ' + (q.isTrue ? 'VERDADEIRO' : 'FALSO'))}
          </div>
          <p>\${escapeXml(isCorrect ? q.successMessage : q.errorMessage)}</p>
        </div>

        <div class="vf-action-footer">
          \${canProceed ? \`
            <div class="vf-next-btn-row">
              <button class="vf-btn-next" id="vf-btn-next-\${instanceKey}">
                <span>\${isLast ? 'Ver Resultado Final →' : 'Próxima Pergunta →'}</span>
              </button>
            </div>
          \` : ''}

          \${isLast && (showFinalStatus || showRestart) ? \`
            <div class="vf-final-status-text">
              \${showFinalStatus ? \`
                <span>Você acertou <strong>\${hits}</strong> \${hitLabel} e errou <strong>\${misses}</strong> \${missLabel}.</span>
              \` : ''}
              \${showRestart ? \`
                \${showFinalStatus ? '<span class="vf-dot-sep">·</span>' : ''}
                <button type="button" class="vf-btn-inline-restart" id="vf-inline-restart-\${instanceKey}">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                  <span>Reiniciar</span>
                </button>
              \` : ''}
            </div>
          \` : ''}
        </div>
      \`;

      if (showRestart) {
        const btnInlineRestart = document.getElementById('vf-inline-restart-' + instanceKey);
        if (btnInlineRestart) {
          btnInlineRestart.onclick = restartAll;
        }
      }

      const btnNext = document.getElementById('vf-btn-next-' + instanceKey);
      if (btnNext) {
        btnNext.onclick = nextQuestion;
      }
    }

    function nextQuestion() {
      revealed = false;
      currentIndex++;
      renderQuestion();
    }

    function renderResults() {
      clearInterval(timerInterval);
      const total = answersRecord.length;
      const pct = total > 0 ? Math.round((score / total) * 100) : 0;
      const wrongCount = total - score;

      if (pct >= 60) {
        triggerConfetti();
        if (quiz.soundEnabled !== false) {
          playFanfare();
        }
      }

      let reviewHtml = '';
      answersRecord.forEach((item, idx) => {
        const itemHasImg = item.question && item.question.imageUrl;
        const itemShowText = item.question && item.question.statementType !== 'image';

        reviewHtml += \`
          <div class="vf-review-item \${item.isCorrect ? 'correct' : 'incorrect'}">
            <div class="vf-review-badge \${item.isCorrect ? 'vf-badge-correct' : 'vf-badge-incorrect'}">
              <span>#\${idx + 1}</span> · <span>\${item.isCorrect ? 'Acertou' : (item.isTimeout ? 'Tempo Esgotado' : 'Errou')}</span>
            </div>
            \${itemHasImg ? \`
              <div class="vf-review-img-wrap">
                <img src="\${escapeXml(item.question.imageUrl)}" alt="Imagem da pergunta" class="vf-review-img" />
              </div>
            \` : ''}
            \${itemShowText ? \`
              <div class="vf-review-statement">\${escapeXml(item.question.statement || '')}</div>
            \` : ''}
            <div class="vf-review-feedback">
              <strong>\${item.isCorrect ? 'Parabéns:' : 'Explicação:'}</strong>
              \${escapeXml(item.isCorrect ? item.question.successMessage : item.question.errorMessage)}
            </div>
          </div>
        \`;
      });

      app.innerHTML = \`
        <div class="vf-results-card">
          <div class="vf-results-score-row">
            <div class="vf-results-stat">
              <div class="vf-results-stat-num" style="color: #059669;">\${pct}%</div>
              <div class="vf-results-stat-label">Aproveitamento</div>
            </div>
            <div class="vf-results-divider"></div>
            <div class="vf-results-stat">
              <div class="vf-results-stat-num" style="color: #0f172a;">\${score}<span style="font-size: 1.5rem; color: #94a3b8; font-weight: 500;">/\${total}</span></div>
              <div class="vf-results-stat-label">Acertos</div>
            </div>
          </div>

          <div class="results-actions">
            <button class="vf-btn-restart" id="vf-btn-restart-\${instanceKey}">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
              <span>Jogar Novamente</span>
            </button>
            \${wrongCount > 0 ? \`
              <button class="vf-btn-retry-wrong" id="vf-btn-retry-wrong-\${instanceKey}">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>
                <span>tentar novamente as que errei</span>
              </button>
            \` : ''}
          </div>
        </div>

        <div class="vf-review-section">
          <div class="vf-review-header">
            <h3 class="vf-review-title">Revisão de Respostas</h3>
            <span style="font-size: 0.85rem; color: #64748b; font-weight: 600;">\${score} acertos · \${wrongCount} erros</span>
          </div>
          <div>\${reviewHtml}</div>
        </div>
      \`;

      const btnRestart = document.getElementById('vf-btn-restart-' + instanceKey);
      if (btnRestart) btnRestart.onclick = restartAll;

      const btnRetryWrong = document.getElementById('vf-btn-retry-wrong-' + instanceKey);
      if (btnRetryWrong) btnRetryWrong.onclick = retryWrong;
    }

    function restartAll() {
      currentIndex = 0;
      score = 0;
      revealed = false;
      answersRecord = [];
      activeQuestions = quiz.shuffleQuestions
        ? [...quiz.questions].sort(() => Math.random() - 0.5)
        : [...quiz.questions];
      renderQuestion();
    }

    function retryWrong() {
      const wrong = answersRecord.filter(a => !a.isCorrect).map(a => a.question);
      if (wrong.length === 0) return;
      activeQuestions = wrong;
      currentIndex = 0;
      score = 0;
      revealed = false;
      answersRecord = [];
      renderQuestion();
    }

    function playAudio(...frequencies) {
      try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) return;
        const ctx = new AudioContextClass();
        frequencies.forEach((f, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const start = ctx.currentTime + idx * 0.08;
          osc.frequency.setValueAtTime(f, start);
          gain.gain.setValueAtTime(0.12, start);
          gain.gain.exponentialRampToValueAtTime(0.001, start + 0.25);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(start);
          osc.stop(start + 0.25);
        });
      } catch (e) {}
    }

    function playFanfare() {
      try {
        const notes = [523, 659, 784, 1046];
        playAudio(...notes);
      } catch (e) {}
    }

    function triggerConfetti() {
      const canvas = document.getElementById('vf-confetti-' + instanceKey);
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const pieces = [];
      const colors = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
      for (let i = 0; i < 70; i++) {
        pieces.push({
          x: Math.random() * canvas.width,
          y: Math.random() * -canvas.height * 0.5,
          size: Math.random() * 8 + 4,
          speed: Math.random() * 3 + 2,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * 360,
          rotSpeed: Math.random() * 6 - 3,
        });
      }

      let frame = 0;
      function animate() {
        if (frame > 160) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          return;
        }
        frame++;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        pieces.forEach(p => {
          p.y += p.speed;
          p.rotation += p.rotSpeed;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          ctx.restore();
        });
        requestAnimationFrame(animate);
      }
      animate();
    }

    function escapeXml(unsafe) {
      if (!unsafe) return '';
      return String(unsafe).replace(/[<>&'"]/g, function (c) {
        switch (c) {
          case '<': return '&lt;';
          case '>': return '&gt;';
          case '&': return '&amp;';
          case "'": return '&#39;';
          case '"': return '&quot;';
          default: return c;
        }
      });
    }

    // Initialize first render
    renderQuestion();
  })();
</script>
</body>
</html>`;
}

function escapeHtml(text: string): string {
  if (!text) return '';
  return text.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case "'": return '&#39;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}
