export function parsePhotos(value: string | string[] | null | undefined): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === "string") : [];
  } catch {
    return value ? [value] : [];
  }
}

export function serializePhotos(photos: string[]): string {
  return JSON.stringify(photos);
}
