export type RegexMapEntry<T> = {
  regex: RegExp;
  valueGenerator: (regexGroups: Record<string, string> | undefined) => T;
};

/**
 * A map that allows to match a string against a set of regular expressions
 */
export class RegexMap<T> {
  constructor(private readonly entries: RegexMapEntry<T>[] = []) {}

  hasMatch(str: string): boolean {
    return this.entries.some((entry) => entry.regex.test(str));
  }

  getMatch(str: string): T | null {
    const entry = this.entries.find((entry) => entry.regex.test(str));

    if (!entry) {
      return null;
    }

    const regexGroups = entry.regex.exec(str)?.groups;
    const computedValue = entry.valueGenerator(regexGroups);

    return computedValue;
  }
}
