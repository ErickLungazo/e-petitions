"use client";

import * as React from "react";
import {
  IconDatabase,
  IconInnerShadowTop,
  IconReport,
} from "@tabler/icons-react";

import { UsersNav } from "./users-nav";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useUserStore } from "@/store/userStore";
import Link from "next/link";
import { CirclePlus } from "lucide-react";

const adminMenus = [
  {
    name: "Users",
    url: "/admin/users",
    icon: IconDatabase,
  },
  {
    name: "Petitions",
    url: "/admin/petitions",
    icon: IconReport,
  },
];
const petitionerMenus = [
  {
    name: "Dashboard",
    url: "/petitioner",
    icon: IconDatabase,
  },
  {
    name: "Create a Petition",
    url: "/petitioner/create",
    icon: CirclePlus,
  },
  {
    name: "My Petitions",
    url: "/petitioner/petitions",
    icon: IconReport,
  },
];
const clerkMenus = [
  {
    name: "Dashboard",
    url: "/clerk",
    icon: IconDatabase,
  },
  {
    name: "Petitions",
    url: "/clerk/petitions",
    icon: IconReport,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUserStore();
  console.log("user", user);

  const currentMenu =
    user?.role === "admin"
      ? adminMenus
      : user?.role === "clerk"
        ? clerkMenus
        : petitionerMenus;
  //
  // const getMenuForRole = (role: string | undefined) => {
  //   switch (role) {
  //     case "admin":
  //       return adminMenus;
  //     case "clerk":
  //       return clerkMenus;
  //     case "petitioner":
  //     default:
  //       return petitionerMenus;
  //   }
  // };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/admin">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">E-Petitions</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <UsersNav items={currentMenu} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: `${user!!.firstName} ${user!!.lastName}`,
            email: `${user!!.email}`,
            avatar: "https://github.com/shadcn.png",
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
