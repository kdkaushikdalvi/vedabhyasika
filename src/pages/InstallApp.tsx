import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw } from "lucide-react";

export default function InstallApp() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      setDeferredPrompt(null);
    }
  };

  const handleRefresh = () => {
    if ("caches" in window) {
      caches.keys().then((names) => names.forEach((name) => caches.delete(name)));
    }
    window.location.reload();
  };

  return (
    <div className="space-y-6 max-w-md mx-auto text-center">
      <h1 className="text-2xl font-semibold">Install App</h1>
      <p className="text-sm text-muted-foreground">
        Install वेद अभ्यासिका on your device for quick access.
      </p>

      <div className="space-y-3">
        <Button className="w-full gap-2" size="lg" onClick={handleInstall} disabled={!deferredPrompt}>
          <Download className="h-5 w-5" />
          {deferredPrompt ? "Install App" : "Open in browser menu to install"}
        </Button>

        <p className="text-xs text-muted-foreground">
          On iPhone: Tap <strong>Share</strong> → <strong>Add to Home Screen</strong>
        </p>

        <Button variant="outline" className="w-full gap-2" size="lg" onClick={handleRefresh}>
          <RefreshCw className="h-5 w-5" /> Refresh App
        </Button>
        <p className="text-xs text-muted-foreground">
          Clears cache and reloads. Database data is not affected.
        </p>
      </div>
    </div>
  );
}
