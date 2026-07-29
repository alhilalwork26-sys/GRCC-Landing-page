import type { TrainingItem, TrainingSession } from "@/lib/supabase";

export function hasTrainingSessions(training?: Pick<TrainingItem, "sessions"> | null) {
  return Array.isArray(training?.sessions) && training.sessions.length > 0;
}

export function trainingDateLabel(
  training?: Pick<TrainingItem, "date_start" | "date_end" | "sessions"> | null
) {
  if (!training) return undefined;

  if (hasTrainingSessions(training)) {
    const sessions = training.sessions as TrainingSession[];
    const first = sessions[0]?.date;
    const last = sessions[sessions.length - 1]?.date;

    if (first && last && first !== last) return `${first} – ${last}`;
    if (first) return first;
  }

  if (!training.date_start) return undefined;
  return `${training.date_start}${training.date_end ? ` – ${training.date_end}` : ""}`;
}

export function trainingTimeLabel(training?: Pick<TrainingItem, "time" | "sessions"> | null) {
  if (!training) return undefined;

  if (hasTrainingSessions(training)) {
    return (training.sessions as TrainingSession[])
      .map((session) => {
        const times = session.times.filter(Boolean).join(", ");
        return `${session.day}${times ? ` ${times}` : ""}`;
      })
      .join("; ");
  }

  return training.time || undefined;
}
