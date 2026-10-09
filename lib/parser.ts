/**
 * Utility functions for parsing and injecting dynamic variables in prompts.
 * Matches brackets like [Topic], [Audience], [actionName] and also {{variableName}}.
 */

// Regex matching [Variable Name] or {{variableName}}
const BRACKET_VAR_REGEX = /\[([a-zA-Z0-9_\s-]+)\]/g;
const CURLY_VAR_REGEX = /\{\{([a-zA-Z0-9_\s-]+)\}\}/g;

/**
 * Extracts unique variable names from prompt content.
 * e.g., "Write about [Topic] for [Audience]" -> ["Topic", "Audience"]
 */
export function extractVariables(content: string): string[] {
  if (!content) return [];
  const variables = new Set<string>();

  // Extract [Bracket] variables
  let match: RegExpExecArray | null;
  const bracketRegex = new RegExp(BRACKET_VAR_REGEX);
  while ((match = bracketRegex.exec(content)) !== null) {
    if (match[1]?.trim()) {
      variables.add(match[1].trim());
    }
  }

  // Extract {{Curly}} variables
  const curlyRegex = new RegExp(CURLY_VAR_REGEX);
  while ((match = curlyRegex.exec(content)) !== null) {
    if (match[1]?.trim()) {
      variables.add(match[1].trim());
    }
  }

  return Array.from(variables);
}

/**
 * Replaces bracket variables in content with user-supplied values.
 * If user hasn't provided a value, falls back to original bracket or placeholder.
 */
export function replaceVariables(
  content: string,
  values: Record<string, string>,
  preserveUnset: boolean = false
): string {
  if (!content) return "";
  let result = content;

  // Replace [Variable]
  result = result.replace(/\[([a-zA-Z0-9_\s-]+)\]/g, (fullMatch, varName) => {
    const key = varName.trim();
    if (values[key] && values[key].trim() !== "") {
      return values[key].trim();
    }
    return preserveUnset ? fullMatch : fullMatch;
  });

  // Replace {{Variable}}
  result = result.replace(/\{\{([a-zA-Z0-9_\s-]+)\}\}/g, (fullMatch, varName) => {
    const key = varName.trim();
    if (values[key] && values[key].trim() !== "") {
      return values[key].trim();
    }
    return preserveUnset ? fullMatch : fullMatch;
  });

  return result;
}
