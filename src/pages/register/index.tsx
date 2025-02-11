import Sidebar from "@/components/Sidebar";
export default function Jobs() {
  return (
    <main
      className={`min-h-screen xl:flex xl:flex-row justify-stretch  bg-gray-100`}
    >
        <div className="min-[990px]:hidden">
      <Sidebar />
      </div>
      <div className="md:p-[30px] p-1  w-full">
        {/* <p className="md:text-[26px]  text-[24px] sm:text-left text-center font-semibold mb-[30px]">
          Talent Info Update
        </p> */}
        <div className="rounded-2xl lg:p-[30px] flex flex-col gap-5 w-full md:p-[20px] p-[15px] ">
          <iframe
            id="miniExtIframe-Hs2JY9OqGMDBBqxQdxbz"
            height="800"
            src="https://web.miniextensions.com/Hs2JY9OqGMDBBqxQdxbz"
          ></iframe>
          <script
            id="embed-script-id"
            type="text/javascript"
            src="https://web.miniextensions.com/statics/embed.js?miniExtIframeId=miniExtIframe-Hs2JY9OqGMDBBqxQdxbz"
          ></script>
        </div>
      </div>
    </main>
  );
}
