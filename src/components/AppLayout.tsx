import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import logoWide from "@/assets/logo-wide.png";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center border-b bg-card px-4 gap-3 shrink-0">
            <SidebarTrigger />
            <div className="flex items-center gap-2 md:hidden">
              <img src={logoWide} alt="वेद अभ्यासिका" className="h-8 w-auto" />
            </div>
          </header>
          <main className="flex-1 overflow-auto p-4 md:p-6">
            {children}
          </main>
          <footer className="border-t bg-card px-4 py-3 flex items-center justify-center gap-3 shrink-0">
            <img src={logoWide} alt="वेद अभ्यासिका" className="h-8 w-auto opacity-70" />
            <span className="text-xs text-muted-foreground">शाखा क्र. 01 | महादेवनगर</span>
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
}
