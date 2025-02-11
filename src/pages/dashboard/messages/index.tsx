import Sidebar from "@/components/Sidebar";
import { clientAuth } from "@/lib/firebaseclient";
import useParticipantStore from "@/store/use-participant";
import { Inbox, Session } from "@talkjs/react";
import { useCallback } from "react";
import Talk from "talkjs";

type user = {
  name: string;
  avatar: string;
};

export default function Home() {
  const { airtable_id, accountType, setDataLoading } = useParticipantStore(
    (state) => state
  );
  // const syncUser = useCallback(() => {
  //   if (airtable_id) {
  //     return new Talk.User({
  //       id: airtable_id || "",
  //       name: clientAuth.currentUser?.displayName || "",
  //       email: clientAuth.currentUser?.email || "",
  //       // photoUrl: `https://i.postimg.cc/XYTzX709/defauluser.png`,
  //       // welcomeMessage: "Hi!",
  //       role: "default",
  //     });
  //   } else {
  //     return new Talk.User({
  //       id: "",
  //       name: "",
  //       email: "",
  //       // photoUrl: `https://i.postimg.cc/XYTzX709/defauluser.png`,
  //       // welcomeMessage: "Hi!",
  //       role: "default",
  //     });
  //   }
  // }, [airtable_id]);

  return (
    <main
      className={`max-[990px]:h-screen min-h-[calc(100vh-80px)] xl:flex xl:flex-row justify-stretch  bg-gray-100`}
    >
      <Sidebar />
      <div className="px-[30px] lg:pt-[0px] pt-[90px]  w-full">
        <div className="flex flex-col gap-[30px]">
          <p className="text-[40px] font-bold">Messages</p>
          <div className="rounded-2xl lg:p-[30px] md:p-[20px] p-[15px] bg-white shadow-md flex flex-row gap-2 h-[calc(100vh-200px)]">
            {airtable_id ? (
            //   <Session appId="tEojaa70" syncUser={syncUser}>
                <Inbox style={{ width: "100%", height: "100%" }} />
            //   </Session>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
