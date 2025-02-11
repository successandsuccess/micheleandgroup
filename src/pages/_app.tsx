import Layout from "@/components/layouts/layout";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { NextUIProvider } from "@nextui-org/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-quill/dist/quill.snow.css";
import { clientAuth, realtimedb } from "@/lib/firebaseclient";
import { ref, onChildAdded } from "firebase/database";
import { useCallback, useEffect, useRef, useState } from "react";
import useParticipantStore from "@/store/use-participant";
import { Session } from "@talkjs/react";
import Talk from "talkjs";
export default function App({ Component, pageProps }: AppProps) {
  const isMounted = useRef(false);
  const { airtable_id, invitationArr, setInvitationArr, setInvitationBadge } =
    useParticipantStore((state) => state);
  // useEffect(() => {
  //   if (!isMounted.current && airtable_id) {
  //     const databaseRef = ref(realtimedb, "invitation");

  //     onChildAdded(databaseRef, (snapshot) => {
  //       const newKey = snapshot.key;
  //       const value = snapshot.val();
  //       if (
  //         value === false &&
  //         newKey?.indexOf(airtable_id) !== -1 &&
  //         airtable_id
  //       ) {
  //         console.log('Hey! here!');
  //         setInvitationArr([...invitationArr, newKey||''])
  //         toast.info("You have received Job invitation");
  //         setInvitationBadge(true);
  //       }
  //     });
  //     isMounted.current = true;
  //   }
  // }, [airtable_id]);
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
  //       id: "default",
  //       name: "default",
  //       email: "default",
  //       // photoUrl: `https://i.postimg.cc/XYTzX709/defauluser.png`,
  //       // welcomeMessage: "Hi!",
  //       role: "default",
  //     });
  //   }
  // }, [airtable_id]);

  return (
    <NextUIProvider>
      <Layout>
        {/* <Session appId="tEojaa70" syncUser={syncUser}> */}
          <Component {...pageProps} />
        {/* </Session> */}
      </Layout>
      <ToastContainer />
    </NextUIProvider>
  );
}
