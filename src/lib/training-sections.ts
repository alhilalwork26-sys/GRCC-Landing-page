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
      const parsed = JSON.parse(raw.slice(SECTION_PREFIX.length)) as { title?: string; items?: string[]; itemsText?: string };

      // Draft format (while editing): teks disimpan apa adanya, tanpa trim/filter,
      // supaya enter & spasi di ujung baris tidak langsung "dimakan" tiap ketikan.
      if (typeof parsed.itemsText === "string") {
        return {
          title: parsed.title ?? fallbackTitle,
          items: parseLines(parsed.itemsText),
          itemsText: parsed.itemsText,
        };
      }

      // Final saved format: sudah dibersihkan sekali saat disimpan.
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

// Dipakai saat mengetik (draft) — simpan title & itemsText apa adanya, tanpa
// trim/filter, supaya baris kosong (Enter) dan spasi di ujung baris tidak
// langsung hilang lagi di render berikutnya. Pembersihan baru terjadi saat
// serializeTrainingSection dipanggil pada proses Simpan.
export function serializeTrainingSectionDraft(title: string, itemsText: string, fallbackTitle: string) {
  return `${SECTION_PREFIX}${JSON.stringify({
    title: title || fallbackTitle,
    itemsText,
  })}`;
}
