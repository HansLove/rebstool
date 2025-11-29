export function getNestedValue(obj: any, path: string): any {
  if (!obj || typeof obj !== 'object') return undefined;
  return path.split('.').reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), obj);
}