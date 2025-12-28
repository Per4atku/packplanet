/**
 * Calculate the Levenshtein Distance between two strings
 * Returns the minimum number of single-character edits needed to change one string into another
 */
export function levenshteinDistance(str1: string, str2: string): number {
  const s1 = str1.toLowerCase();
  const s2 = str2.toLowerCase();

  const len1 = s1.length;
  const len2 = s2.length;

  // Create a 2D array to store distances
  const matrix: number[][] = Array(len1 + 1)
    .fill(null)
    .map(() => Array(len2 + 1).fill(0));

  // Initialize first column and row
  for (let i = 0; i <= len1; i++) {
    matrix[i][0] = i;
  }
  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j;
  }

  // Fill in the rest of the matrix
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1, // deletion
        matrix[i][j - 1] + 1, // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );
    }
  }

  return matrix[len1][len2];
}

/**
 * Calculate similarity score between two strings (0-1, where 1 is perfect match)
 */
export function similarityScore(str1: string, str2: string): number {
  const maxLen = Math.max(str1.length, str2.length);
  if (maxLen === 0) return 1;

  const distance = levenshteinDistance(str1, str2);
  return 1 - distance / maxLen;
}

/**
 * Check if a string contains the search term or is similar enough (fuzzy match)
 */
export function fuzzyMatch(
  text: string,
  search: string,
  threshold: number = 0.6
): { matches: boolean; score: number } {
  const textLower = text.toLowerCase();
  const searchLower = search.toLowerCase();

  // Exact substring match gets highest priority
  if (textLower.includes(searchLower)) {
    return { matches: true, score: 1 };
  }

  // Calculate similarity for the whole string
  const wholeStringSimilarity = similarityScore(textLower, searchLower);

  // Also check similarity with each word in the text
  const words = textLower.split(/\s+/);
  const wordSimilarities = words.map((word) =>
    similarityScore(word, searchLower)
  );
  const bestWordSimilarity = Math.max(...wordSimilarities, 0);

  // Use the best score between whole string and individual words
  const score = Math.max(wholeStringSimilarity, bestWordSimilarity);

  return {
    matches: score >= threshold,
    score,
  };
}

/**
 * Score a product based on search term using fuzzy matching
 * Returns a score (0-1) where higher is better
 */
export function scoreProduct(
  product: { name: string; sku: string },
  search: string
): number {
  const nameMatch = fuzzyMatch(product.name, search);
  const skuMatch = fuzzyMatch(product.sku || "", search);

  // Prioritize name matches over SKU matches
  return Math.max(nameMatch.score * 1.0, skuMatch.score * 0.8);
}
