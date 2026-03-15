import {
  LayoutDashboard,
  Users,
  Bell,
  BarChart3,
  FileText,
  ScrollText,
  Info,
  Download,
  RefreshCw,
  Building2,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import logo from "@/assets/logo.png";
import { BRANCHES } from "@/lib/constants";
import { useState } from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const manageNav = [
  { title: "Students", url: "/students", icon: Users },
  { title: "Student Reminders", url: "/reminders", icon: Bell },
];

const insightNav = [
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Reports", url: "/reports", icon: FileText },
];

const infoNav = [
  { title: "नियमावली", url: "/rules", icon: ScrollText },
  { title: "About", url: "/about", icon: Info },
];

export function AppSidebar() {
  const { state, setOpenMobile, isMobile } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const [openBranch, setOpenBranch] = useState<string>(BRANCHES[0].id);

  const closeSidebar = () => {
    if (isMobile) setOpenMobile(false);
  };

  const handleRefresh = () => {
    if ("caches" in window) {
      caches.keys().then((names) => names.forEach((name) => caches.delete(name)));
    }
    window.location.reload();
  };

  const navLinkClasses = "rounded-lg transition-all duration-200 hover:bg-sidebar-accent hover:translate-x-0.5";
  const activeClasses = "bg-primary text-primary-foreground font-semibold shadow-md shadow-primary/25 hover:bg-primary/90 hover:translate-x-0";

  const renderItems = (items: { title: string; url: string; icon: React.ComponentType<{ className?: string }> }[]) => (
    <SidebarMenu className="space-y-0.5">
      {items.map((item) => (
        <SidebarMenuItem key={item.url}>
          <SidebarMenuButton asChild>
            <NavLink
              to={item.url}
              end={item.url === "/"}
              className={navLinkClasses}
              activeClassName={activeClasses}
              onClick={closeSidebar}
            >
              <item.icon className="mr-2 h-4 w-4 shrink-0" />
              {!collapsed && <span>{item.title}</span>}
            </NavLink>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      {/* Header with gradient accent */}
      <SidebarContent className="px-2">
        {/* Dashboard */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/"
                    end
                    className={navLinkClasses}
                    activeClassName={activeClasses}
                    onClick={closeSidebar}
                  >
                    <LayoutDashboard className="mr-2 h-4 w-4 shrink-0" />
                    {!collapsed && <span>Dashboard</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Branches */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] uppercase tracking-wider text-sidebar-foreground/40 font-semibold">
            Branches
          </SidebarGroupLabel>
          <SidebarGroupContent>
            {BRANCHES.map((branch) => (
              <Collapsible
                key={branch.id}
                open={openBranch === branch.id}
                onOpenChange={(open) => setOpenBranch(open ? branch.id : "")}
              >
                <CollapsibleTrigger className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium hover:bg-sidebar-accent transition-all duration-200 group">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10 shrink-0">
                    <Building2 className="h-3.5 w-3.5 text-primary" />
                  </div>
                  {!collapsed && (
                    <>
                      <span className="flex-1 text-left truncate">{branch.name}</span>
                      <ChevronDown className={`h-3.5 w-3.5 shrink-0 text-sidebar-foreground/40 transition-transform duration-300 ${openBranch === branch.id ? "rotate-180" : ""}`} />
                    </>
                  )}
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenu className="pl-4 mt-1 space-y-0.5 border-l-2 border-primary/10 ml-4">
                    {branch.halls.map((hall) => {
                      const isActive = location.pathname === `/hall/${hall.id}`;
                      return (
                        <SidebarMenuItem key={hall.id}>
                          <SidebarMenuButton asChild>
                            <NavLink
                              to={`/hall/${hall.id}`}
                              className={navLinkClasses}
                              activeClassName={activeClasses}
                              onClick={closeSidebar}
                            >
                              <span className={`h-2 w-2 rounded-full mr-2 shrink-0 transition-colors ${isActive ? "bg-primary-foreground" : "bg-primary/40"}`} />
                              {!collapsed && <span>{hall.name}</span>}
                            </NavLink>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] uppercase tracking-wider text-sidebar-foreground/40 font-semibold">Manage</SidebarGroupLabel>
          <SidebarGroupContent>{renderItems(manageNav)}</SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] uppercase tracking-wider text-sidebar-foreground/40 font-semibold">Insights</SidebarGroupLabel>
          <SidebarGroupContent>{renderItems(insightNav)}</SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] uppercase tracking-wider text-sidebar-foreground/40 font-semibold">Info</SidebarGroupLabel>
          <SidebarGroupContent>{renderItems(infoNav)}</SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-2 mx-2 mb-2 space-y-0.5 rounded-xl bg-sidebar-accent/50 border border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink
                to="/install"
                className="rounded-lg hover:bg-sidebar-accent transition-all duration-200"
                activeClassName={activeClasses}
                onClick={closeSidebar}
              >
                <Download className="mr-2 h-4 w-4 shrink-0" />
                {!collapsed && <span>Install App</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleRefresh} className="rounded-lg hover:bg-sidebar-accent transition-all duration-200 cursor-pointer">
              <RefreshCw className="mr-2 h-4 w-4 shrink-0" />
              {!collapsed && <span>Refresh App</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
