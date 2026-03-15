import { RULES } from "@/lib/constants";
import { ScrollText } from "lucide-react";

export default function Rules() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-2">
        <ScrollText className="h-5 w-5 text-primary" />
        <h1 className="text-2xl font-semibold">नियमावली</h1>
      </div>

      <div className="bg-card border rounded-lg divide-y">
        {RULES.map((rule, i) => (
          <div key={i} className="flex items-start gap-3 p-4">
            <span className="flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0">
              {i + 1}
            </span>
            <p className="text-sm leading-relaxed">{rule}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
