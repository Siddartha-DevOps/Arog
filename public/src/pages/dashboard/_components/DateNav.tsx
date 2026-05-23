import { ChevronLeft, ChevronRight } from "lucide-react";

function formatDisplayDate(dateStr: string) {
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  if (dateStr === today) return "Today";
  if (dateStr === yesterday) return "Yesterday";
  return new Date(dateStr + "T12:00:00").toLocaleDateString("en-IN", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

type Props = {
  date: string;
  onDateChange: (d: string) => void;
};

export default function DateNav({ date, onDateChange }: Props) {
  const today = new Date().toISOString().split("T")[0];

  const changeDate = (delta: number) => {
    const d = new Date(date + "T12:00:00");
    d.setDate(d.getDate() + delta);
    onDateChange(d.toISOString().split("T")[0]);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => changeDate(-1)}
        className="p-1.5 rounded-lg hover:bg-muted cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <span className="text-sm font-semibold text-foreground min-w-[80px] text-center">
        {formatDisplayDate(date)}
      </span>
      <button
        onClick={() => changeDate(1)}
        disabled={date >= today}
        className="p-1.5 rounded-lg hover:bg-muted cursor-pointer text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
