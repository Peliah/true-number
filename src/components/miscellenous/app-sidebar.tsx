"use client";

import React from "react";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    useSidebar,
} from "@/components/ui/sidebar";
import { Gamepad2Icon, Home, Users2 } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";


export const AppSidebar = () => {
    const pathname = usePathname();

    const mainNavItems = [
        {
            title: "Dashboard",
            path: "/dashboard",
            icon: Home,
        },
        {
            title: "Users",
            path: "/dashboard/users",
            icon: Users2,
        }
    ];

    const isActive = (path: string) => {
        return path === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(path);
    };

    const { state } = useSidebar();

    return (
        <Sidebar collapsible="icon" className="font-roboto-mono">
            <section className="bg-white">
                <SidebarHeader
                    className={`flex h-[80px] justify-center border-none ${state == "expanded" ? "pl-8" : "p-2"} `}
                >
                    <Link href={"/"}>
                        {state == "expanded" ? (
                            <span className="flex items-center gap-3">
                                <Gamepad2Icon className="sidebar-icon !size-6" />
                                True Number
                            </span>
                        ) : (
                            <span className="flex items-center gap-3">
                                <Gamepad2Icon className="sidebar-icon !size-6" />
                            </span>
                        )}

                    </Link>
                </SidebarHeader>
                <SidebarContent
                    className={`pt-[14px] text-[#666666] ${state == "expanded" ? "pr-[18px] pl-6" : "px-0"}`}
                >
                    <SidebarGroup>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {mainNavItems.map((item) => (
                                    <SidebarMenuItem key={item.path}>
                                        <SidebarMenuButton
                                            asChild
                                            className={`sidebar-menu-item ${isActive(item.path)
                                                ? "bg-black rounded-sm text-white"
                                                : ""
                                                }`}
                                        >
                                            <Link
                                                href={item.path}
                                                className="flex items-center gap-3 px-4 py-3"
                                            >
                                                <item.icon className="sidebar-icon !size-4.5" />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
            </section>
        </Sidebar>
    );
};

export default AppSidebar;