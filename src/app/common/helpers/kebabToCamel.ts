export function kebabToCamel(kebabCaseStr: string): string {
  return kebabCaseStr.replace(/-([a-z])/g, (_, match) => match.toUpperCase());
}
