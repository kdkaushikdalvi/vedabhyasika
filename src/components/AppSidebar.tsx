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
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import logo from "@/assets/logo.png";
import { HALLS } from "@/lib/constants";

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

const mainNav = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
];

const hallNav = HALLS.map((h) => ({
  title: h.name,
  url: `/hall/${h.id}`,
  icon: Building2,
}));

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
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

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
              className="hover:bg-white/10 transition-colors rounded-lg"
              activeClassName="bg-white/20 text-white font-semibold shadow-sm"
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
    <Sidebar collapsible="icon" className="border-none">
      <div className="flex flex-col h-full bg-gradient-to-b from-[hsl(263,84%,52%)] via-[hsl(270,76%,55%)] to-[hsl(280,70%,50%)] text-white">
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="वेद अभ्यासिका"
              className="h-10 w-10 shrink-0 rounded-full ring-2 ring-white/30 shadow-lg"
            />
            {!collapsed && (
              <div className="min-w-0">
                <h1 className="text-sm font-bold leading-tight text-white truncate">
                  वेद अभ्यासिका
                </h1>
                <p className="text-xs text-white/70 truncate">
                  शाखा क्र. 01 | महादेवनगर
                </p>
              </div>
            )}
          </div>
        </SidebarHeader>

        <SidebarContent className="px-2 flex-1">
          <SidebarGroup>
            <SidebarGroupContent>{renderItems(mainNav)}</SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel className="text-white/50 text-xs uppercase tracking-wider">
              Halls
            </SidebarGroupLabel>
            <SidebarGroupContent>{renderItems(hallNav)}</SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel className="text-white/50 text-xs uppercase tracking-wider">
              Manage
            </SidebarGroupLabel>
            <SidebarGroupContent>{renderItems(manageNav)}</SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel className="text-white/50 text-xs uppercase tracking-wider">
              Insights
            </SidebarGroupLabel>
            <SidebarGroupContent>{renderItems(insightNav)}</SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel className="text-white/50 text-xs uppercase tracking-wider">
              Info
            </SidebarGroupLabel>
            <SidebarGroupContent>{renderItems(infoNav)}</SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="p-2 space-y-1">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <NavLink
                  to="/install"
                  className="hover:bg-white/10 transition-colors rounded-lg"
                  activeClassName="bg-white/20 text-white font-semibold"
                >
                  <Download className="mr-2 h-4 w-4 shrink-0" />
                  {!collapsed && <span>Install App</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={handleRefresh}
                className="hover:bg-white/10 transition-colors rounded-lg cursor-pointer text-white/80 hover:text-white"
              >
                <RefreshCw className="mr-2 h-4 w-4 shrink-0" />
                {!collapsed && <span>Refresh App</span>}
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </div>
    </Sidebar>
  );
}
