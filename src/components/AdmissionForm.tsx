import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStore } from "@/lib/store";
import { HALLS } from "@/lib/constants";
import { UserPlus, Phone, Hash, Calendar } from "lucide-react";

interface AdmissionFormProps {
  open: boolean;
  onClose: () => void;
  hallId: string;
  deskNumber: number;
}

export function AdmissionForm({ open, onClose, hallId, deskNumber }: AdmissionFormProps) {
  const { addStudent } = useStore();
  const hall = HALLS.find((h) => h.id === hallId);

  const today = new Date().toISOString().split("T")[0];
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [pin, setPin] = useState("");
  const [startDate, setStartDate] = useState(today);

  const endDate = (() => {
    if (!startDate) return "";
    const d = new Date(startDate);
    return new Date(d.getFullYear(), d.getMonth() + 1, 0).toLocaleDateString("en-IN");
  })();

  const handleSave = () => {
    if (!fullName.trim() || !mobile.trim()) return;
    addStudent({
      full_name: fullName.trim(),
      mobile_number: mobile.trim(),
      pin: pin || undefined,
      hall_name: hallId,
      desk_number: deskNumber,
      start_date: startDate,
    });
    setFullName("");
    setMobile("");
    setPin("");
    setStartDate(today);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-primary">
            <UserPlus className="h-5 w-5" />
            New Admission
          </DialogTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground pt-1">
            <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs font-medium">
              {hall?.name}
            </span>
            <span className="bg-secondary px-2 py-0.5 rounded-full text-xs font-medium">
              Desk {deskNumber}
            </span>
            <span className="ml-auto text-xs">₹{hall?.fee}/month</span>
          </div>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="fullName" className="flex items-center gap-1.5 text-xs font-medium">
              <UserPlus className="h-3.5 w-3.5 text-muted-foreground" />
              Full Name
            </Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="विद्यार्थ्याचे नाव"
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="mobile" className="flex items-center gap-1.5 text-xs font-medium">
              <Phone className="h-3.5 w-3.5 text-muted-foreground" />
              Mobile Number
            </Label>
            <Input
              id="mobile"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="9876543210"
              type="tel"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="startDate" className="flex items-center gap-1.5 text-xs font-medium">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                Start Date
              </Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                Expires
              </Label>
              <div className="h-9 px-3 flex items-center rounded-md border bg-muted text-sm text-muted-foreground">
                {endDate}
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="pin" className="flex items-center gap-1.5 text-xs font-medium">
              <Hash className="h-3.5 w-3.5 text-muted-foreground" />
              PIN <span className="text-muted-foreground">(Optional)</span>
            </Label>
            <Input
              id="pin"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="4 digit PIN"
              maxLength={4}
            />
          </div>
        </div>

        <DialogFooter className="gap-2 pt-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button
            onClick={handleSave}
            disabled={!fullName.trim() || !mobile.trim()}
            className="gap-1.5"
          >
            <UserPlus className="h-4 w-4" />
            Save Admission
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
