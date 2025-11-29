
export function countryToFlag(countryCode?: string): string {
    if (!countryCode) return "\ud83c\udff3\ufe0f";
    const trimmedCode = countryCode.trim().toUpperCase();
    if (trimmedCode.length !== 2) return trimmedCode || "\ud83c\udff3\ufe0f";
    return trimmedCode
      .split("")
      .map((char) => String.fromCodePoint(char.charCodeAt(0) + 127397))
      .join("");
  }