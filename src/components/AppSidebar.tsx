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
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation, useNavigate } from "react-router-dom";
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

const iconColors: Record<string, string> = {
  Dashboard: "text-violet-500",
  Students: "text-blue-500",
  "Student Reminders": "text-amber-500",
  Analytics: "text-emerald-500",
  Reports: "text-rose-500",
  "नियमावली": "text-orange-500",
  About: "text-cyan-500",
  "Install App": "text-indigo-500",
};

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

  const renderItems = (items: { title: string; url: string; icon: React.ComponentType<{ className?: string }> }[]) => (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.url}>
          <SidebarMenuButton asChild>
            <NavLink
              to={item.url}
              end={item.url === "/"}
              className="hover:bg-sidebar-accent/60"
              activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
              onClick={closeSidebar}
            >
              <item.icon className={`mr-2 h-4 w-4 shrink-0 ${iconColors[item.title] || "text-primary"}`} />
              {!collapsed && <span>{item.title}</span>}
            </NavLink>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );

  return (
    <Sidebar collapsible="icon" className="bg-white border-r">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <img src={logo} alt="वेद अभ्यासिका" className="h-15 w-full shrink-0" />
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Dashboard */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/"
                    end
                    className="hover:bg-sidebar-accent/60"
                    activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    onClick={closeSidebar}
                  >
                    <LayoutDashboard className="mr-2 h-4 w-4 shrink-0 text-violet-500" />
                    {!collapsed && <span>Dashboard</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Branches with accordion */}
        <SidebarGroup>
          <SidebarGroupLabel>Branches</SidebarGroupLabel>
          <SidebarGroupContent>
            {BRANCHES.map((branch) => (
              <Collapsible
                key={branch.id}
                open={openBranch === branch.id}
                onOpenChange={(open) => setOpenBranch(open ? branch.id : "")}
              >
                <CollapsibleTrigger className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium hover:bg-sidebar-accent/60 transition-colors">
                  <Building2 className="h-4 w-4 shrink-0 text-purple-500" />
                  {!collapsed && (
                    <>
                      <span className="flex-1 text-left truncate">{branch.name}</span>
                      <ChevronDown className={`h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform duration-200 ${openBranch === branch.id ? "rotate-180" : ""}`} />
                    </>
                  )}
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenu className="pl-3 mt-0.5">
                    {branch.halls.map((hall) => (
                      <SidebarMenuItem key={hall.id}>
                        <SidebarMenuButton asChild>
                          <NavLink
                            to={`/hall/${hall.id}`}
                            className="hover:bg-sidebar-accent/60"
                            activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                            onClick={closeSidebar}
                          >
                            <span className="h-2 w-2 rounded-full bg-primary/60 mr-2 shrink-0" />
                            {!collapsed && <span>{hall.name}</span>}
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Manage</SidebarGroupLabel>
          <SidebarGroupContent>{renderItems(manageNav)}</SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Insights</SidebarGroupLabel>
          <SidebarGroupContent>{renderItems(insightNav)}</SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Info</SidebarGroupLabel>
          <SidebarGroupContent>{renderItems(infoNav)}</SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-2 space-y-1">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink
                to="/install"
                className="hover:bg-sidebar-accent/60"
                activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                onClick={closeSidebar}
              >
                <Download className="mr-2 h-4 w-4 shrink-0 text-indigo-500" />
                {!collapsed && <span>Install App</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleRefresh} className="hover:bg-sidebar-accent/60 cursor-pointer">
              <RefreshCw className="mr-2 h-4 w-4 shrink-0 text-teal-500" />
              {!collapsed && <span>Refresh App</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
