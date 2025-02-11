import { GetDashboard } from "@/actions/page/getDashboard";
import { UpdateDashboard } from "@/actions/page/updateDashboard";
import Sidebar from "@/components/Sidebar";
import useParticipantStore from "@/store/use-participant";
import {
  Textarea,
} from "@nextui-org/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import dynamic from "next/dynamic";

const QuillNoSSRWrapper = dynamic(() => import("react-quill"), {
  ssr: false,
});

export default function Home() {
  const { airtable_id, setDataLoading, accountType } = useParticipantStore(
    (state) => state
  );

  const [dashboardData, setDashboardData] = useState<Array<any>>([]);

  useEffect(() => {
    (async () => {
      if (airtable_id) {
        setDataLoading(true);

        const dashboard_record = await GetDashboard();
        const dashboard_data = await JSON.parse(
          dashboard_record?.data?.data?.fields?.Data
        );
        setDashboardData(dashboard_data);

        setDataLoading(false);
      }
    })();
  }, [airtable_id]);

  const handleChange = (e: any, index: number) => {
    const updatedData = [...dashboardData];

    updatedData[index] = e;

    setDashboardData(updatedData);
  };

  const handleUpdate = async () => {
    for (let i = 0; i < dashboardData.length; i++) {
      if (dashboardData[i] === "") {
        toast.error("Description is required!");
        return;
      }
    }
    setDataLoading(true);
    await UpdateDashboard(dashboardData);
    toast.success('Dashboard page has been edited successfully!')
    setDataLoading(false);
  };

  return (
    <main
      className={`min-h-screen xl:flex xl:flex-row justify-stretch  bg-gray-100`}
    >
      <Sidebar />
      <div className="p-[30px]  w-full">
        <p className="md:text-[26px]  text-[24px] sm:text-left text-center font-semibold mb-[30px]">
          Edit Dashboard
        </p>
        <div className="flex flex-col gap-[30px]">
          <div className="rounded-2xl lg:p-[30px] md:p-[20px] p-[15px] bg-white shadow-md">
            <div className="flex flex-col gap-5 mb-5">
              {dashboardData?.map((item: any, index: number) => (
                <QuillNoSSRWrapper
                className={`w-full bg-white h-[200px] mb-[40px] `}
                theme="snow"
                value={item}
                key={"dashboard-notify"+index}
                onChange={(e) => handleChange(e, index)}
              />
              ))}
            </div>
            <button
              className="mt-5 bg-[#ff4081] text-white font-bold text-[16px] py-[15px] px-[26px] rounded-l-full rounded-r-full hover:bg-opacity-50 transition"
              onClick={handleUpdate}
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
