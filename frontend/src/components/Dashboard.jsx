import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  Package,
  Users,
  User,
  ShoppingCart,
  Warehouse,
} from "lucide-react"

import { useEffect } from "react"
import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {Sidebar,SidebarContent,SidebarFooter, SidebarHeader,SidebarRail, SidebarProvider,} from "@/components/ui/sidebar"
import { useNavigate } from "react-router-dom"
import { Outlet } from "react-router-dom"
// import { Categories } from "@/pages/Categories"
import { Routes, Route } from "react-router-dom"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Categories",
      url: "/dashboard/categories",
      icon: Warehouse,
      isActive: true,
      items: [
        {
          title: "All Categories",
          url: "/dashboard/categories",
        },
        {
          title: "Add Category",
          url: "/dashboard/categories",
        },
      ],
    },
    {
      title: "Products",
      url: "/dashboard/products",
      icon: Package,
      items: [
        {
          title: "All Products",
          url: "/dashboard/products",
        },
        {
          title: "Add Product",
          url: "/dashboard/products",
        },
      ],
    },
    {
      title: "Orders",
      url: "/dashboard/orders",
      icon: ShoppingCart,
      items: [
        {
          title: "All Orders",
          url: "/dashboard/orders",
        },
        {
          title: "Pending Orders",
          url: "/dashboard/orders?status=pending",
        },
      ],
    },
    {
      title: "Users",
      url: "/dashboard/users",
      icon: Users,
      items: [
        {
          title: "All Users",
          url: "/dashboard/users",
        },
        {
          title: "Add User",
          url: "/dashboard/users",
        },
      ],
    },
    {
      title: "Account",
      url: "/dashboard/account",
      icon: User,
      items: [
        {
          title: "My Profile",
          url: "/dashboard/account",
        },
        {
          title: "Change Password",
          url: "/dashboard/account",
        },
      ],
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "/dashboard/settings",
        },
        {
          title: "Email Settings",
          url: "/dashboard/settings",
        },
        {
          title: "Notifications",
          url: "/dashboard/settings",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
}

export function Dashboard({
  ...props
}) {
  const navigate = useNavigate()

  // function checkLogin(){
  //   const user = localStorage.getItem("user")
  //   const token = localStorage.getItem("token")
  //   if(!user || !token){
  //     navigate("/login")
  //   }
  // }

  function checkLogin() {
  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/login", { replace: true });
  }
}


  useEffect(() => {
    checkLogin()
  }, [])

  return (
    <div className="flex h-screen bg-background">
      <SidebarProvider>
        <Sidebar collapsible="icon" {...props}>
          <SidebarHeader>
            <TeamSwitcher teams={data.teams} />
          </SidebarHeader>
          <SidebarContent>
            <NavMain items={data.navMain} />
            <NavProjects projects={data.projects} />
          </SidebarContent>
          <SidebarFooter>
            <NavUser user={data.user} />
          </SidebarFooter>
          <SidebarRail />
       
        </Sidebar>
          <main className="text-white">
        <div className="container mx-auto">
        {/* <Categories/> */}
        <Outlet/>
        </div>
      </main>
      </SidebarProvider>
     
    </div>
  );
}
