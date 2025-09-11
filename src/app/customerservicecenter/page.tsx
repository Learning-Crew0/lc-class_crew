import Navbar from "@/components/layout/navbar/page";


export default function MyPageRoute() {
  return (
    <div className="min-h-screen">
      <Navbar />
       <div className="min-h-screen bg-white mt-15">
        <div className="flex justify-center items-center h-[130px] ">
          <span className=" w-[73px] h-[40px] text-[36px] font-extrabold text-[var(--primary)]">
            고객센터
          </span>
        </div>
        </div>
    </div>
  );
}
