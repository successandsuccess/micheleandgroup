import Sidebar from "@/components/Sidebar";
import useParticipantStore from "@/store/use-participant";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export default function Jobs() {
  const { airtable_id, setDataLoading, accountType } = useParticipantStore(
    (state) => state
  );

  return (
    <main
      className={`min-h-screen xl:flex xl:flex-row justify-stretch  bg-gray-100`}
    >
      <Sidebar />
      <div className="md:p-[30px] p-1  w-full">
        {/* <p className="md:text-[26px]  text-[24px] sm:text-left text-center font-semibold mb-[30px]">
          Talent Info Update
        </p> */}
        <div className="rounded-2xl lg:p-[30px] flex flex-col gap-5 w-full md:p-[20px] p-[15px] ">
          <iframe
            id="miniExtIframe-vyQUCWecb3MFS2g8OBFI"
            height="1150"
            src="https://web.miniextensions.com/vyQUCWecb3MFS2g8OBFI"
          ></iframe>
          <script
            id="embed-script-id"
            type="text/javascript"
            src="https://web.miniextensions.com/statics/embed.js?miniExtIframeId=miniExtIframe-vyQUCWecb3MFS2g8OBFI"
          ></script>
        </div>
      </div>
    </main>
  );
}
