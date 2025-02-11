"use client";
import { AcceptInvitation } from "@/actions/acceptInvitation";
import { DeclineInvitation } from "@/actions/declineInvitation";
import { GetInvitations } from "@/actions/getInvitation";
import Sidebar from "@/components/Sidebar";
import useParticipantStore from "@/store/use-participant";
import { Button } from "@nextui-org/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { clientAuth } from "@/lib/firebaseclient";
// import { ref, update } from "firebase/database";
// import { clientAuth, realtimedb } from "@/lib/firebaseclient";
// import Talk from "talkjs";
// import { GetClientById } from "@/actions/getClientById";
// import { GetBookerByEmail } from "@/actions/getBookerByEmail";
// import { CreateChatUser } from "@/actions/createChatUser";
// import { CreateChatRoom } from "@/actions/createChatRoom";

export default function Home() {
  const { airtable_id, setDataLoading, setInvitationBadge } =
    useParticipantStore((state) => state);

  const [invitations, setInvitations] = useState<any>([]);
  const [availableJobs, setAvailableJobs] = useState<any>([]);
  const [declinedJobs, setDeclinedJobs] = useState<any>([]);
  const [cancelldJobs, setCancelledJobs] = useState<any>([]);

  useEffect(() => {
    (async () => {
      if (airtable_id) {
        setDataLoading(true);
        const result = await GetInvitations(airtable_id);
        if (result.status === false) {
          toast.error("Please check your internet connection!");
          return;
        }
        const data = result.data;
        console.log("declined", result?.data, data.data.records);
        setInvitations(data?.["data"].records);
        setAvailableJobs(result?.data?.["available_jobs"]?.records);
        setDeclinedJobs(result?.data?.["declined_jobs"]?.records);
        setCancelledJobs(result?.data?.["cancelled_jobs"]?.records);
        setInvitationBadge(false);
        setDataLoading(false);
      }
    })();
  }, [airtable_id]);

  const handleDecline = async (job_id: string, index: number) => {
    setDataLoading(true);
    const result = await DeclineInvitation(
      job_id,
      airtable_id,
      invitations[index].fields?.["INVITED TALENT"] || [],
      invitations[index].fields?.["DECLINED TALENT"] || [],
      clientAuth?.currentUser?.email || ""
    );
    if (result.status === false) {
      toast.error("Please check your internet connection!");
      return;
    }
    toast.success("Successfully declined invitation");
    const res = await GetInvitations(airtable_id);
    if (res.status === false) {
      toast.error("Please check your internet connection!");
      return;
    }
    const data = res.data;
    console.log(data.data.records);
    setInvitations(data.data.records);
    setDataLoading(false);
    console.log(index);
  };

  const handleAccept = async (job_id: string, index: number) => {
    setDataLoading(true);

    const result = await AcceptInvitation(
      job_id,
      airtable_id,
      invitations[index].fields?.["TALENT NOT AVAILABLE"] || [],
      invitations[index].fields?.["Available Talent"] || []
    );
    if (result.status === false) {
      toast.error("Please check your internet connection!");
      return;
    }
    toast.success("Successfully accepted invitation");

    const res = await GetInvitations(airtable_id);
    if (res.status === false) {
      toast.error("Please check your internet connection!");
      return;
    }
    const data = res.data;
    setInvitations(data.data.records);
    setAvailableJobs(res?.data?.["available_jobs"]?.records);
    setDataLoading(false);
    console.log(index);
  };

  return (
    <main
      className={`min-h-screen xl:flex xl:flex-row justify-stretch  bg-gray-100`}
    >
      <Sidebar />
      <div className="md:p-[30px] p-1  w-full">
        <p className="md:text-[26px]  text-[24px] sm:text-left text-center font-semibold mb-[30px]"></p>
        <div className="flex flex-col gap-[30px]">
          <div className="rounded-2xl lg:p-[30px] md:p-[20px] p-[15px] bg-white shadow-md flex flex-col gap-2">
            <p className="text-[40px] font-bold">Invited Jobs</p>
            <p className="text-[18px] text-black">
              Below are the job opportunities you've been invited to. Please
              take a moment to review each job and indicate whether it's
              available or not.
            </p>
            {invitations?.map((item: any, index: number) =>
              !item.fields?.["Available Talent"]?.includes(airtable_id) &&
              !item.fields?.["TALENT NOT AVAILABLE"]?.includes(airtable_id) &&
              !item.fields?.["DECLINED TALENT"]?.includes(airtable_id) ? (
                <div
                  key={"available" + index + "-" + item.id}
                  className="p-3 bg-gray-100 rounded-xl flex flex-row gap-2 justify-between"
                >
                  <Link
                    href={`/job-board/${item.id}`}
                    className="md:text-[18px] text-[14px]"
                    target="blank"
                  >
                    {typeof item?.fields["TITLE W DATE"] === "object"
                      ? JSON.stringify(item?.fields["TITLE W DATE"])
                      : item?.fields["TITLE W DATE"]}
                    , {item.fields["Talent Rate"]}$/
                    {item.fields["Billing"]}
                  </Link>
                  <div className="flex flex-row gap-2 my-auto">
                    <Button
                      color="danger"
                      onClick={() => handleDecline(item.id, index)}
                    >
                      Decline
                    </Button>
                    <Button
                      color="primary"
                      onClick={() => handleAccept(item.id, index)}
                    >
                      Accept
                    </Button>
                  </div>
                </div>
              ) : (
                ""
              )
            )}
            {/* second part */}
            <p className="text-[40px] font-bold">Pending Jobs</p>
            <p className="text-[18px] text-black">
              Here are the jobs you're currently available for. You'll be
              notified upon booking. Should your availability change, kindly
              update it by clicking on the respective job link.
            </p>
            {availableJobs?.map((item: any, index: number) =>
              !item.fields?.["TALENT NOT AVAILABLE"]?.includes(airtable_id) &&
              !item.fields?.["DECLINED TALENT"]?.includes(airtable_id) ? (
                <div
                  key={"pending" + index + "-" + item.id}
                  className="p-3 bg-gray-100 rounded-xl flex flex-row gap-2 justify-between"
                >
                  <Link
                    href={`/job-board/${item.id}`}
                    className="md:text-[18px] text-[14px]"
                    target="blank"
                  >
                    {typeof item?.fields["TITLE W DATE"] === "object"
                      ? JSON.stringify(item?.fields["TITLE W DATE"])
                      : item?.fields["TITLE W DATE"]}
                    , {item?.fields["Talent Rate"]}$/
                    {item?.fields["Billing"]}
                  </Link>
                </div>
              ) : (
                ""
              )
            )}
            {/* third part */}
            <p className="text-[40px] font-bold">Declined Jobs</p>
            <p className="text-[18px] text-black">
              Listed below are the job opportunities you've turned down. You
              have the option to revisit and accept any of these offers at any
              time.
            </p>
            {declinedJobs?.map((item: any, index: number) =>
              !item.fields?.["Available Talent"]?.includes(airtable_id) &&
              !item.fields?.["TALENT NOT AVAILABLE"]?.includes(airtable_id) ? (
                <div
                  key={"declined" + index + "-" + item.id}
                  className="p-3 bg-gray-100 rounded-xl flex flex-row gap-2 justify-between"
                >
                  <Link
                    href={`/job-board/${item.id}`}
                    className="md:text-[18px] text-[14px]"
                    target="blank"
                  >
                    {typeof item?.fields["TITLE W DATE"] === "object"
                      ? JSON.stringify(item?.fields["TITLE W DATE"])
                      : item?.fields["TITLE W DATE"]}
                    , {item?.fields["Talent Rate"]}$/
                    {item?.fields["Billing"]}
                  </Link>
                </div>
              ) : (
                ""
              )
            )}
            {/* Forth part */}
            <p className="text-[40px] font-bold">Cancelled Jobs</p>
            <p className="text-[18px] text-black">
              Below are the jobs you've been scheduled for but had to cancel.
            </p>
            {cancelldJobs?.map((item: any, index: number) =>
              !item.fields?.["Available Talent"]?.includes(airtable_id) &&
              !item.fields?.["TALENT NOT AVAILABLE"]?.includes(airtable_id) ? (
                <div
                  key={"cancel" + index + "-" + item.id}
                  className="p-3 bg-gray-100 rounded-xl flex flex-row gap-2 justify-between"
                >
                  <Link
                    href={`/job-board/${item.id}`}
                    className="md:text-[18px] text-[14px]"
                    target="blank"
                  >
                    {typeof item?.fields["TITLE W DATE"] === "object"
                      ? JSON.stringify(item?.fields["TITLE W DATE"])
                      : item?.fields["TITLE W DATE"]}
                    , {item?.fields["Talent Rate"]}$/
                    {item?.fields["Billing"]}
                  </Link>
                </div>
              ) : (
                ""
              )
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
