(() => {
  "use strict";

  /* ═══════════════════════════════════════════════════════════
     DocGuard v2.0 — Side Panel Controller
     Zero dependencies · Zero API keys · Academic Originality Auditor
     ═══════════════════════════════════════════════════════════ */

  // ─── I18N Dictionary ───
  const I18N = {
    es: {
      sec1Title: "1. Documento activo",
      sec2Title: "2. Resultados de originalidad",
      statusLabel: "Estado",
      titleLabel: "Título",
      statusDetecting: "Detectando pestaña…",
      statusDetected: "Google Doc detectado",
      statusNoTab: "Sin pestaña activa",
      statusNotDoc: "No es un Google Doc",
      statusError: "Error al leer pestaña",
      refreshTitle: "Volver a detectar pestaña activa",
      analyzeBtn: "Analizar Google Doc actual",
      analyzingReading: "Leyendo Google Doc…",
      analyzingWeb: "Verificando web ({current}/{total})…",
      analyzingInternal: "Analizando repeticiones internas…",
      emptyState:
        'Pulsa <strong>Analizar Google Doc actual</strong> para auditar repeticiones internas y verificar coincidencias literales en la web automáticamente.',
      step1: "Abre tu Google Doc",
      step2: "Clic en Analizar",
      step3: "Copia el reporte",
      originalityLabel: "Originalidad",
      similarityLabel: "Similitud",
      riskLow: "Riesgo bajo · Originalidad alta",
      riskMedium: "Precaución · Similitud moderada",
      riskHigh: "Alerta · Similitud elevada",
      statSentences: "Oraciones",
      statWebMatches: "Coinc. web",
      statInternal: "Rep. interna",
      matchesTitle: "Hallazgos detectados",
      noMatches:
        "Sin coincidencias literales en la web ni repeticiones internas significativas.",
      copyReport: "📋 Copiar reporte",
      copyDone: "✓ Copiado",
      externalMatch: "Coincidencia web",
      internalRepeat: "Repetición interna (Oración #{n})",
      openSource: "Abrir fuente coincidente ↗",
      words: "palabras",
      untitledDoc: "Documento sin título",
      errorInsufficientSentences:
        "El documento no contiene suficientes oraciones completas de texto para analizar.",
      errorGeneric: "Ocurrió un error al analizar el documento.",
      errorSwAsleep: "El servicio está iniciando. Por favor, reintenta en un momento.",
      errorRateLimited: "El motor web limitó las consultas. Análisis completado parcialmente.",
      footerText: "Desarrollado por",
      verdictLabel: "Veredicto",
      verdictSublabel: "Recomendación",
      verdictSafeBadge: "🟢 LISTO PARA ENTREGAR",
      verdictSafeTitle: "Aprobado para entrega académica",
      verdictSafeDesc: "Rango seguro estándar (0% - 20%). Alta originalidad y baja similitud externa. Seguro para Turnitin.",
      verdictCautionBadge: "🟡 SIMILITUD MODERADA",
      verdictCautionTitle: "Rango técnico aceptable (21% - 35%)",
      verdictCautionDesc: "Común en informes técnicos y marco teórico. Se recomienda verificar citas textuales antes de entregar.",
      verdictDangerBadge: "🔴 SIMILITUD ELEVADA (> 35%)",
      verdictDangerTitle: "Revisión previa recomendada",
      verdictDangerDesc: "Se detectaron múltiples coincidencias web considerables. Existe riesgo de observación docente si no se parafrasea.",
      filterAll: "Todos",
      filterWeb: "Web",
      filterInternal: "Internos",
      sourcesTitle: "Bases de consulta activas",
      sourcesDesc: "Verificación multi-fuente en tiempo real sin almacenamiento en servidores externos (100% privado).",
      sourceWikiDetail: "Enciclopedia global y definiciones conceptuales (ES / EN)",
      sourceOpenAlexDetail: "+250M de papers, journals y literatura científica indexada",
      sourceLocalDetail: "Shingling 5-gram + Jaccard para redundancia interna",
      reportTitle: "═══ REPORTE DOCGUARD ═══",
      reportDate: "Fecha",
      reportDoc: "Documento",
      reportOriginality: "Índice de originalidad",
      reportSimilarity: "Similitud detectada",
      reportSentencesAnalyzed: "Oraciones analizadas",
      reportWebMatches: "Coincidencias web",
      reportInternalRepeats: "Repeticiones internas",
      reportFindings: "HALLAZGOS",
      reportNoFindings: "No se encontraron hallazgos.",
      reportGeneratedBy: "Generado por DocGuard v2.0 — 100% local, sin API keys",
    },
    en: {
      sec1Title: "1. Active Document",
      sec2Title: "2. Originality Results",
      statusLabel: "Status",
      titleLabel: "Title",
      statusDetecting: "Detecting tab…",
      statusDetected: "Google Doc detected",
      statusNoTab: "No active tab",
      statusNotDoc: "Not a Google Doc",
      statusError: "Error reading tab",
      refreshTitle: "Re-detect active tab",
      analyzeBtn: "Analyze current Google Doc",
      analyzingReading: "Reading Google Doc…",
      analyzingWeb: "Checking web ({current}/{total})…",
      analyzingInternal: "Analyzing internal repetitions…",
      emptyState:
        'Press <strong>Analyze current Google Doc</strong> to audit internal repetitions and verify literal web matches automatically.',
      step1: "Open your Google Doc",
      step2: "Click Analyze",
      step3: "Copy report",
      originalityLabel: "Originality",
      similarityLabel: "Similarity",
      riskLow: "Low risk · High originality",
      riskMedium: "Caution · Moderate similarity",
      riskHigh: "Alert · High similarity",
      statSentences: "Sentences",
      statWebMatches: "Web matches",
      statInternal: "Int. repeats",
      matchesTitle: "Findings detected",
      noMatches:
        "No literal web matches or significant internal repetitions found.",
      copyReport: "📋 Copy report",
      copyDone: "✓ Copied",
      externalMatch: "Web match",
      internalRepeat: "Internal repetition (Sentence #{n})",
      openSource: "Open matching source ↗",
      words: "words",
      untitledDoc: "Untitled document",
      errorInsufficientSentences:
        "The document does not contain enough complete text sentences to analyze.",
      errorGeneric: "An error occurred while analyzing the document.",
      errorSwAsleep: "The service is starting up. Please try again in a moment.",
      errorRateLimited: "Web engine rate-limited requests. Analysis completed partially.",
      footerText: "Developed by",
      verdictLabel: "Verdict",
      verdictSublabel: "Recommendation",
      verdictSafeBadge: "🟢 READY TO SUBMIT",
      verdictSafeTitle: "Approved for academic submission",
      verdictSafeDesc: "Standard safe range (0% - 20%). High originality and low external similarity. Safe for Turnitin.",
      verdictCautionBadge: "🟡 MODERATE SIMILARITY",
      verdictCautionTitle: "Acceptable technical range (21% - 35%)",
      verdictCautionDesc: "Common in technical reports and literature reviews. Double-check direct quotes before submitting.",
      verdictDangerBadge: "🔴 HIGH SIMILARITY (> 35%)",
      verdictDangerTitle: "Prior revision recommended",
      verdictDangerDesc: "Multiple considerable web matches detected. Risk of academic penalty unless paraphrased or quoted.",
      filterAll: "All",
      filterWeb: "Web",
      filterInternal: "Internal",
      sourcesTitle: "Active Knowledge Engines",
      sourcesDesc: "Real-time multi-source verification with zero external storage (100% private).",
      sourceWikiDetail: "Global encyclopedia & conceptual domain definitions (ES / EN)",
      sourceOpenAlexDetail: "250M+ scientific papers, journals & academic literature",
      sourceLocalDetail: "5-gram shingling + Jaccard similarity for internal redundancy",
      reportTitle: "═══ DOCGUARD REPORT ═══",
      reportDate: "Date",
      reportDoc: "Document",
      reportOriginality: "Originality index",
      reportSimilarity: "Detected similarity",
      reportSentencesAnalyzed: "Sentences analyzed",
      reportWebMatches: "Web matches",
      reportInternalRepeats: "Internal repetitions",
      reportFindings: "FINDINGS",
      reportNoFindings: "No findings detected.",
      reportGeneratedBy: "Generated by DocGuard v2.0 — 100% local, no API keys",
    },
  };

  // ─── State ───
  let currentLang = localStorage.getItem("docguard_lang") || "es";
  let lastResult = null;
  let currentAnalysisToken = 0;
  let currentFilter = "all";

  const state = {
    activeDocId: null,
    activeDocTitle: null,
    isAnalyzing: false,
  };

  // ─── i18n helper ───
  function t(key, replacements) {
    let str = (I18N[currentLang] && I18N[currentLang][key]) || key;
    if (replacements) {
      for (const [k, v] of Object.entries(replacements)) {
        str = str.replace(`{${k}}`, v);
      }
    }
    return str;
  }

  function applyI18N() {
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const val = t(key);
      if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
        el.placeholder = val;
      } else {
        el.innerHTML = val;
      }
    });
    document.querySelectorAll("[data-i18n-title]").forEach((el) => {
      el.title = t(el.getAttribute("data-i18n-title"));
    });
    const langLabel = document.getElementById("lang-label");
    if (langLabel) langLabel.textContent = currentLang.toUpperCase();
  }

  // ─── Theme ───
  function getPreferredTheme() {
    const stored = localStorage.getItem("docguard_theme");
    if (stored) return stored;
    return window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark";
  }

  function applyTheme(theme) {
    document.documentElement.classList.add("theme-transitioning");
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("docguard_theme", theme);
    const sunIcon = document.getElementById("theme-icon-sun");
    const moonIcon = document.getElementById("theme-icon-moon");
    const boltIcon = document.getElementById("theme-icon-bolt");

    if (sunIcon) sunIcon.classList.add("hidden");
    if (moonIcon) moonIcon.classList.add("hidden");
    if (boltIcon) boltIcon.classList.add("hidden");

    if (theme === "light") {
      if (sunIcon) sunIcon.classList.remove("hidden");
    } else if (theme === "neobrutalism") {
      if (boltIcon) boltIcon.classList.remove("hidden");
    } else {
      if (moonIcon) moonIcon.classList.remove("hidden");
    }

    requestAnimationFrame(() => {
      setTimeout(() => {
        document.documentElement.classList.remove("theme-transitioning");
      }, 300);
    });
  }

  // ─── Constants ───
  const DOC_URL_REGEX =
    /^https:\/\/docs\.google\.com\/document\/d\/([a-zA-Z0-9_-]+)/;
  const SHINGLE_SIZE = 5;
  const MAX_SAMPLE_SENTENCES = 35;
  const MIN_WORDS_FOR_WEB = 8;
  const MIN_WORDS_FOR_INTERNAL = 8;
  const WEB_SNIPPET_SIZE = 7;
  const INTERNAL_THRESHOLD = 0.65;

  // ─── Stopwords (ES + EN) ───
  const STOPWORDS = new Set([
    // Spanish
    "a","al","algo","algunas","algunos","ante","antes","como","con","contra",
    "cual","cuando","de","del","desde","donde","dos","el","ella","ellas",
    "ellos","en","entre","era","es","esa","esas","ese","eso","esos","esta",
    "estaba","estado","estan","estar","estas","este","esto","estos","fue",
    "fueron","ha","han","hasta","hay","la","las","le","les","lo","los","mas",
    "me","mi","mis","mucho","muy","no","nos","nuestra","nuestro","o","otra",
    "otro","para","pero","por","porque","que","quien","se","sea","segun",
    "ser","si","sin","sobre","son","su","sus","tambien","te","tiene","tienen",
    "todo","todos","tu","tus","un","una","uno","unos","y","ya","yo",
    // English
    "a","an","the","and","or","but","in","on","at","to","for","of","with",
    "by","from","is","it","its","are","was","were","be","been","being","have",
    "has","had","do","does","did","will","would","shall","should","may","might",
    "can","could","this","that","these","those","i","you","he","she","we","they",
    "me","him","her","us","them","my","your","his","our","their","not","no",
    "so","if","as","just","than","then","also","very","much","more","most",
  ]);

  // ─── DOM refs ───
  const $ = (id) => document.getElementById(id);
  const docStatusText = $("doc-status-text");
  const docTitleText = $("doc-title-text");
  const docIdText = $("doc-id-text");
  const refreshTabBtn = $("refresh-tab-btn");
  const analyzeBtn = $("analyze-btn");
  const errorBanner = $("error-banner");
  const analyzedWordCount = $("analyzed-word-count");
  const resultsEmpty = $("results-empty");
  const resultsContainer = $("results-container");
  const scoreCard = $("score-card");
  const originalityPct = $("originality-pct");
  const similarityPct = $("similarity-pct");
  const similarityBar = $("similarity-bar");
  const ringFill = $("ring-fill");
  const trafficLabel = $("traffic-label");
  const verdictCard = $("verdict-card");
  const verdictBadge = $("verdict-badge");
  const verdictTitle = $("verdict-title");
  const verdictDesc = $("verdict-desc");
  const statSentences = $("stat-sentences");
  const statExternal = $("stat-external");
  const statInternal = $("stat-internal");
  const matchesCount = $("matches-count");
  const filterAllCount = $("filter-all-count");
  const filterWebCount = $("filter-web-count");
  const filterIntCount = $("filter-int-count");
  const noMatchesBox = $("no-matches-box");
  const matchesList = $("matches-list");
  const copyReportBtn = $("copy-report-btn");
  const langToggle = $("lang-toggle");
  const themeToggle = $("theme-toggle");

  // ─── NLP Utilities ───
  function normalizeText(text) {
    return (text || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\p{L}\p{N}\s]/gu, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function tokenizeWords(text) {
    const normalized = normalizeText(text);
    return normalized ? normalized.split(" ") : [];
  }

  /**
   * Detecta si una oración es principalmente una fórmula matemática, ecuación
   * o línea de cálculo numérico, para evitar falsos positivos con tablas de números o NASCAR.
   */
  function isMathOrFormula(rawSentence) {
    if (!rawSentence) return true;
    const trimmed = rawSentence.trim();

    // 1. Conteo de símbolos matemáticos explícitos
    const mathSymbolsCount = (trimmed.match(/[=+\-*/^<>±≈≠≤≥∑∫√∂%]/g) || []).length;
    const tokens = trimmed.split(/\s+/);
    if (tokens.length === 0) return true;

    // Palabras léxicas reales (letras de 3+ caracteres, ignorando puntuación)
    const realWords = tokens.filter((t) => /^[\p{L}]{3,}$/u.test(t.replace(/[.,;:()]/g, "")));

    // Si tiene símbolos matemáticos y menos de 4 palabras reales, es una fórmula/operación
    if (mathSymbolsCount >= 1 && realWords.length < 4) return true;

    // Si más del 35% de los caracteres son dígitos, paréntesis o símbolos algebraicos
    const nonAlphaChars = (trimmed.match(/[\d=+\-*/^<>()[\]{}_]/g) || []).length;
    if (nonAlphaChars / trimmed.length > 0.35 && realWords.length < 5) return true;

    // Patrones algebraicos clásicos: det(A), Menor N:, Ecuación N:, x1 = ...
    if (/^(det\(|Menor\s*\d+:|Ecuaci[oó]n\s*\d+:|Sustituci[oó]n\s*de|\([0-9]+\)\([0-9]+\))/i.test(trimmed)) {
      if (realWords.length < 5) return true;
    }

    return false;
  }

  function splitSentences(rawText) {
    // Remove references section (ES + EN)
    const withoutRefs = (rawText || "").split(
      /(?:Referencias\s+Bibliogr[áa]ficas|References|Bibliography|Works\s+Cited)/i
    )[0];
    const cleaned = withoutRefs.replace(/\r\n/g, "\n").trim();
    if (!cleaned) return [];

    const blocks = cleaned.split(/\n+/);
    const sentences = [];

    // Patterns to skip (institutional headers, cover page data, table of contents, short rows)
    const SKIP_PATTERNS = [
      /^(SERVICIO NACIONAL|Programa:|Aprendiz:|Actividad de|Evidencia de|Competencia:|Resultado de)/i,
      /^(Facultad\s+de|Corporaci[oó]n\s+Universitaria|Universidad|Ingenier[íi]a\s+de|Docente\s+Tutor|Tutor:|Sustentaci[oó]n|ID\s+Banner|Autor\(es\)?|Estudiante:|Bogot[áa]\s+D\.?C\.?|Noviembre\s+de\s+\d{4})/i,
      /^(Tabla|Table|Figura|Figure|Gráfico|Chart)\s*\d/i,
      /^\d+[\.]\s*$/,
      /^[A-ZÁÉÍÓÚÑ\s\(\)\-]{3,150}$/, // All-caps headers y títulos institucionales
      /^(ÍNDICE|INDICE|TABLA DE CONTENIDO|TABLE OF CONTENTS)\b/i, // Encabezado de índice
      /(?:\.{2,}|\s{2,})\s*\d+\s*$/, // Líneas de índice con puntos y número de página (ej. '... 4', '... 6')
    ];

    for (const block of blocks) {
      const trimmedBlock = block.trim();
      if (!trimmedBlock) continue;

      // Skip headers, institutional lines y entradas de índice
      if (SKIP_PATTERNS.some((p) => p.test(trimmedBlock))) continue;

      // Skip líneas con puntos de índice (ej. '3.4.1. Despeje... 6')
      if (/(?:\.{2,}|\s{2,})\s*\d+\s*$/.test(trimmedBlock)) continue;

      // Skip very short table-like rows (pipes, tabs, mostly numbers)
      if (trimmedBlock.includes("|") && trimmedBlock.split("|").length > 2) continue;

      // Temporarily protect common abbreviations from sentence splitting
      const protectedBlock = trimmedBlock
        .replace(/\b(Dr|Dra|Sr|Sra|Ing|Lic|Prof|Fig|vs|etc|núm|No|Art)\.\s/g,
          (_, abbr) => `${abbr}\u2060 `) // word-joiner as placeholder
        .replace(/\b([A-Z])\.\s/g, "$1\u2060 "); // single-letter initials

      const parts = protectedBlock.split(/(?<=[.!?])\s+/);
      for (const part of parts) {
        const sentence = part.trim().replace(/\u2060/g, "."); // restore dots

        // Descartar fórmulas matemáticas y expresiones puramente numéricas
        if (isMathOrFormula(sentence)) continue;

        const words = tokenizeWords(sentence);
        if (words.length >= 6) {
          sentences.push({
            raw: sentence,
            words,
            wordCount: words.length,
          });
        }
      }
    }
    return sentences;
  }

  /**
   * Stratified sampling: select up to MAX_SAMPLE_SENTENCES sentences
   * distributed proportionally across beginning, body, and conclusion.
   */
  function stratifiedSample(sentences, maxCount = MAX_SAMPLE_SENTENCES) {
    if (sentences.length <= maxCount) return sentences;

    const n = sentences.length;
    const third = Math.floor(n / 3);

    // Split into 3 strata
    const strata = [
      sentences.slice(0, third),                  // beginning
      sentences.slice(third, third * 2),           // body
      sentences.slice(third * 2),                  // conclusion
    ];

    const perStratum = Math.floor(maxCount / 3);
    const remainder = maxCount - perStratum * 3;

    const sampled = [];
    strata.forEach((stratum, idx) => {
      const count = perStratum + (idx < remainder ? 1 : 0);
      if (stratum.length <= count) {
        sampled.push(...stratum);
      } else {
        const step = stratum.length / count;
        for (let i = 0; i < count; i++) {
          sampled.push(stratum[Math.floor(i * step)]);
        }
      }
    });

    return sampled;
  }

  function buildShingles(words, size = SHINGLE_SIZE) {
    const shingles = new Set();
    if (words.length < size) return shingles;
    for (let i = 0; i <= words.length - size; i++) {
      shingles.add(words.slice(i, i + size).join(" "));
    }
    return shingles;
  }

  function buildTermFrequency(words) {
    const tf = new Map();
    const filtered = words.filter((w) => !STOPWORDS.has(w));
    const source = filtered.length > 0 ? filtered : words;
    for (const word of source) {
      tf.set(word, (tf.get(word) || 0) + 1);
    }
    return tf;
  }

  function cosineSimilarity(tfA, tfB) {
    if (tfA.size === 0 || tfB.size === 0) return 0;
    let dot = 0, magA = 0, magB = 0;
    for (const [term, countA] of tfA.entries()) {
      magA += countA * countA;
      const countB = tfB.get(term);
      if (countB) dot += countA * countB;
    }
    for (const countB of tfB.values()) {
      magB += countB * countB;
    }
    if (magA === 0 || magB === 0) return 0;
    return dot / (Math.sqrt(magA) * Math.sqrt(magB));
  }

  function computeShingleContainment(targetShingles, referenceShingles) {
    if (targetShingles.size === 0 || referenceShingles.size === 0) return 0;
    let hits = 0;
    for (const shingle of targetShingles) {
      if (referenceShingles.has(shingle)) hits++;
    }
    return hits / targetShingles.size;
  }

  /**
   * Calcula el veredicto y recomendación ejecutiva para saber si el trabajo
   * es seguro para entregar o si requiere parafraseo/revisión previa.
   */
  function computeVerdict(originalityPercent, externalMatchCount, internalRepeatCount) {
    const similarityPercent = 100 - originalityPercent;

    // 🟢 Seguro / Listo para entrega (Rango estándar universitario: Similitud <= 20% y <= 3 coincidencias web)
    if (similarityPercent <= 20 && externalMatchCount <= 3) {
      return {
        level: "safe",
        badge: t("verdictSafeBadge"),
        title: t("verdictSafeTitle"),
        desc: t("verdictSafeDesc"),
      };
    }
    // 🔴 Alerta / No recomendado subir aún (Similitud > 35% o >= 6 coincidencias web directas)
    if (similarityPercent > 35 || externalMatchCount >= 6) {
      return {
        level: "danger",
        badge: t("verdictDangerBadge"),
        title: t("verdictDangerTitle"),
        desc: t("verdictDangerDesc"),
      };
    }
    // 🟡 Precaución / Similitud moderada (Rango técnico aceptable: 21% - 35%)
    return {
      level: "caution",
      badge: t("verdictCautionBadge"),
      title: t("verdictCautionTitle"),
      desc: t("verdictCautionDesc"),
    };
  }

  // ─── UI Helpers ───
  function showError(message) {
    if (!message) {
      errorBanner.textContent = "";
      errorBanner.classList.add("hidden");
      return;
    }
    errorBanner.textContent = message;
    errorBanner.classList.remove("hidden");
  }

  function cleanGoogleDocTitle(rawTitle) {
    if (!rawTitle) return t("untitledDoc");
    return (
      rawTitle
        .replace(/\s*-\s*(Google\s+Docs|Documentos\s+de\s+Google)\s*$/i, "")
        .trim() || "Google Doc"
    );
  }

  function updateRing(percent) {
    const circumference = 2 * Math.PI * 52; // r=52
    const offset = circumference - (percent / 100) * circumference;
    ringFill.style.strokeDashoffset = String(offset);
  }

  // ─── Tab Detection ───
  async function detectActiveGoogleDoc() {
    // Si hay un análisis en curso, no interrumpir ni reiniciar el panel al cambiar de pestaña
    if (state.isAnalyzing) return;

    showError("");
    try {
      const tabs = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      const activeTab = tabs && tabs[0];

      if (!activeTab || !activeTab.url) {
        state.activeDocId = null;
        docStatusText.textContent = t("statusNoTab");
        docStatusText.className = "meta-value status-warn";
        docTitleText.textContent = "—";
        docIdText.textContent = "—";
        analyzeBtn.disabled = true;
        return;
      }

      const match = activeTab.url.match(DOC_URL_REGEX);
      if (!match) {
        state.activeDocId = null;
        docStatusText.textContent = t("statusNotDoc");
        docStatusText.className = "meta-value status-warn";
        docTitleText.textContent = activeTab.title || "—";
        docIdText.textContent = "—";
        analyzeBtn.disabled = true;
        return;
      }

      state.activeDocId = match[1];
      state.activeDocTitle = cleanGoogleDocTitle(activeTab.title);
      docStatusText.textContent = t("statusDetected");
      docStatusText.className = "meta-value status-ok";
      docTitleText.textContent = state.activeDocTitle;
      docTitleText.title = state.activeDocTitle;
      docIdText.textContent = state.activeDocId;
      docIdText.title = state.activeDocId;
      analyzeBtn.disabled = false;
    } catch (err) {
      state.activeDocId = null;
      docStatusText.textContent = t("statusError");
      docStatusText.className = "meta-value status-warn";
      showError(err.message);
    }
  }

  // ─── Filter Pills ───
  function applyFilter(filterType) {
    currentFilter = filterType;
    document.querySelectorAll(".filter-pill").forEach((pill) => {
      pill.classList.toggle("active", pill.getAttribute("data-filter") === filterType);
    });
    document.querySelectorAll(".match-item").forEach((item) => {
      const type = item.getAttribute("data-match-type");
      if (filterType === "all" || type === filterType) {
        item.classList.remove("hidden");
      } else {
        item.classList.add("hidden");
      }
    });
  }

  // ─── Render Results ───
  function renderResults(result) {
    lastResult = result;
    resultsEmpty.classList.add("hidden");
    resultsContainer.classList.remove("hidden");

    analyzedWordCount.textContent = `${result.totalWords} ${t("words")}`;
    originalityPct.textContent = `${result.originalityPercent}%`;
    similarityPct.textContent = `${result.similarityPercent}%`;
    similarityBar.style.width = `${result.similarityPercent}%`;
    updateRing(result.originalityPercent);

    // Score ring card styling
    scoreCard.classList.remove("level-green", "level-amber", "level-red");
    if (result.similarityPercent < 15) {
      scoreCard.classList.add("level-green");
      trafficLabel.textContent = t("riskLow");
    } else if (result.similarityPercent <= 30) {
      scoreCard.classList.add("level-amber");
      trafficLabel.textContent = t("riskMedium");
    } else {
      scoreCard.classList.add("level-red");
      trafficLabel.textContent = t("riskHigh");
    }

    // Submission Verdict Card
    const verdict = computeVerdict(
      result.originalityPercent,
      result.externalMatchCount,
      result.internalRepeatCount
    );
    result.verdict = verdict;

    if (verdictCard) {
      verdictCard.className = `verdict-card verdict-${verdict.level}`;
      if (verdictBadge) verdictBadge.textContent = verdict.badge;
      if (verdictTitle) verdictTitle.textContent = verdict.title;
      if (verdictDesc) verdictDesc.textContent = verdict.desc;
    }

    statSentences.textContent = String(result.sentenceCount);
    statExternal.textContent = String(result.externalMatchCount);
    statInternal.textContent = String(result.internalRepeatCount);
    matchesCount.textContent = String(result.flaggedMatches.length);

    // Filter counts
    const webCount = result.flaggedMatches.filter((m) => m.type === "web").length;
    const intCount = result.flaggedMatches.filter((m) => m.type === "internal").length;
    if (filterAllCount) filterAllCount.textContent = `(${result.flaggedMatches.length})`;
    if (filterWebCount) filterWebCount.textContent = `(${webCount})`;
    if (filterIntCount) filterIntCount.textContent = `(${intCount})`;

    matchesList.innerHTML = "";

    if (result.flaggedMatches.length === 0) {
      noMatchesBox.classList.remove("hidden");
      matchesList.classList.add("hidden");
      copyReportBtn.classList.remove("hidden");
      return;
    }

    noMatchesBox.classList.add("hidden");
    matchesList.classList.remove("hidden");
    copyReportBtn.classList.remove("hidden");

    result.flaggedMatches.forEach((match) => {
      const li = document.createElement("li");
      li.className = "match-item";
      li.setAttribute("data-match-type", match.type || "internal");

      const topDiv = document.createElement("div");
      topDiv.className = "match-top";

      const originSpan = document.createElement("span");
      originSpan.className = "match-origin";
      originSpan.textContent = match.sourceLabel;

      const scoreSpan = document.createElement("span");
      scoreSpan.className = `match-score ${match.scorePct >= 75 ? "high" : "medium"}`;
      scoreSpan.textContent = `${match.scorePct}%`;

      topDiv.appendChild(originSpan);
      topDiv.appendChild(scoreSpan);

      const quoteP = document.createElement("p");
      quoteP.className = "match-quote";
      quoteP.textContent = match.text;

      li.appendChild(topDiv);
      li.appendChild(quoteP);

      if (match.sourceUrl) {
        const link = document.createElement("a");
        link.href = match.sourceUrl;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.className = "match-link";
        link.textContent = t("openSource");
        li.appendChild(link);
      }

      matchesList.appendChild(li);
    });

    // Apply the active filter to the newly rendered list
    applyFilter(currentFilter);
  }

  // ─── Copy Report ───
  function buildReportText() {
    if (!lastResult) return "";
    const L = I18N[currentLang];
    const now = new Date().toLocaleString(currentLang === "es" ? "es-ES" : "en-US");
    const verdict = lastResult.verdict || computeVerdict(
      lastResult.originalityPercent,
      lastResult.externalMatchCount,
      lastResult.internalRepeatCount
    );

    const lines = [
      L.reportTitle,
      "",
      `${L.reportDate}: ${now}`,
      `${L.reportDoc}: ${state.activeDocTitle || "—"}`,
      "",
      `${L.verdictLabel}: [${verdict.badge}] ${verdict.title}`,
      `   ${verdict.desc}`,
      "",
      `${L.reportOriginality}: ${lastResult.originalityPercent}%`,
      `${L.reportSimilarity}: ${lastResult.similarityPercent}%`,
      `${L.reportSentencesAnalyzed}: ${lastResult.sentenceCount}`,
      `${L.reportWebMatches}: ${lastResult.externalMatchCount}`,
      `${L.reportInternalRepeats}: ${lastResult.internalRepeatCount}`,
      `${L.sourcesTitle}: Wikipedia (ES/EN), OpenAlex Academic (250M+ Papers), Local NLP Engine`,
      "",
    ];

    if (lastResult.flaggedMatches.length > 0) {
      lines.push(`── ${L.reportFindings} ──`);
      lines.push("");
      lastResult.flaggedMatches.forEach((m, i) => {
        lines.push(`${i + 1}. [${m.scorePct}%] [${(m.type || "").toUpperCase()}] ${m.sourceLabel}`);
        lines.push(`   "${m.text}"`);
        if (m.sourceUrl) lines.push(`   ${m.sourceUrl}`);
        lines.push("");
      });
    } else {
      lines.push(L.reportNoFindings);
      lines.push("");
    }

    lines.push("—");
    lines.push(L.reportGeneratedBy);
    return lines.join("\n");
  }

  async function handleCopyReport() {
    try {
      await navigator.clipboard.writeText(buildReportText());
      copyReportBtn.innerHTML = t("copyDone");
      setTimeout(() => {
        copyReportBtn.innerHTML = t("copyReport");
      }, 2000);
    } catch {
      // Fallback
      const ta = document.createElement("textarea");
      ta.value = buildReportText();
      ta.style.position = "fixed";
      ta.style.inset = "0";
      ta.style.opacity = "0";
      ta.style.pointerEvents = "none";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      let copied = false;
      try {
        copied = document.execCommand("copy");
      } catch {
        // Fallback silently failed
      }
      document.body.removeChild(ta);
      if (copied) {
        copyReportBtn.innerHTML = t("copyDone");
        setTimeout(() => { copyReportBtn.innerHTML = t("copyReport"); }, 2000);
      }
    }
  }

  // ─── Analysis Engine ───
  async function handleAnalyze() {
    if (state.isAnalyzing || !state.activeDocId) return;

    const myToken = ++currentAnalysisToken;

    showError("");
    state.isAnalyzing = true;
    analyzeBtn.disabled = true;
    analyzeBtn.textContent = t("analyzingReading");

    try {
      // 1. Fetch document text
      const docRes = await chrome.runtime.sendMessage({
        type: "FETCH_DOC_TEXT",
        docId: state.activeDocId,
      });

      if (!docRes || !docRes.ok) {
        throw new Error(docRes?.error || t("errorGeneric"));
      }

      // 2. Parse sentences (filtrando fórmulas y matemáticas)
      const allSentences = splitSentences(docRes.text);
      const totalWords = allSentences.reduce((sum, s) => sum + s.wordCount, 0);

      if (allSentences.length === 0) {
        throw new Error(t("errorInsufficientSentences"));
      }

      // 3. Stratified sampling for web check (hasta 35 oraciones representativas)
      const sampledSentences = stratifiedSample(allSentences, MAX_SAMPLE_SENTENCES);

      // 4. Prepare all sentences for internal analysis
      const preparedAll = allSentences.map((s, idx) => ({
        index: idx,
        raw: s.raw,
        words: s.words,
        wordCount: s.wordCount,
        shingles: buildShingles(s.words, SHINGLE_SIZE),
        tf: buildTermFrequency(s.words),
      }));

      // Map sampled sentences to their prepared versions
      const sampledSet = new Set(sampledSentences.map((s) => s.raw));
      const preparedSampled = preparedAll.filter((p) => sampledSet.has(p.raw));

      const flaggedMatches = [];
      let internalRepeatCount = 0;
      let externalMatchCount = 0;
      let weightedSimilarityWords = 0;

      // Progress update before synchronous NLP loop
      analyzeBtn.textContent = t("analyzingInternal");
      await new Promise((r) => setTimeout(r, 0));

      // 5. Internal repetition detection (oraciones de prosa >= MIN_WORDS_FOR_INTERNAL)
      for (let i = 0; i < preparedAll.length; i++) {
        const docSent = preparedAll[i];
        if (docSent.words.length < MIN_WORDS_FOR_INTERNAL) continue;

        let bestInternalScore = 0;
        let repeatedWithIndex = -1;

        for (let j = 0; j < preparedAll.length; j++) {
          if (i === j) continue;
          const other = preparedAll[j];
          if (other.words.length < MIN_WORDS_FOR_INTERNAL) continue;

          const sentShingle = computeShingleContainment(
            docSent.shingles,
            other.shingles
          );
          const cos = cosineSimilarity(docSent.tf, other.tf);
          const combined = Math.max(sentShingle, cos);
          if (combined >= INTERNAL_THRESHOLD && combined > bestInternalScore) {
            bestInternalScore = combined;
            repeatedWithIndex = j;
          }
        }

        if (bestInternalScore >= INTERNAL_THRESHOLD) {
          internalRepeatCount++;
          weightedSimilarityWords +=
            docSent.wordCount * (bestInternalScore * 0.45);
          flaggedMatches.push({
            type: "internal",
            sourceLabel: t("internalRepeat", { n: repeatedWithIndex + 1 }),
            scorePct: Math.min(100, Math.round(bestInternalScore * 100)),
            text: docSent.raw,
            sourceUrl: "",
          });
        }
      }

      // 6. Web verification across Wikipedia & OpenAlex
      const webCandidates = preparedSampled.filter(
        (s) => s.raw.split(/\s+/).length >= MIN_WORDS_FOR_WEB
      );

      for (let k = 0; k < webCandidates.length; k++) {
        analyzeBtn.textContent = t("analyzingWeb", {
          current: k + 1,
          total: webCandidates.length,
        });

        const rawWords = webCandidates[k].raw.split(/\s+/);
        const start = Math.max(
          0,
          Math.floor((rawWords.length - WEB_SNIPPET_SIZE) / 2)
        );
        const snippet = rawWords
          .slice(start, start + WEB_SNIPPET_SIZE)
          .join(" ");

        // Exigir que el snippet contenga al menos 4 palabras léxicas reales (no stopwords/conectores)
        const lexicalWords = snippet.split(/\s+/).filter((w) => {
          const clean = w.toLowerCase().replace(/[^\p{L}]/gu, "");
          return clean.length >= 3 && !STOPWORDS.has(clean);
        });
        if (lexicalWords.length < 4) continue;

        // Rate limit: 120ms between requests for fast responsive auditing
        await new Promise((r) => setTimeout(r, 120));

        if (myToken !== currentAnalysisToken) return;

        const webCheck = await chrome.runtime.sendMessage({
          type: "CHECK_WEB_PHRASE",
          phrase: snippet,
          lang: currentLang,
        }).catch(() => null);

        if (myToken !== currentAnalysisToken) return;

        if (webCheck && webCheck.ok && webCheck.matched) {
          externalMatchCount++;
          weightedSimilarityWords += webCandidates[k].wordCount;
          const matchLabel = webCheck.sourceTitle
            ? `${t("externalMatch")} · ${webCheck.sourceTitle}`
            : t("externalMatch");
          flaggedMatches.push({
            type: "web",
            sourceLabel: matchLabel,
            scorePct: 100,
            text: `"${snippet}" — ${webCandidates[k].raw}`,
            sourceUrl: webCheck.sourceUrl || "",
          });
        } else if (webCheck && !webCheck.ok && webCheck.error === "rate_limited") {
          showError(t("errorRateLimited"));
        }
      }

      // 7. Compute scores
      const similarityPercent = Math.max(
        0,
        Math.min(
          100,
          totalWords > 0
            ? Math.round((weightedSimilarityWords / totalWords) * 100)
            : 0
        )
      );
      const originalityPercent = 100 - similarityPercent;

      renderResults({
        totalWords,
        sentenceCount: preparedAll.length,
        externalMatchCount,
        internalRepeatCount,
        similarityPercent,
        originalityPercent,
        flaggedMatches,
      });
    } catch (err) {
      const msg = err?.message || "";
      if (msg.includes("Could not establish connection") || msg.includes("Extension context invalidated")) {
        showError(t("errorSwAsleep"));
      } else {
        showError(msg || t("errorGeneric"));
      }
    } finally {
      state.isAnalyzing = false;
      analyzeBtn.disabled = false;
      analyzeBtn.textContent = t("analyzeBtn");
    }
  }

  // ─── Event Listeners ───
  refreshTabBtn.addEventListener("click", detectActiveGoogleDoc);
  analyzeBtn.addEventListener("click", handleAnalyze);
  copyReportBtn.addEventListener("click", handleCopyReport);

  // Filter Pills listener
  document.querySelectorAll(".filter-pill").forEach((pill) => {
    pill.addEventListener("click", () => {
      applyFilter(pill.getAttribute("data-filter"));
    });
  });

  langToggle.addEventListener("click", () => {
    currentLang = currentLang === "es" ? "en" : "es";
    localStorage.setItem("docguard_lang", currentLang);
    applyI18N();
    if (lastResult) renderResults(lastResult);
  });

  themeToggle.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme") || "dark";
    let nextTheme = "dark";
    if (current === "dark") nextTheme = "light";
    else if (current === "light") nextTheme = "neobrutalism";
    else nextTheme = "dark";
    applyTheme(nextTheme);
  });

  if (chrome.tabs && chrome.tabs.onActivated) {
    chrome.tabs.onActivated.addListener(detectActiveGoogleDoc);
  }
  if (chrome.tabs && chrome.tabs.onUpdated) {
    chrome.tabs.onUpdated.addListener((_tabId, changeInfo, tab) => {
      if (
        tab &&
        tab.active &&
        (changeInfo.url || changeInfo.title || changeInfo.status === "complete")
      ) {
        detectActiveGoogleDoc();
      }
    });
  }

  // ─── Init ───
  applyTheme(getPreferredTheme());
  applyI18N();
  detectActiveGoogleDoc();
})();
