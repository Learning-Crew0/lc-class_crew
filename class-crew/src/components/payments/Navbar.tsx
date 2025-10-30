import React from "react";

type NavbarProps = {
  title: string;
  sequence: number;
};

function Navbar({ title, sequence }: NavbarProps) {
  return (
    <header className="bg-black text-white p-3">
      <div className="text-[24px] font-bold flex items-center gap-3 ml-24 rounded-tl-xl rounded-tr-xl">
        <p className="bg-white w-[20px] text-black text-[15px] font-bold p-2 h-[20px] flex items-center justify-center rounded-full">
          {sequence}
        </p>
        <h1>{title}</h1>
      </div>
    </header>
  );
}

export default Navbar;
