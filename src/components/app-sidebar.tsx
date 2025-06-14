import * as React from "react";
import { IconInnerShadowTop } from "@tabler/icons-react";

import { NavMain } from "../components/nav-main";

import { NavUser } from "../components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../components/ui/sidebar";
import { AppContext } from "../Context/AppContext";
import { getNavForAdmin, getNavForSeller } from "../services/configuration/navconfig";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const appContext = React.useContext(AppContext);
  if (!appContext) throw new Error("Products must be used within an AppProvider");

  const { user } = appContext;
  //const [luser, setLuser] = React.useState<user | null>(null);
  //setLuser(user);

  //const navConfig = user?.role_id === 1 ? getNavForAdmin(user) : getNavForSeller(user!);
  const data = user?.role === "Admin" ? getNavForAdmin(user) : getNavForSeller(user!);
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              <a href="/home">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Back To Home</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
