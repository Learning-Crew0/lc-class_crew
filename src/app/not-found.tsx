"use client";

import Link from "next/link";
import Image from "next/image";
import { phenomena } from "@/app/font";
import { ChevronLeft } from "lucide-react";
export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-primary text-white p-6">

            {/* Logo */}
            <Link href="/" className="flex items-center group mb-10">
                <span
                    className={`text-3xl md:text-4xl font-normal tracking-widest ${phenomena.className} transition-transform duration-300 group-hover:scale-110`}
                >
                    CLASS
                </span>
                <div className="rounded-md flex items-center justify-center shadow-md transition-transform duration-300 group-hover:scale-110">
                    <Image
                        src="/Vector.png"
                        alt="Logo"
                        width={46}
                        height={24}
                        className="object-contain"
                    />
                </div>
            </Link>

            {/* 404 Message */}
            <h1 className="text-6xl md:text-7xl font-bold mb-4">404</h1>
            <p className="text-xl md:text-2xl mb-8 text-center max-w-md">
                Oops! The page you are looking for does not exist.
            </p>
            {/* Back Home Button */}
            <Link
                href="/"
                className="flex items-center gap-2 px-6 py-3 bg-[var(--secondary)] text-[var(--primary)] font-semibold rounded-lg hover:bg-[var(--primary)] hover:text-[var(--secondary)] transition-colors font-plus-jakarta-sans"
            >
                <ChevronLeft size={20} />
                Go Back Home
            </Link>


        </div>
    );
}
