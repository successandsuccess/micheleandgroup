import { GetDashboard } from "@/actions/page/getDashboard";
import Sidebar from "@/components/Sidebar";
import useParticipantStore from "@/store/use-participant";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import parse from "html-react-parser";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { accountType, setDataLoading } = useParticipantStore((state) => state);

  const [dashboardData, setDashboardData] = useState<Array<any>>([]);

  useEffect(() => {
    (async () => {
      setDataLoading(true);

      const dashboard_record = await GetDashboard();
      const dashboard_data = await JSON.parse(
        dashboard_record?.data?.data?.fields?.Data
      );
      setDashboardData(dashboard_data);

      setDataLoading(false);
    })();
  }, []);
  return (
    <main className={`min-h-screen xl:flex xl:flex-row bg-gray-100 `}>
      <Sidebar />
      <div className="md:p-[30px] p-1  w-full">
        <div className="p-5 flex flex-col gap-5">
          <p className="text-[20px]">Dashboard</p>
          {dashboardData?.map((item: any, index: number) => (
            <div
              key={"news" + index}
              className="bg-white p-5 rounded-lg shadow"
            >
              {parse(item)}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
