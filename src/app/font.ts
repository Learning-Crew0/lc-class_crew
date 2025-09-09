// app/font.ts
import localFont from "next/font/local";
import { Plus_Jakarta_Sans } from "next/font/google";


export const phenomena = localFont({
  src: "../../public/fonts/Phenomena/phenomena/Phenomena-Bold.otf",
});


export const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["400","500","600","700"],
});