import { AddJob } from "@/actions/addJob";
import useJobState from "@/store/use-job";
import { isJobDetailValidated } from "@/utils/validation/JobDetailValidation";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { ref, set, update } from "firebase/database";
import { clientAuth, realtimedb } from "@/lib/firebaseclient";
import useParticipantStore from "@/store/use-participant";

type NavigationButtonsProps = {
  back: string;
  next: string;
  home?: boolean;
};

export const NavigationButtons = ({
  back,
  next,
  home,
}: NavigationButtonsProps) => {
  const {
    eventType,
    talentQuota,
    eventTitle,
    eventRef,
    eventDescription,
    eventDates,
    requiredAttendDay,
    address1,
    address2,
    city,
    state,
    zip,
    talentRate,
    clientRate,
    agencyFee,
    rateBasis,
    contactName,
    contactPhone,
    wardrobe,
    parking,
    makeup,
    travel,
    recap,
    social,
    additionalLocation,
    referrals,
    talentExpectations,
    cancellation,
    contacts,
    miscellaneous,
    clientAssigned,
    talentInvited,
    location,
    talentNote,
    setClientsList,
    setEventType,
    setTalentQuota,
    setEventTitle,
    setEventRef,
    setEventDescription,
    setEventDates,
    setRequiredAttendDay,
    setAddress1,
    setAddress2,
    setCity,
    setState,
    setZip,
    setTalentRate,
    setClientRate,
    setAgencyFee,
    setRateBasis,
    setContactName,
    setContactPhone,
    setWardrobe,
    setParking,
    setMakeup,
    setTravel,
    setRecap,
    setSocial,
    setAdditionalLocation,
    setReferrals,
    setTalentExpectations,
    setCancellation,
    setContacts,
    setMiscellaneous,
    setClientAssigned,
    setTalentInvited,
    setTalentNote,
  } = useJobState((state) => state);

  const { setJobErrorShown } = useParticipantStore((state) => state);

  const { airtable_id } = useParticipantStore((state) => state);

  const router = useRouter();
  const { asPath } = useRouter();
  const handleNext = async () => {
    console.log(next);
    setJobErrorShown(true);
    if (
      next === "/dashboard/jobs/add/step-two" &&
      isJobDetailValidated(
        eventTitle,
        eventRef,
        eventDescription,
        location,
        talentRate,
        clientRate,
        contactName,
        contactPhone,
        clientAssigned,
        toast
      ) === true
    )
      router.push(next);
    if (next === "/dashboard/jobs/add/review") router.push(next);
    // else if (
    //   next === "/dashboard/jobs/add/review" &&
    //   talentInvited.length === 0
    // )
    //   toast.error("Add talents to this job!");
    console.log(talentInvited, talentNote)
    if (next === "submit") {
      const data = await AddJob(
        airtable_id,
        eventType,
        talentQuota,
        eventTitle,
        eventRef,
        eventDescription,
        eventDates,
        requiredAttendDay,
        address1,
        address2,
        city,
        state,
        zip,
        talentRate,
        clientRate,
        agencyFee,
        rateBasis,
        contactName,
        contactPhone,
        wardrobe,
        parking,
        makeup,
        travel,
        recap,
        social,
        additionalLocation,
        referrals,
        talentExpectations,
        cancellation,
        contacts,
        miscellaneous,
        clientAssigned,
        talentInvited,
        location,
        talentNote,
        clientAuth?.currentUser?.email || ''
      );
      console.log(data);
      if (data.status === true) {
        if (talentInvited) {
          for (let i = 0; i < talentInvited.length; i++) {
            const databaseRef = ref(realtimedb, "invitation"); // Replace 'yourDatabasePath' with the actual path in your Realtime Database
            const newFieldKey = data.data.id + "-" + talentInvited[i].id;
            await update(databaseRef, {
              [newFieldKey]: false,
            });
          }
        }
        toast.success("Your job added successfully!");

        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1;
        const day = today.getDate();
        setClientAssigned("");
        setEventType(new Set<string>(["Tradeshow / Convention"]));
        setTalentQuota("1");
        setEventTitle("");
        setEventDescription("");
        setEventDates([
          {
            eventDate: `${year}-${month.toString().padStart(2, "0")}-${day
              .toString()
              .padStart(2, "0")}`,
            startTime: "08:00",
            endTime: "09:00",
          },
        ]);
        setAddress1("");
        setAddress2("");
        setCity("");
        setState(new Set<string>(["Florida"]));
        setZip("");
        setTalentRate("");
        setClientRate("");
        setAgencyFee(new Set<string>(["0%"]));
        setRateBasis(new Set<string>(["Total"]));
        setContactName("");
        setContactPhone("");
        setWardrobe("");
        setParking("");
        setMakeup("");
        setTravel("");
        setRecap("");
        setSocial("");
        setAdditionalLocation("");
        setReferrals("");
        setTalentExpectations("");
        setCancellation("");
        setContacts("");
        setMiscellaneous("");
        setTalentInvited([]);
        setTalentNote("");
        router.push(`/job-board/${data.data.records[0].id}`);
      } else {
        toast.error("Internal Server Error!");
      }
    }
  };

  useEffect(() => {
    if (asPath === "/dashboard/jobs/add/step-two") {
      setJobErrorShown(true);
    }
    if (
      asPath === "/dashboard/jobs/add/step-two" &&
      isJobDetailValidated(
        eventTitle,
        eventRef,
        eventDescription,
        location,
        talentRate,
        clientRate,
        contactName,
        contactPhone,
        clientAssigned,
        toast,
        true
      ) === false
    ) {
      router.push("/dashboard/jobs/add");
      window.scrollTo(0, 0);
      return;
    }
    // if (asPath === "/dashboard/jobs/add/review" && talentInvited.length === 0) {
    //   router.push("/dashboard/jobs/add/step-two");
    //   return;
    // }
  }, [asPath]);

  return (
    <div className="mt-[20px] flex justify-between">
      <Link href={back}>
        <button className="py-[15px] px-[26px] text-[16px] lg:text-[16px] transition rounded-r-full rounded-l-full border-[2px] hover:border-[#ff4081] font-bold hover:text-white hover:bg-[#ff4081]">
          Back
        </button>
      </Link>
      <button
        onClick={handleNext}
        className="py-[15px] px-[26px] text-[16px] lg:text-[16px] transition rounded-r-full rounded-l-full border-[2px] hover:border-primary font-bold hover:text-white hover:bg-primary"
      >
        {home ? "Submit" : "Next"}
      </button>
    </div>
  );
};
