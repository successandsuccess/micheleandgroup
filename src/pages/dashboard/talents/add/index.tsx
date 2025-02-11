import { GetAccountInformation } from "@/actions/getAccountInformation";
import Sidebar from "@/components/Sidebar";
import useParticipantStore from "@/store/use-participant";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export default function Jobs() {
  const { airtable_id, setDataLoading, accountType } = useParticipantStore(
    (state) => state
  );

  const [data, setData] = useState<any>();

//   useEffect(() => {
//     (async () => {
//       if (airtable_id) {
//         setDataLoading(true);
//         const result = await GetAccountInformation(airtable_id, accountType);
//         if (result.status === false) {
//           toast.error("Please check your internet connection!");
//           return;
//         }
//         const data = result.data;
//         console.log(result);
//         setData(data);
//         setDataLoading(false);
//       }
//     })();
//   }, [airtable_id]);

    return (
      <main
        className={`xl:flex xl:flex-row justify-stretch  bg-gray-100 `}
      >
        <Sidebar />
        <div className=" w-full">
          {/* <p className="md:text-[26px]  text-[24px] sm:text-left text-center font-semibold mb-[30px]">
          Talent Info Update
        </p> */}
          <div className="rounded-2xl flex flex-col gap-5 w-full  h-[calc(100vh-80px)]">
            <iframe
              id="miniExtIframe-IZNfwk1w5wxu1zBlXkWK"
              height="1000"
              src="https://web.miniextensions.com/IZNfwk1w5wxu1zBlXkWK"
            />
            <script
              id="embed-script-id"
              type="text/javascript"
              src="https://web.miniextensions.com/statics/embed.js?miniExtIframeId=miniExtIframe-IZNfwk1w5wxu1zBlXkWK"
            ></script>
          </div>
        </div>
      </main>
    );
}
