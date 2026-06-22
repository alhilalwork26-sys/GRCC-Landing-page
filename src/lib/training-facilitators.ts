import { CustomField } from "@/lib/supabase";

export const TRAINING_FACILITATORS_FIELD_ID = "__grcc_training_facilitators";

export interface TrainingFacilitator {
  name: string;
  role: string;
  org: string;
  img: string | null;
  main?: boolean;
  showCv?: boolean;
}

function normalizeFacilitator(item: Partial<TrainingFacilitator>): TrainingFacilitator {
  return {
    name: String(item.name ?? ""),
    role: String(item.role ?? ""),
    org: String(item.org ?? ""),
    img: item.img ? String(item.img) : null,
    main: Boolean(item.main),
    showCv: item.showCv !== false,
  };
}

export function getPublicCustomFields(fields: CustomField[] | null | undefined) {
  return (fields ?? []).filter((field) => field.id !== TRAINING_FACILITATORS_FIELD_ID);
}

function hasFacilitatorContent(item: TrainingFacilitator) {
  return item.name.trim() || item.role.trim() || item.org.trim() || item.img;
}

export function getTrainingFacilitators(
  fields: CustomField[] | null | undefined,
  options?: { keepEmpty?: boolean }
): TrainingFacilitator[] {
  const field = (fields ?? []).find((item) => item.id === TRAINING_FACILITATORS_FIELD_ID);
  if (!field?.placeholder) return [];

  try {
    const parsed = JSON.parse(field.placeholder) as Partial<TrainingFacilitator>[];
    if (!Array.isArray(parsed)) return [];
    const normalized = parsed.map(normalizeFacilitator);
    return options?.keepEmpty ? normalized : normalized.filter(hasFacilitatorContent);
  } catch {
    return [];
  }
}

export function setTrainingFacilitators(
  fields: CustomField[] | null | undefined,
  facilitators: TrainingFacilitator[],
  options?: { keepEmpty?: boolean }
): CustomField[] {
  const publicFields = getPublicCustomFields(fields);
  const normalized = facilitators.map(normalizeFacilitator);
  const cleanFacilitators = options?.keepEmpty
    ? normalized
    : normalized.filter(hasFacilitatorContent);

  if (cleanFacilitators.length === 0) return publicFields;

  return [
    ...publicFields,
    {
      id: TRAINING_FACILITATORS_FIELD_ID,
      label: "Tim Fasilitator",
      type: "textarea",
      required: false,
      placeholder: JSON.stringify(cleanFacilitators),
    },
  ];
}
