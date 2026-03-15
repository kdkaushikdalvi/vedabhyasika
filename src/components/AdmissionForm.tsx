import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStore } from "@/lib/store";
import { HALLS } from "@/lib/constants";

interface AdmissionFormProps {
  open: boolean;
  onClose: () => void;
  hallId: string;
  deskNumber: number;
}

export function AdmissionForm({ open, onClose, hallId, deskNumber }: AdmissionFormProps) {
  const { addStudent } = useStore();
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");

  const hall = HALLS.find((h) => h.id === hallId);

  const handleSave = () => {
    if (!fullName.trim() || !mobile.trim()) return;
    addStudent({
      full_name: fullName.trim(),
      mobile_number: mobile.trim(),
      hall_name: hallId,
      desk_number: deskNumber,
    });
    setFullName("");
    setMobile("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{hall?.name} — Desk {deskNumber}</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full Name" autoFocus />
          <Input value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="Mobile Number" type="tel" />
        </div>

        <Button onClick={handleSave} disabled={!fullName.trim() || !mobile.trim()} className="w-full">
          Save Admission
        </Button>
      </DialogContent>
    </Dialog>
  );
}
