/**
 * Normalize user-entered challenge answers before comparison.
 * Handles casing, whitespace, and Unicode differences without accepting wrong answers.
 */
export function normalizeAnswer(value: string): string {
  return value
    .normalize("NFKC")
    .replace(/\u0640/g, "") // Arabic tatweel
    .replace(/[\u200B-\u200D\uFEFF]/g, "") // zero-width chars
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

export function answersMatch(input: string, expected: string): boolean {
  return normalizeAnswer(input) === normalizeAnswer(expected);
}
