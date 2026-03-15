import { INSTITUTE, HALLS, FACILITIES, REGISTRATION_FEE, getShareSeatsMessage } from "@/lib/constants";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Phone, MapPin, Clock, Share2 } from "lucide-react";
import logo from "@/assets/logo.png";

export default function About() {
  const { allocations, students } = useStore();

  const availableByHall: Record<string, number> = {};
  HALLS.forEach((hall) => {
    const used = allocations.filter((a) => {
      const s = students.find((st) => st.id === a.student_id);
      return a.hall_name === hall.id && a.active && s && s.status !== "inactive";
    }).length;
    availableByHall[hall.name] = hall.desks - used;
  });

  const shareUrl = `https://wa.me/?text=${encodeURIComponent(getShareSeatsMessage(availableByHall))}`;

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="bg-card border rounded-lg p-6 text-center">
        <img src={logo} alt="वेद अभ्यासिका" className="h-20 mx-auto mb-4" />
        <h1 className="text-2xl font-bold">{INSTITUTE.name}</h1>
        <p className="text-muted-foreground">{INSTITUTE.branch} | {INSTITUTE.location}</p>
        <p className="text-sm text-primary mt-2 italic">{INSTITUTE.motto}</p>
      </div>

      <div className="bg-card border rounded-lg divide-y">
        <div className="p-4 flex items-center gap-3">
          <MapPin className="h-4 w-4 text-primary shrink-0" />
          <span className="text-sm">{INSTITUTE.location}</span>
        </div>
        <div className="p-4 flex items-center gap-3">
          <Clock className="h-4 w-4 text-primary shrink-0" />
          <span className="text-sm">{INSTITUTE.timings}</span>
        </div>
        {INSTITUTE.contacts.map((c) => (
          <div key={c} className="p-4 flex items-center gap-3">
            <Phone className="h-4 w-4 text-primary shrink-0" />
            <a href={`tel:${c}`} className="text-sm text-primary">{c}</a>
          </div>
        ))}
      </div>

      <div className="bg-card border rounded-lg p-4">
        <h2 className="font-semibold mb-3">Fee Structure</h2>
        <div className="space-y-2 text-sm">
          {HALLS.map((h) => (
            <div key={h.id} className="flex justify-between">
              <span>{h.name}</span>
              <span className="font-medium">₹{h.fee}/month</span>
            </div>
          ))}
          <div className="flex justify-between border-t pt-2">
            <span>Registration Fee</span>
            <span className="font-medium">₹{REGISTRATION_FEE}</span>
          </div>
        </div>
      </div>

      <div className="bg-card border rounded-lg p-4">
        <h2 className="font-semibold mb-3">Facilities</h2>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {FACILITIES.map((f) => (
            <span key={f} className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
              {f}
            </span>
          ))}
        </div>
      </div>

      <Button className="w-full gap-2" variant="outline" asChild>
        <a href={shareUrl} target="_blank" rel="noopener noreferrer">
          <Share2 className="h-4 w-4" /> Share Available Seats on WhatsApp
        </a>
      </Button>
    </div>
  );
}
