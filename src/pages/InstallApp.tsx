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

      <div className="space-y-4">
        {/* Android */}
        <div className="rounded-xl border bg-card p-4 space-y-2">
          <h2 className="text-sm font-semibold flex items-center gap-2">📱 Android</h2>
          <Button className="w-full gap-2" size="lg" onClick={handleInstall} disabled={!deferredPrompt}>
            <Download className="h-5 w-5" />
            {deferredPrompt ? "Install App" : "Open in Chrome → Tap Install"}
          </Button>
          <p className="text-xs text-muted-foreground">
            Tap the button above or use Chrome menu → <strong>Install app</strong>
          </p>
        </div>

        {/* iOS */}
        <div className="rounded-xl border bg-card p-4 space-y-2">
          <h2 className="text-sm font-semibold flex items-center gap-2">🍎 iPhone / iPad</h2>
          <ol className="text-sm text-muted-foreground list-decimal list-inside space-y-1">
            <li>Open in <strong>Safari</strong></li>
            <li>Tap <strong>Share</strong> (⬆️)</li>
            <li>Tap <strong>Add to Home Screen</strong></li>
          </ol>
        </div>

        {/* Refresh */}
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
