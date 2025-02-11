import { GetDashboard } from "@/actions/page/getDashboard";
import Sidebar from "@/components/Sidebar";
import useParticipantStore from "@/store/use-participant";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import parse from "html-react-parser";
import { GetApprovePicture } from "@/actions/getApprovePicture";
import SearchCard from "@/components/SearchCard";
import { useRouter } from "next/router";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { accountType, setDataLoading } = useParticipantStore((state) => state);

  const [dashboardData, setDashboardData] = useState<Array<any>>([]);

  const router = useRouter();

  useEffect(() => {
    (async () => {
      setDataLoading(true);

      const dashboard_record = await GetApprovePicture();
      console.log(dashboard_record);
      setDashboardData(dashboard_record?.data?.data?.records || []);
      setDataLoading(false);
    })();
  }, []);
  return (
    <main className={`min-h-screen xl:flex xl:flex-row bg-gray-100 `}>
      <Sidebar />
      <div className="md:p-[30px] p-1  w-full">
        <div className="p-5 flex flex-col gap-5">
          <p className="text-[20px]">Pictures to Approve</p>
          <div className="bg-white p-5 rounded-lg shadow grid xl:grid-cols-4 md:grid-cols-3 grid-cols-2">
            {dashboardData?.map((item: any, index: number) => (
              <SearchCard
                src={item.fields["Pictures to Approve"].split(',')[0]}
                id={item.id}
                name={item.fields["TALENT FULL NAME"]}
                disabled
                location=""
                index={index}
                onClick={(id: any) => router.push(`/dashboard/approve/${dashboardData[index].id}`)}
                full
                rating={item.fields.Rating}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
