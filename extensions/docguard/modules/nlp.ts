/**
 * DocGuard — NLP & Similarity Engine
 * Provides shingles computation, containment, Jaccard similarity,
 * term frequency cosine distance, and stratified document sampling.
 */

export const SHINGLE_SIZE = 5;
export const MAX_SAMPLE_SENTENCES = 35;
export const MIN_WORDS_FOR_WEB = 8;
export const MIN_WORDS_FOR_INTERNAL = 8;
export const WEB_SNIPPET_SIZE = 7;
export const INTERNAL_THRESHOLD = 0.65;

export const STOPWORDS = new Set<string>([
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

export function normalizeText(text: string): string {
  return (text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function tokenizeWords(text: string): string[] {
  const normalized = normalizeText(text);
  return normalized ? normalized.split(" ") : [];
}

export function buildShingles(words: string[], size: number = SHINGLE_SIZE): Set<string> {
  const shingles = new Set<string>();
  if (words.length < size) return shingles;
  for (let i = 0; i <= words.length - size; i++) {
    shingles.add(words.slice(i, i + size).join(" "));
  }
  return shingles;
}

export function computeShingleContainment(target: Set<string>, ref: Set<string>): number {
  if (target.size === 0 || ref.size === 0) return 0;
  let hits = 0;
  for (const s of target) {
    if (ref.has(s)) hits++;
  }
  return hits / target.size;
}

export function jaccardSimilarity<T>(setA: Set<T>, setB: Set<T>): number {
  if (setA.size === 0 || setB.size === 0) return 0;
  let intersection = 0;
  for (const item of setA) {
    if (setB.has(item)) intersection++;
  }
  const union = setA.size + setB.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

export function buildTermFrequency(words: string[]): Map<string, number> {
  const tf = new Map<string, number>();
  const filtered = words.filter((w) => !STOPWORDS.has(w));
  const source = filtered.length > 0 ? filtered : words;
  for (const word of source) {
    tf.set(word, (tf.get(word) || 0) + 1);
  }
  return tf;
}

export function cosineSimilarity(tfA: Map<string, number>, tfB: Map<string, number>): number {
  if (tfA.size === 0 || tfB.size === 0) return 0;
  let dot = 0;
  let magA = 0;
  let magB = 0;

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

/**
 * Muestreo estratificado: selecciona hasta maxCount oraciones
 * distribuidas proporcionalmente entre inicio, desarrollo y conclusión.
 */
export function stratifiedSample<T>(items: T[], maxCount: number = MAX_SAMPLE_SENTENCES): T[] {
  if (items.length <= maxCount) return items;

  const n = items.length;
  const third = Math.floor(n / 3);

  const strata = [
    items.slice(0, third),
    items.slice(third, third * 2),
    items.slice(third * 2),
  ];

  const perStratum = Math.floor(maxCount / 3);
  const remainder = maxCount - perStratum * 3;

  const sampled: T[] = [];
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
