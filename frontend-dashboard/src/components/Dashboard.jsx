import * as React from "react";
import {
  AudioWaveform,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  Package,
  Users,
  User,
  ShoppingCart,
  Warehouse,
} from "lucide-react";

import { useEffect } from "react";
import { NavMain } from "@/components/nav-main";
import { NavFinances } from "@/components/nav-finances";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { useNavigate, Outlet } from "react-router-dom";
import { useUser } from "@/Context/UserContext";

const data = {
  teams: [
    {
      name: "groomie-hub",
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
        { title: "All Categories", url: "/dashboard/categories" },
        { title: "Add Category", url: "/dashboard/categories" },
      ],
    },
    {
      title: "Products",
      url: "/dashboard/products",
      icon: Package,
      items: [
        { title: "All Products", url: "/dashboard/products" },
        { title: "Add Product", url: "/dashboard/products" },
      ],
    },
    {
      title: "Orders",
      url: "/dashboard/orders",
      icon: ShoppingCart,
      items: [
        { title: "All Orders", url: "/dashboard/orders" },
        { title: "Pending Orders", url: "/dashboard/orders?status=pending" },
      ],
    },
    {
      title: "Users",
      url: "/dashboard/users",
      icon: Users,
      items: [
        { title: "All Users", url: "/dashboard/users" },
        { title: "Add User", url: "/dashboard/users" },
      ],
    },
    {
      title: "Account",
      url: "/dashboard/account",
      icon: User,
      items: [
        { title: "My Profile", url: "/dashboard/account" },
        { title: "Change Password", url: "/dashboard/account" },
      ],
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings2,
      items: [
        { title: "General", url: "/dashboard/settings" },
        { title: "Email Settings", url: "/dashboard/settings" },
        { title: "Notifications", url: "/dashboard/settings" },
      ],
    },
  ],
  finances: [
    { name: "Expenses", url: "#", icon: Frame },
    { name: "payments", url: "#", icon: PieChart },
    { name: "Travel", url: "#", icon: Map },
  ],
  
};

export function Dashboard(props) {
  const navigate = useNavigate();
  const { user, loading } = useUser();
  console.log(user)

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { replace: true });
    }
  }, []);


  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-orange-500">
      <SidebarProvider>
        {/* SIDEBAR */}
        <Sidebar className="bg-black border-r" collapsible="icon" {...props}>
          <SidebarHeader>
            <TeamSwitcher teams={data.teams} />
          </SidebarHeader>

          <SidebarContent>
            <NavMain items={data.navMain} />
            <NavFinances finances={data.finances} />
          </SidebarContent>

          <SidebarFooter>
        
            <NavUser user={user || {}} />
          </SidebarFooter>

          <SidebarRail />
        </Sidebar>

 
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
    
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-xl font-semibold text-white">
                Dashboard
              </h1>

              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-300">
                  {user?.role || "user"}
                </span>

                <img
                  src={user?.avatar || "/default.png"}
                  className="w-8 h-8 rounded-full"
                  alt="avatar"
                />
              </div>
            </div>
            <Outlet />
          </div>
        </main>
      </SidebarProvider>
    </div>
  );
}