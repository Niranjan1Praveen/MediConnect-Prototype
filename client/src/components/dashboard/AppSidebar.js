"use client";
import {
  Inbox,
  Calendar,
  User2,
  ChevronUp,
  Plus,
  Projector,
  Handshake,
  BarChart,
  MapIcon,
  Send,
  FormInput,
  FileText,
  Mic,
  Stethoscope,
  Dumbbell,
  Search,
  FlaskConical,
  Pill,
  Video,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@/hooks/useUser";

const AppSidebar = () => {
  const { user } = useUser();
const items = [
  {
    title: "Documentation",
    url: "/doctor",
    icon: FileText,
    description: "View docs & guides",
    badge: null,
  },
  {
    title: "Diagnostic Assistant",
    url: "/doctor/assistant",
    icon: FlaskConical,
    description: "Diagnosis using AI/ML",
    badge: null,
  },
  {
    title: "Video Conversation",
    url: "/doctor/videocall",
    icon: Video,
    description: "Live Video Calls",
    badge: null,
  },
  {
    title: "Conversation",
    url: "/doctor/liveConversation",
    icon: Mic,
    description: "Real-time chat",
    badge: "New",
  },
  {
    title: "Buy Medicines",
    url: "/doctor/buyMedicines",
    icon: Pill,
    description: "Buy medicines in Real-time ",
    badge: null,
  },
  {
    title: "Digital Prescription",
    url: "/doctor/digiPrescription",
    icon: Stethoscope,
    description: "Manage prescriptions",
    badge: null,
  },
  {
    title: "Fitness Generator",
    url: "/doctor/fitnessGenerator",
    icon: Dumbbell,
    description: "Create workout plans",
    badge: null,
  },
  {
    title: "Search Prescription",
    url: "/doctor/searchPrescription",
    icon: Search,
    description: "Find prescriptions",
    badge: null,
  },
];
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="py-4 ">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Image
                src={user?.profileImage || "https://avatar.windsor.io/john@doe.com"}
                alt="logo"
                width={30}
                height={30}
                className="rounded-full"
              />
              <span>Welcome {user?.firstName}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <hr />
      <SidebarContent>
        {/* NGO */}
        {user?.role.toLowerCase() === "ngo" && <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {items.map((item, index) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className="group relative overflow-hidden"
                  >
                    <Link
                      href={item.url}
                      className="relative flex items-center gap-3 p-3 rounded-xl transition-all duration-500 backdrop-blur-sm"
                    >
                      {/* Hover Glow Effect */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl blur-sm" />

                      <div className="relative z-10 flex items-center gap-3 w-full">
                        <div className="relative">
                            <item.icon className="h-4 w-4 flex items-center justify-center text-emerald-400 transition-colors duration-300" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="font-medium transition-colors duration-300">
                            {item.title}
                          </div>
                          <div className="text-xs text-slate-400 transition-colors duration-300">
                            {item.description}
                          </div>
                        </div>

                        {item.badge && (
                          <div className="ml-auto">
                            <span className="inline-flex justify-center items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20">
                              {item.badge}
                            </span>
                          </div>
                        )}
                      </div>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 /> {user?.firstName} <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Account</DropdownMenuItem>
                <DropdownMenuItem>Setting</DropdownMenuItem>
                <DropdownMenuItem>Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
