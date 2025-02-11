import { GetBookerProfile } from "@/actions/getBookerProfile";
import Sidebar from "@/components/Sidebar";
import useParticipantStore from "@/store/use-participant";
import { useEffect, useState } from "react";

export default function Home() {
  const { accountType, airtable_id, setDataLoading } = useParticipantStore(
    (state) => state
  );
  const [data, setData] = useState<any>();
  useEffect(() => {
    (async () => {
      if (airtable_id) {
        setDataLoading(true);
        const result = await GetBookerProfile(airtable_id);
        console.log(result);
        setData(result.data);
        setDataLoading(false);
      }
    })();
  }, [airtable_id]);
  return (
    <main
      className={`min-h-screen xl:flex xl:flex-row justify-stretch  bg-gray-100`}
    >
      <Sidebar />
      <div className="p-[30px]  w-full">
        <p className="md:text-[26px]  text-[24px] sm:text-left text-center font-semibold mb-[30px]">
          Profile
        </p>
        <div className="flex flex-col gap-[30px] text-[18px]">
          <div className="rounded-2xl lg:p-[30px] md:p-[20px] p-[15px] bg-white shadow-md grid grid-cols-2">
            <div className="flex flex-col gap-2">
              <div className="flex flex-row justify-stretch">
                <p className="min-w-[175px]">Name:</p>
                <p>{data?.fields["Name"]}</p>
              </div>
              <div className="flex flex-row justify-stretch">
                <p className="min-w-[175px]">Email:</p>
                <p>{data?.fields["Email"]}</p>
              </div>
              <div className="flex flex-row justify-stretch">
                <p className="min-w-[175px]">Cell Phone:</p>
                <p>{data?.fields["Cell Phone"]}</p>
              </div>
              <div className="flex flex-row justify-stretch">
                <p className="min-w-[175px]">Client Count:</p>
                <p>
                  {data?.fields["Clients"]
                    ? data.fields["Clients"]?.length
                    : 0}
                </p>
              </div>
            </div>
            {/* <div className="flex flex-row justify-stretch">
              <p className="min-w-[175px]">Email Signature:</p>
              <textarea defaultValue={data?.fields["Signature"]} disabled className="resize-none rounded-xl bg-gray-200"/>
            </div> */}
          </div>
        </div>
      </div>
    </main>
  );
}
