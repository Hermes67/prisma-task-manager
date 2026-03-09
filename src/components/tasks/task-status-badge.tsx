import { Badge } from "@/components/ui/badge";
import {
  TASK_STATUS_LABELS,
  type TaskStatus,
} from "@/lib/validations/task";

const statusVariant: Record<TaskStatus, "secondary" | "default" | "outline"> = {
  todo: "outline",
  in_progress: "secondary",
  done: "default",
};

export function TaskStatusBadge({ status }: { status: string }) {
  const s = status as TaskStatus;
  return (
    <Badge variant={statusVariant[s] ?? "outline"}>
      {TASK_STATUS_LABELS[s] ?? status}
    </Badge>
  );
}
