import Sidebar from "@/components/Sidebar";
import useParticipantStore from "@/store/use-participant";

export default function Home() {
  const {accountType} =
    useParticipantStore((state) => state);
  return (
    <main
      className={`min-h-screen xl:flex xl:flex-row justify-stretch  bg-gray-100`}
    >
      <Sidebar />
      <div className="p-[30px]  w-full">
        <p className="md:text-[26px]  text-[24px] sm:text-left text-center font-semibold mb-[30px]">
          Access
        </p>
        <div className="flex flex-col gap-[30px]">
          <div className="rounded-2xl lg:p-[30px] md:p-[20px] p-[15px] bg-white shadow-md">
            <p className="text-[40px] font-bold">Michele & Group Talent Booking System:</p>
            <p>You are {accountType.toUpperCase()}</p>
          </div>
        </div>
      </div>
    </main>
  );
}
