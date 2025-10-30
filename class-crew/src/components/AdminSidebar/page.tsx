"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Calendar,
    Book,
    StoreIcon,
    ChevronDown,
    ChevronRight,
    Upload,
    Users,
    MessageSquare,
} from "lucide-react";
import { motion } from "framer-motion";
import { phenomena } from "@/app/font";
import Image from "next/image";
import { useState, useEffect } from "react";
import { FaProductHunt } from "react-icons/fa";

const navItems = [
    {
        name: "MainPage",
        href: "/admin/mainpage",
        icon: LayoutDashboard,
        children: [
            { name: "Create Banner ", href: "/admin/mainpage/create-banner" },
            { name: "View Banner ", href: "/admin/mainpage/view-banner" },
        ],
    },
    {
        name: "CoursePage",
        href: "/admin/coursepage",
        icon: Book,
        children: [
            {
                name: "Create Category",
                href: "/admin/coursepage/manage-category",
            },
            { name: "Create Courses", href: "/admin/coursepage/create-course" },
            { name: "View Courses", href: "/admin/coursepage/view-course" },
            {
                name: "Manage Class Goal ",
                href: "/admin/coursepage/manage-class-goal",
            },
        ],
    },
    {
        name: "Products",
        href: "/admin/products",
        icon: FaProductHunt,
        children: [
            {
                name: "Manage Products ",
                href: "/admin/products/manage-product",
            },
            {
                name: "Manage Product Category ",
                href: "/admin/products/manage-product-category",
            },
            { name: "View Product ", href: "/admin/products/view-product" },
        ],
    },
    {
        name: "Bulk Upload",
        href: "/admin/bulk-upload",
        icon: Upload,
        children: [],
    },
    {
        name: "Training Schedules",
        href: "/admin/coursepage/manage-training-schedules",
        icon: Calendar,
        children: [],
    },
    {
        name: "Coalition Applications",
        href: "/admin/coalition",
        icon: Users,
        children: [
            {
                name: "View Applications",
                href: "/admin/coalition/view-applications",
            },
            { name: "Statistics", href: "/admin/coalition/statistics" },
        ],
    },
    {
        name: "Enquiries",
        href: "/admin/enquiries",
        icon: MessageSquare,
        children: [
            { name: "View Enquiries", href: "/admin/enquiries/view-enquiries" },
            { name: "Statistics", href: "/admin/enquiries/statistics" },
        ],
    },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});

    // Auto-open menu if current route matches its child
    useEffect(() => {
        navItems.forEach((item) => {
            if (
                item.children?.some((child) => pathname.startsWith(child.href))
            ) {
                setOpenMenus((prev) => ({ ...prev, [item.name]: true }));
            }
        });
    }, [pathname]);

    const toggleMenu = (itemName: string) => {
        setOpenMenus((prev) => ({ ...prev, [itemName]: !prev[itemName] }));
    };

    return (
        <aside className="w-64 h-full border-r border-black bg-black text-white flex flex-col">
            {/* Logo Section */}
            <div className="flex items-center justify-between px-6 py-5 border-white">
                <Link href="/admin" className="flex items-center gap-2 group">
                    <motion.span
                        className={`text-2xl md:text-3xl font-normal tracking-widest ${phenomena.className}`}
                    >
                        CLASS
                    </motion.span>
                    <motion.div className="rounded-md mb-1 flex items-center justify-center shadow-md">
                        <Image
                            src="/Vector.png"
                            alt="Logo"
                            width={42}
                            height={20}
                            className="object-contain"
                        />
                    </motion.div>
                </Link>
            </div>

            {/* Sidebar Title */}
            <div className="px-6 py-4 border-b border-white">
                <span
                    className={`text-2xl font-bold md:text-3xl tracking-wide`}
                >
                    Admin Panel
                </span>
            </div>

            {/* Nav Section */}
            <nav className="flex-1 px-4 py-6 overflow-y-auto">
                <ul className="space-y-2">
                    {navItems.map((item) => {
                        const active =
                            pathname === item.href ||
                            item.children?.some((c) =>
                                pathname.startsWith(c.href)
                            );
                        const Icon = item.icon;

                        return (
                            <li key={item.href}>
                                {item.children && item.children.length > 0 ? (
                                    <div
                                        className={`flex items-center justify-between px-4 py-3 rounded-md font-medium cursor-pointer transition ${
                                            active
                                                ? "bg-white text-black"
                                                : "text-white hover:bg-white hover:text-black"
                                        }`}
                                        onClick={() => toggleMenu(item.name)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Icon size={18} />
                                            {item.name}
                                        </div>
                                        {openMenus[item.name] ? (
                                            <ChevronDown size={16} />
                                        ) : (
                                            <ChevronRight size={16} />
                                        )}
                                    </div>
                                ) : (
                                    <Link
                                        href={item.href}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-md font-medium transition ${
                                            active
                                                ? "bg-white text-black"
                                                : "text-white hover:bg-white hover:text-black"
                                        }`}
                                    >
                                        <Icon size={18} />
                                        {item.name}
                                    </Link>
                                )}

                                {/* Submenu */}
                                {item.children &&
                                    item.children.length > 0 &&
                                    openMenus[item.name] && (
                                        <ul className="ml-8 mt-3 space-y-1">
                                            {item.children.map((child) => {
                                                const childActive =
                                                    pathname === child.href;
                                                return (
                                                    <li key={child.href}>
                                                        <Link
                                                            href={child.href}
                                                            className={`block px-3 py-2 rounded-md text-sm transition mb-3 ${
                                                                childActive
                                                                    ? "bg-white text-black"
                                                                    : "text-gray-300 hover:bg-white hover:text-black border-2 border-white"
                                                            }`}
                                                        >
                                                            {child.name}
                                                        </Link>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    )}
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-white text-sm text-gray-400">
                CLASS CREW ADMIN
            </div>
        </aside>
    );
}
