import {
  CreditCard,
  DollarSign,
  AlertCircle,
  RotateCcw,
  MoreHorizontal,
  Eye,
  Trash2,
  RefreshCcw,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function NavFinances() {
  const { isMobile } = useSidebar();

  const finances = [
    {
      name: "All Payments",
      url: "/dashboard/payments",
      icon: CreditCard,
    },
    {
      name: "Failed Payments",
      url: "/dashboard/payments?status=failed",
      icon: AlertCircle,
    },
    {
      name: "Refunds",
      url: "/dashboard/payments/refunds",
      icon: RotateCcw,
    },
    {
      name: "Revenue",
      url: "/dashboard/analytics",
      icon: DollarSign,
    },
  ];

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Finances</SidebarGroupLabel>

      <SidebarMenu>
        {finances.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              <a href={item.url}>
                <item.icon />
                <span>{item.name}</span>
              </a>
            </SidebarMenuButton>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal />
                </SidebarMenuAction>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                className="w-48 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <DropdownMenuItem>
                  <Eye className="text-muted-foreground" />
                  <span>View Details</span>
                </DropdownMenuItem>

                <DropdownMenuItem>
                  <RefreshCcw className="text-muted-foreground" />
                  <span>Retry Payment</span>
                </DropdownMenuItem>

                <DropdownMenuItem>
                  <RotateCcw className="text-muted-foreground" />
                  <span>Issue Refund</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem className="text-red-500">
                  <Trash2 />
                  <span>Delete Record</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
        <SidebarMenuItem>
          <SidebarMenuButton className="text-sidebar-foreground/70">
            <MoreHorizontal />
            <span>More</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}