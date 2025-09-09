import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="flex items-center justify-center w-full h-[300px]">
      <div>
        <Image src="/images/Frame 113.png" alt="main image" />
      </div>
    </section>
  );
}
