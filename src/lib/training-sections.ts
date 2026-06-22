const SECTION_PREFIX = "__GRCC_SECTION_V1__";

export interface ParsedTrainingSection {
  title: string;
  items: string[];
  itemsText: string;
}

function parseLines(text: string) {
  return text
    .split("\n")
    .map((line) => line.replace(/^[-•*]\s*/, "").trim())
    .filter(Boolean);
}

export function parseTrainingSection(raw: string | null | undefined, fallbackTitle: string): ParsedTrainingSection {
  if (!raw) return { title: fallbackTitle, items: [], itemsText: "" };

  if (raw.startsWith(SECTION_PREFIX)) {
    try {
      const parsed = JSON.parse(raw.slice(SECTION_PREFIX.length)) as { title?: string; items?: string[] };
      const items = Array.isArray(parsed.items)
        ? parsed.items.map((item) => String(item).trim()).filter(Boolean)
        : [];
      return {
        title: parsed.title?.trim() || fallbackTitle,
        items,
        itemsText: items.join("\n"),
      };
    } catch {
      // Fall through to legacy plain-text parsing.
    }
  }

  const items = parseLines(raw);
  return { title: fallbackTitle, items, itemsText: items.join("\n") };
}

export function serializeTrainingSection(title: string, itemsText: string, fallbackTitle: string) {
  const items = parseLines(itemsText);
  if (items.length === 0) return null;

  return `${SECTION_PREFIX}${JSON.stringify({
    title: title.trim() || fallbackTitle,
    items,
  })}`;
}

export function serializeTrainingSectionDraft(title: string, itemsText: string, fallbackTitle: string) {
  return `${SECTION_PREFIX}${JSON.stringify({
    title: title.trim() || fallbackTitle,
    items: parseLines(itemsText),
  })}`;
}
