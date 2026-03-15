import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  const [pin, setPin] = useState("");

  const hall = HALLS.find((h) => h.id === hallId);

  const handleSave = () => {
    if (!fullName.trim() || !mobile.trim()) return;
    addStudent({
      full_name: fullName.trim(),
      mobile_number: mobile.trim(),
      pin: pin || undefined,
      hall_name: hallId,
      desk_number: deskNumber,
    });
    setFullName("");
    setMobile("");
    setPin("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New Admission</DialogTitle>
          <p className="text-sm text-muted-foreground">
            {hall?.name} — Desk {deskNumber}
          </p>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="विद्यार्थ्याचे नाव" />
          </div>
          <div>
            <Label htmlFor="mobile">Mobile Number</Label>
            <Input id="mobile" value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="9876543210" type="tel" />
          </div>
          <div>
            <Label htmlFor="pin">PIN (Optional)</Label>
            <Input id="pin" value={pin} onChange={(e) => setPin(e.target.value)} placeholder="4 digit PIN" maxLength={4} />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={!fullName.trim() || !mobile.trim()}>Save Admission</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
