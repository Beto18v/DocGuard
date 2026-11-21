/**
 * DocGuard — Filters & Structural Line Processors
 * Eliminates false positives from academic cover pages, tables of contents,
 * SENA / University institutional headers, and mathematical formulas.
 */

export interface ParsedSentence {
  raw: string;
  words: string[];
  wordCount: number;
}

const SKIP_PATTERNS = [
  /^(SERVICIO NACIONAL|Programa:|Aprendiz:|Actividad de|Evidencia de|Competencia:|Resultado de)/i,
  /^(Facultad\s+de|Corporaci[oó]n\s+Universitaria|Universidad|Ingenier[íi]a\s+de|Docente\s+Tutor|Tutor:|Sustentaci[oó]n|ID\s+Banner|Autor\(es\)?|Estudiante:|Bogot[áa]\s+D\.?C\.?|Noviembre\s+de\s+\d{4})/i,
  /^(Tabla|Table|Figura|Figure|Gráfico|Chart)\s*\d/i,
  /^\d+[\.]\s*$/,
  /^[A-ZÁÉÍÓÚÑ\s\(\)\-]{3,150}$/, // All-caps headers y títulos institucionales
  /^(ÍNDICE|INDICE|TABLA DE CONTENIDO|TABLE OF CONTENTS)\b/i, // Encabezado de índice
  /(?:\.{2,}|\s{2,})\s*\d+\s*$/, // Líneas de índice con puntos y número de página
  /^(Reporte\s+T[ée]cnico|Aplicaci[oó]n\s+ABP|Proyecto\s+de\s+Aula|Trabajo\s+de\s+Grado)\b/i,
];

/**
 * Determina si una línea estructural (portada, índice, encabezados SENA/Universidad)
 * debe ser omitida del análisis para evitar falsos positivos estilo Turnitin.
 */
export function shouldSkipStructuralLine(trimmedBlock: string): boolean {
  if (!trimmedBlock) return true;
  return SKIP_PATTERNS.some((p) => p.test(trimmedBlock)) || /(?:\.{2,}|\s{2,})\s*\d+\s*$/.test(trimmedBlock);
}

/**
 * Detecta si una oración es principalmente una fórmula matemática, ecuación
 * o línea de cálculo numérico, para evitar falsos positivos con tablas de números o NASCAR.
 */
export function isMathOrFormula(rawSentence: string): boolean {
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

/**
 * Divide el texto plano en oraciones válidas para análisis, descartando
 * referencias bibliográficas, fórmulas matemáticas y líneas estructurales.
 */
export function splitSentences(
  rawText: string,
  tokenizeFn: (text: string) => string[]
): ParsedSentence[] {
  // Remove references section (ES + EN)
  const withoutRefs = (rawText || "").split(
    /(?:Referencias\s+Bibliogr[áa]ficas|References|Bibliography|Works\s+Cited)/i
  )[0];
  const cleaned = withoutRefs.replace(/\r\n/g, "\n").trim();
  if (!cleaned) return [];

  const blocks = cleaned.split(/\n+/);
  const sentences: ParsedSentence[] = [];

  for (const block of blocks) {
    const trimmedBlock = block.trim();
    if (!trimmedBlock) continue;

    // Skip headers, institutional lines y entradas de índice
    if (shouldSkipStructuralLine(trimmedBlock)) continue;

    // Skip very short table-like rows (pipes, tabs, mostly numbers)
    if (trimmedBlock.includes("|") && trimmedBlock.split("|").length > 2) continue;

    // Temporarily protect common abbreviations from sentence splitting
    const protectedBlock = trimmedBlock
      .replace(/\b(Dr|Dra|Sr|Sra|Ing|Lic|Prof|Fig|vs|etc|núm|No|Art)\.\s/g, (_, abbr) => `${abbr}\u2060 `)
      .replace(/\b([A-Z])\.\s/g, "$1\u2060 ");

    const parts = protectedBlock.split(/(?<=[.!?])\s+/);
    for (const part of parts) {
      const sentence = part.trim().replace(/\u2060/g, "."); // restore dots

      // Descartar fórmulas matemáticas y expresiones puramente numéricas
      if (isMathOrFormula(sentence)) continue;

      const words = tokenizeFn(sentence);
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
