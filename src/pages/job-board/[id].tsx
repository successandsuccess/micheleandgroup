import { StepsLayout } from "@/components/Steps/StepsLayout";
import { NavigationButtons } from "@/components/Steps/NavigationButtons";
import Sidebar from "@/components/Sidebar";
import useJobState from "@/store/use-job";
import { Header } from "@/components/Jobs/Header";
import { Label } from "@/components/Jobs/Label";
import parse from "html-react-parser";
import { SubHeader } from "@/components/Jobs/SubHeader";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useParticipantStore from "@/store/use-participant";
import { GetJobById } from "@/actions/getJobById";
import { GetClientById } from "@/actions/getClientById";
import {
  Accordion,
  AccordionItem,
  Avatar,
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Snippet,
  useDisclosure,
} from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faLocationDot,
  faPenToSquare,
  faTrash,
  faUserPlus,
  faWrench,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { SetAvailable } from "@/actions/setAvailable";
import { SetUnAvailable } from "@/actions/setUnavailable";
import { toast } from "react-toastify";
import { BookTalent } from "@/actions/bookTalent";
import { CancleJob } from "@/actions/cancleJob";
import { StopJob } from "@/actions/stopJob";
import { ConfirmJob } from "@/actions/confirmJob";
import { useSearchParams } from "next/navigation";
import { SendMessage } from "@/actions/sendMessage";
import { SubHeaderYellow } from "@/components/Jobs/SubHeaderYellow";
import { Location } from "@/components/Jobs/Location";
import { RemoveTalent } from "@/actions/removeTalent";
import "add-to-calendar-button";
import dynamic from "next/dynamic";
import { MessageArr, SubjectArr } from "@/lib/selectoptions";
import { SendEmail } from "@/actions/sendEmail";
import { clientAuth } from "@/lib/firebaseclient";

const QuillNoSSRWrapper = dynamic(() => import("react-quill"), {
  ssr: false,
});

const Home = () => {
  const router = useRouter();
  const { airtable_id, setDataLoading, accountType } = useParticipantStore(
    (state) => state
  );
  const { clientsList } = useJobState((state) => state);
  const { eventRef, talentInvited } = useJobState((state) => state);

  const [data, setData] = useState<any>();
  const [client, setClient] = useState([]);
  const [talentPending, setTalentPending] = useState<Array<any>>([]);
  const [talentAceepted, setTalentAccepted] = useState<Array<any>>([]);
  const [talentUnAccepted, setTalentUnAccepted] = useState<Array<any>>([]);
  const [talentDeclined, setTalentDeclined] = useState<Array<any>>([]);
  const [talentBooked, setTalentBooked] = useState<Array<any>>([]);
  const [talentCanceled, setTalentCanceled] = useState<Array<any>>([]);
  const searchParams = useSearchParams();
  const [bookedTalent, setBookedTalent] = useState<Array<string>>();
  const [talentsList, setTalentsList] = useState<any>();
  const [talentWorking, setTalentWorking] = useState<any>();
  const [receipt, setReceipt] = useState<any>("");
  const [sampleProduct, setSampleProduct] = useState<any>();
  const [reimbursement, setReimbursement] = useState<any>();

  const [selectedKeys, setSelectedKeys] = useState<any>(
    new Set(["JOB INFORMATION"])
  );

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [messageOpen, setMessageOpen] = useState(false);

  const [messageType, setMessageType] = useState(
    new Set<string>([`All Talent`])
  );
  const [templateType, setTemplateType] = useState(new Set<string>([`0`]));

  const [subject, setSubject] = useState(SubjectArr[0]);
  const [message, setMessage] = useState(MessageArr[0]);

  const handleModalOpen = () => {
    setMessageOpen(!messageOpen);
  };

  useEffect(() => {
    const index = Number(Array.from(templateType).toString());
    setSubject(SubjectArr[index]);
    setMessage(MessageArr[index]);
  }, [templateType]);

  useEffect(() => {
    (async () => {
      const params = searchParams.get("available");
      if (router.query.id && airtable_id) {
        setDataLoading(true);
        const data = await GetJobById(router.query.id.toString());
        console.log(data);
        if (data.status === true) {
          setClient(data.data.data.fields?.["Company (from Client)"] || []);
          setData(data.data.data.fields);
          setBookedTalent(data.data.data.fields?.["Booked Talent"]);
          setTalentWorking(data.data.data.fields?.["TALENT WORKING"]);
          setSampleProduct(data.data.data.fields?.["SAMPLE PRODUCT"]);
          setReimbursement(data.data.data.fields?.["REIMBURSEMENT"]);
          if (
            data.data.data.fields?.["Booked Talent"]?.length > 0 ||
            data.data.data.fields?.["ConfirmBooking"]
          ) {
            setReceipt(data.data.data.fields?.["RECEIPTS"]);
          }
          console.log(data.data.data.fields);
          console.log(
            new Date(data.data.data.fields?.["End Date/Time"]) < new Date()
          );
          if (accountType === "client" || accountType === "booker") {
            var talents_ids: any = [];
            setTalentPending(data.data?.unaccepted?.records || []);
            data.data?.unaccepted?.records?.map((item: any) => {
              talents_ids.push(item?.id);
            });
            setTalentAccepted(data.data?.available?.records || []);
            data.data?.available?.records?.map((item: any) => {
              talents_ids.push(item?.id);
            });
            setTalentUnAccepted(data.data?.unavailable?.records || []);
            data.data?.unavailable?.records?.map((item: any) => {
              talents_ids.push(item?.id);
            });
            setTalentDeclined(data.data?.talent_declined?.records || []);
            data.data?.talent_declined?.records?.map((item: any) => {
              talents_ids.push(item?.id);
            });
            setTalentBooked(data.data?.booked?.records || []);
            data.data?.booked?.records?.map((item: any) => {
              talents_ids.push(item?.id);
            });
            setTalentCanceled(data.data?.cancel?.records || []);
            data.data?.cancel?.records?.map((item: any) => {
              talents_ids.push(item?.id);
            });
            setTalentsList(talents_ids);
          }
          if (params === "true") {
            console.log("available");
            const res = await SetAvailable(
              router?.query?.id?.toString() || "",
              airtable_id,
              data?.data?.data?.fields?.["Available Talent"] || [],
              data?.data?.data?.fields?.["TALENT NOT AVAILABLE"] || []
            );
            setData(res.data.data.fields);
            router.push(`/job-board/${router?.query?.id?.toString()}`);
          } else if (params === "false") {
            console.log("unavailable");
            const res = await SetUnAvailable(
              router?.query?.id?.toString() || "",
              airtable_id,
              data?.data?.data?.fields?.["Available Talent"] || [],
              data?.data?.data?.fields?.["TALENT NOT AVAILABLE"] || []
            );
            setData(res.data.data.fields);
            router.push(`/job-board/${router?.query?.id?.toString()}`);
          }
        }
        setDataLoading(false);
      }
      // else {
      //   router.push("/");
      // }
    })();
  }, [router.query.id, airtable_id]);

  const handleAvailable = async (type: boolean) => {
    setDataLoading(true);
    var res;
    if (type === true) {
      res = await SetAvailable(
        router?.query?.id?.toString() || "",
        airtable_id,
        data?.["Available Talent"] || [],
        data?.["TALENT NOT AVAILABLE"] || []
      );
    } else {
      res = await SetUnAvailable(
        router?.query?.id?.toString() || "",
        airtable_id,
        data?.["Available Talent"] || [],
        data?.["TALENT NOT AVAILABLE"] || []
      );
    }
    if (res.status) {
      toast.success("Successfully submited!");
      setData(res.data.data.fields);
    } else {
      toast.error("Internal server error!");
    }
    setDataLoading(false);
  };

  const handleBookTalent = async (id: string) => {
    setDataLoading(true);
    const result = await BookTalent(
      router?.query?.id?.toString() || "",
      id,
      clientAuth?.currentUser?.email || ""
    );
    console.log(result);
    router.reload();
    setDataLoading(false);
  };

  const handleCancleJob = async () => {
    // router.query.id
    setDataLoading(true);
    await CancleJob(
      router?.query?.id?.toString() || "",
      clientAuth?.currentUser?.email || ""
    );
    setDataLoading(false);
    router.push("/dashboard/");
  };

  const handleCancel = async () => {
    setDataLoading(true);
    await StopJob(
      router?.query?.id?.toString() || "",
      airtable_id,
      clientAuth?.currentUser?.email || ""
    );
    setDataLoading(false);
    router.push("/job-board");
  };

  const handleConfirm = async () => {
    setDataLoading(true);
    const ipresponse: any = await fetch("https://ipinfo.io/json");
    const ipdata = await ipresponse.json();
    const result = await ConfirmJob(
      router?.query?.id?.toString() || "",
      ipdata.ip,
      airtable_id
    );
    console.log(result);
    if (result.status === true) {
      toast.success("Great, confirmed!");
      console.log(result);
      setData(result.data.data.fields);
    }
    setDataLoading(false);
  };

  const handleSendMessage = async (id: string) => {
    setDataLoading(true);
    await SendMessage(
      id,
      router?.query?.id?.toString() || "",
      clientAuth?.currentUser?.email || ""
    );
    toast.success("The email has been sent successfully!");
    setDataLoading(false);
  };

  const handleDelete = async (id: string) => {
    setDataLoading(true);
    await RemoveTalent(
      router?.query?.id?.toString() || "",
      id,
      clientAuth?.currentUser?.email || ""
    );
    toast.success("Talent has been removed!");
    router.reload();
  };

  const handleSubmit = async () => {
    handleModalOpen();
    setDataLoading(true);
    const index = Number(Array.from(templateType).toString());
    console.log(talentAceepted);
    var talent_ids: any = [];
    switch (Array.from(messageType).toString()) {
      case "All Talent":
        for (let i = 0; i < talentBooked?.length; i++)
          talent_ids.push({
            id: talentBooked[i].id,
            email: talentBooked[i].fields.Email,
            name: talentBooked[i].fields["TALENT FULL NAME"],
          });
        for (let i = 0; i < talentAceepted?.length; i++)
          talent_ids.push({
            id: talentAceepted[i].id,
            email: talentAceepted[i].fields.Email,
            name: talentAceepted[i].fields["TALENT FULL NAME"],
          });
        for (let i = 0; i < talentPending?.length; i++)
          talent_ids.push({
            id: talentPending[i].id,
            email: talentPending[i].fields.Email,
            name: talentPending[i].fields["TALENT FULL NAME"],
          });
        break;
      case "Talent Not Responded":
        for (let i = 0; i < talentPending?.length; i++)
          talent_ids.push({
            id: talentPending[i].id,
            email: talentPending[i].fields.Email,
            name: talentPending[i].fields["TALENT FULL NAME"],
          });
        break;
      case "Confirmed Talent":
        if (data?.["ConfirmBooking"] === "Yes") {
          for (let i = 0; i < talentBooked?.length; i++)
            talent_ids.push({
              id: talentBooked[i].id,
              email: talentBooked[i].fields.Email,
              name: talentBooked[i].fields["TALENT FULL NAME"],
            });
        }
        break;
      case "Booked Talent":
        if (data?.["ConfirmBooking"] !== "Yes") {
          for (let i = 0; i < talentBooked?.length; i++)
            talent_ids.push({
              id: talentBooked[i].id,
              email: talentBooked[i].fields.Email,
              name: talentBooked[i].fields["TALENT FULL NAME"],
            });
        }
        break;
    }
    const subject_temp = subject.replaceAll("[title]", data?.["Event"]);
    var message_temp = message;
    message_temp = message_temp.replaceAll("[title]", data?.["Event"]);
    message_temp = message_temp.replaceAll(
      "[event_type]",
      data?.["Type of Event"]
    );
    message_temp = message_temp.replaceAll(
      "[signature]",
      clientAuth.currentUser?.displayName || ""
    );
    message_temp = message_temp.replaceAll(
      "[link]",
      `${
        process.env.NEXT_PUBLIC_SERVER_URI
      }/job-board/${router?.query?.id?.toString()}`
    );
    await SendEmail(
      router?.query?.id?.toString() || "",
      talent_ids,
      subject_temp,
      message_temp,
      clientAuth?.currentUser?.email || ""
    );
    toast.success("Message has been sent successfully!");
    setDataLoading(false);
  };

  return (
    <main
      className={`min-h-screen xl:flex xl:flex-row justify-stretch  bg-gray-50`}
    >
      <Sidebar />
      <div className="min-[990px]:pt-[30px] pt-[110px] px-[30px]  w-full">
        {/* <p className="md:text-[26px]  text-[24px] sm:text-left text-center font-semibold mb-[30px]">
          Add Job
        </p> */}
        <div className="flex flex-col gap-[30px]">
          <div className="rounded-2xl lg:p-[30px] md:p-[20px] p-[15px] bg-white shadow-md">
            <div className="flex flex-col gap-3 min-h-[200px] md:px-5">
              <div className="text-center mb-[30px]">
                {accountType === "talent" &&
                data?.["Booked Talent"]?.includes(airtable_id) &&
                data?.["ConfirmBooking"] !== "Yes" ? (
                  <p className="bg-primary p-3 bg-opacity-50 rounded-xl mb-[20px]">
                    You are booked for this job, please confirm
                  </p>
                ) : (
                  ""
                )}
                {accountType === "talent" &&
                data?.["Booked Talent"]?.includes(airtable_id) &&
                data?.["ConfirmBooking"] === "Yes" ? (
                  <p className="bg-primary p-3 bg-opacity-50 rounded-xl mb-[20px]">
                    You are confirmed for this job
                  </p>
                ) : (
                  ""
                )}
                {accountType === "talent" &&
                data?.["Available Talent"]?.includes(airtable_id) &&
                !data?.["Booked Talent"]?.includes(airtable_id) ? (
                  <p className="bg-primary p-3 bg-opacity-50 rounded-xl mb-[20px]">
                    You have marked available for this job, you will be notified
                    if you are booked for the job
                  </p>
                ) : (
                  ""
                )}
                {accountType === "talent" &&
                data?.["TALENT NOT AVAILABLE"]?.includes(airtable_id) ? (
                  <p className="bg-primary p-3 bg-opacity-50 rounded-xl mb-[20px]">
                    You have marked unavailable for this job
                  </p>
                ) : (
                  ""
                )}
                {accountType === "talent" &&
                !data?.["TALENT NOT AVAILABLE"]?.includes(airtable_id) &&
                !data?.["Available Talent"]?.includes(airtable_id) &&
                data?.["Booked Talent"]?.[0] !== airtable_id ? (
                  <p className="bg-[#ff4081] p-3 bg-opacity-50 rounded-xl mb-[20px]">
                    You didn't mark available or unavailable for this job
                  </p>
                ) : (
                  ""
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 md:gap-2 gap-5 mb-[20px]">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {accountType === "booker" ? (
                      <button
                        onClick={() =>
                          router.push(`edit/detail/${router.query.id}`)
                        }
                        className="flex font-bold flex-row py-[14px] px-[28px] text-[15px] 2xl:text-[18px] gap-2 bg-primary h-[55px] my-auto rounded-l-full rounded-r-full  hover:bg-opacity-60 transition ease-in-out duration-300"
                      >
                        <FontAwesomeIcon
                          icon={faPenToSquare}
                          className="pt-1"
                        />
                        Edit Detail
                      </button>
                    ) : (
                      ""
                    )}
                    {accountType === "booker" ? (
                      <button
                        onClick={handleCancleJob}
                        className="flex font-bold flex-row py-[14px] px-[28px] text-[15px] 2xl:text-[18px]  gap-2 bg-[#ff4081] h-[55px] my-auto rounded-l-full rounded-r-full hover:bg-opacity-60 transition ease-in-out duration-300"
                      >
                        <FontAwesomeIcon icon={faTrash} className="pt-1" />
                        Remove Job
                      </button>
                    ) : (
                      ""
                    )}
                    {accountType === "booker" ? (
                      <button
                        onClick={() =>
                          router.push(`edit/talent/${router.query.id}`)
                        }
                        className="flex font-bold flex-row py-[14px] px-[28px] text-[15px] 2xl:text-[18px] gap-2 bg-primary h-[55px] my-auto rounded-l-full rounded-r-full  hover:bg-opacity-60 transition ease-in-out duration-300"
                      >
                        <FontAwesomeIcon icon={faUserPlus} className="pt-1" />
                        Add Talents
                      </button>
                    ) : (
                      ""
                    )}
                    {accountType === "booker" ? (
                      <div className="h-[55px] max-lg:hidden"></div>
                    ) : (
                      ""
                    )}
                    {accountType === "talent" &&
                    data?.["Booked Talent"]?.includes(airtable_id) &&
                    data?.["ConfirmBooking"] !== "Yes" ? (
                      <button
                        onClick={handleConfirm}
                        disabled={
                          (data?.["ConfirmBooking"] === "Yes" &&
                            data?.["Booked Talent"]?.[0] === airtable_id) ||
                          new Date() > new Date(data?.["End Date/Time"])
                        }
                        className="flex font-bold flex-row py-[14px] px-[28px] text-[15px] 2xl:text-[18px] gap-2 disabled:bg-gray-200 bg-[#00ff00] h-[55px] my-auto rounded-l-full rounded-r-full hover:bg-opacity-60 transition ease-in-out duration-300"
                      >
                        <FontAwesomeIcon icon={faCheck} className="pt-1" />
                        CONFIRM
                      </button>
                    ) : (
                      ""
                    )}
                    {accountType === "talent" &&
                    data?.["Booked Talent"]?.includes(airtable_id) ? (
                      <button
                        onClick={() => onOpenChange()}
                        disabled={
                          new Date() > new Date(data?.["End Date/Time"])
                        }
                        className="flex font-bold flex-row py-[14px] px-[28px] text-[15px] 2xl:text-[18px]  gap-2  disabled:bg-gray-200 bg-[#ff4081] h-[55px] my-auto rounded-l-full rounded-r-full hover:bg-opacity-60 transition ease-in-out duration-300"
                      >
                        <FontAwesomeIcon icon={faXmark} className="pt-1" />
                        CANCEL JOB
                      </button>
                    ) : (
                      ""
                    )}

                    {accountType === "talent" &&
                    !data?.["Booked Talent"]?.includes(airtable_id) ? (
                      <button
                        className="flex font-bold flex-row py-[14px] px-[28px] text-[15px] 2xl:text-[18px]  gap-2 bg-[#00ff00] disabled:bg-gray-200 h-[55px] my-auto rounded-l-full rounded-r-full hover:bg-primarylight transition ease-in-out duration-300"
                        onClick={() => handleAvailable(true)}
                        disabled={
                          data?.["Available Talent"]?.includes(airtable_id) ||
                          data?.["Booked Talent"]?.includes(airtable_id) ||
                          new Date() > new Date(data?.["End Date/Time"])
                            ? true
                            : false
                        }
                      >
                        <FontAwesomeIcon icon={faCheck} className="pt-1" />
                        AVAILABLE
                      </button>
                    ) : (
                      ""
                    )}
                    {accountType === "talent" &&
                    !data?.["Booked Talent"]?.includes(airtable_id) ? (
                      <button
                        className="flex  font-bold flex-row py-[14px] px-[28px] text-[15px] 2xl:text-[18px] gap-2 text-white disabled:text-black disabled:bg-gray-200 bg-[#ff4081] h-[55px] my-auto rounded-l-full rounded-r-full hover:bg-[#ff4081dd] transition ease-in-out duration-300"
                        onClick={() => handleAvailable(false)}
                        disabled={
                          data?.["TALENT NOT AVAILABLE"]?.includes(
                            airtable_id
                          ) ||
                          data?.["Booked Talent"]?.includes(airtable_id) ||
                          new Date() > new Date(data?.["End Date/Time"])
                            ? true
                            : false
                        }
                      >
                        <FontAwesomeIcon icon={faCheck} className="pt-1" />
                        NOT AVAILABLE
                      </button>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                    <div
                      className={`max-md:hidden h-[55px] ${
                        accountType === "booker" ? "max-lg:hidden" : ""
                      }`}
                    ></div>
                    <div
                      className={`max-md:hidden h-[55px] ${
                        accountType === "booker" ? "" : "hidden"
                      }`}
                    ></div>
                    <div
                      className={`max-md:hidden h-[55px] ${
                        accountType === "booker" ? "" : "hidden"
                      }`}
                    ></div>
                    {(accountType === "talent" &&
                      data?.["Booked Talent"]?.includes(airtable_id) &&
                      data?.["ConfirmBooking"]) === "Yes" ||
                    accountType === "booker" ? (
                      <Dropdown>
                        <DropdownTrigger>
                          <button className="flex flex-row py-[14px] px-[28px] text-[15px] 2xl:text-[18px]  gap-2 cursor-pointer  bg-primary h-[55px] my-auto rounded-l-full rounded-r-full hover:bg-opacity-60 transition ease-in-out duration-300">
                            <FontAwesomeIcon icon={faWrench} className="pt-1" />
                            Important Links
                          </button>
                        </DropdownTrigger>
                        <DropdownMenu aria-label="Static Actions">
                          <DropdownItem
                            key="message"
                            className={`${
                              accountType === "talent" ? "" : "hidden"
                            }`}
                          >
                            <a
                              href={`mailto:${data?.["Bookers"]?.email}?subject=TALENT MESSAGE: ${data?.["Event"]}`}
                              className="no-underline"
                            >
                              Message Booker
                            </a>
                          </DropdownItem>
                          <DropdownItem
                            key="package"
                            className={`${
                              accountType === "booker" ? "" : "hidden"
                            }`}
                          >
                            <Link
                              href={`/dashboard/add-package/?id=${
                                router?.query?.id
                              }&talents=${talentsList?.join(",")}`}
                              className="no-underline"
                            >
                              Send Package
                            </Link>
                          </DropdownItem>
                          <DropdownItem
                            key="email"
                            className={`${
                              accountType === "booker" ? "" : "hidden"
                            }`}
                            onClick={handleModalOpen}
                          >
                            {/* <Link href="" className="no-underline"> */}
                            Send Message
                            {/* </Link> */}
                          </DropdownItem>
                          <DropdownItem
                            key="promotion"
                            className={`${
                              data?.["Promo Checklist"] ? "" : "hidden"
                            }`}
                          >
                            <a
                              href={data?.["Promo Checklist"]}
                              className="no-underline"
                            >
                              Download Promotion Checklist
                            </a>
                          </DropdownItem>
                          <DropdownItem
                            key="recap"
                            className={`${
                              data?.["RECAP LINK"] ? "" : "hidden"
                            }`}
                          >
                            <a
                              href={data?.["RECAP LINK"]}
                              className="no-underline"
                            >
                              View Recap
                            </a>
                          </DropdownItem>
                          <DropdownItem
                            key="brand information"
                            className={`${
                              data?.["BRAND INFO LINK"] ? "" : "hidden"
                            }`}
                          >
                            <a
                              href={data?.["BRAND INFO LINK"]}
                              className="no-underline"
                            >
                              View Brand Information
                            </a>
                          </DropdownItem>
                          <DropdownItem
                            key="expense receipts"
                            className={`${
                              data?.["RECEIPT UPLOAD LINK"] ? "" : "hidden"
                            }`}
                          >
                            <a
                              href={data?.["RECEIPT UPLOAD LINK"]}
                              className="no-underline"
                            >
                              Upload Expense Receipts
                            </a>
                          </DropdownItem>
                          <DropdownItem
                            key="credit card authorization form"
                            className={`${
                              data?.["CREDIT CARD AUTHORIZATION FORM LINK"]
                                ? ""
                                : "hidden"
                            }`}
                          >
                            <a
                              href={
                                data?.["CREDIT CARD AUTHORIZATION FORM LINK"]
                              }
                              className="no-underline"
                            >
                              Credit Card Authorization Form
                            </a>
                          </DropdownItem>
                          <DropdownItem key="Activity" className={`${accountType === 'booker' ? '' : 'hidden'}`}>
                            <a href={`/dashboard/activities?search=${data?.['Event']}`} target="_blank" className="no-underline">
                              View Activity
                            </a>
                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
                <Header text={data?.["Event"]} />
                <div className="text-left mt-[30px]">
                  <div className="flex flex-col md:flex-row gap-5 md:px-[50px] mb-[30px]">
                    <div className="flex flex-col gap-5 md:w-[70%] w-full">
                      <div>
                        <SubHeader text="TYPE OF JOB" />
                        <p>{data?.["Type of Event"]}</p>
                      </div>
                      <div>
                        <SubHeader text="RATE" />
                        <div>
                          $ {data?.["Talent Rate"]} / {data?.["Billing"]}
                        </div>
                      </div>
                      {(accountType === "talent" &&
                        data?.["ConfirmBooking"] === "Yes" &&
                        data?.["Booked Talent"]?.[0] === airtable_id) ||
                      accountType === "booker" ? (
                        data?.["ONSITE CONTACT NAME"] ? (
                          <div className="">
                            <SubHeader text="ON-SITE CONTACT" />
                            <div>{data?.["ONSITE CONTACT NAME"]}</div>
                          </div>
                        ) : (
                          ""
                        )
                      ) : (
                        ""
                      )}
                    </div>
                    <div className="grow flex flex-col gap-5">
                      <div>
                        <SubHeader text="CLIENT" />
                        {client?.map((item: any, index: number) => (
                          <div
                            key={"client" + index}
                            className="flex flex-row gap-1"
                          >
                            <div className="w-2 h-2 rounded-full bg-black my-auto"></div>
                            {item}
                          </div>
                        ))}
                      </div>
                      <div>
                        <SubHeader text="BOOKER" />
                        <p>{data?.["Bookers"]?.name}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 md:px-[42px] mb-[30px]">
                    <table className="border-none w-full">
                      <thead className="border-none">
                        <tr className=" border-none">
                          <th className="text-left border-none  md:text-[16px] text-[14px]">
                            DATE
                          </th>
                          <th className="text-left border-none  md:text-[16px] text-[14px]">
                            START
                          </th>
                          <th className="text-left border-none md:text-[16px] text-[14px]">
                            END
                          </th>
                          {accountType === "booker" ||
                          (data?.["ConfirmBooking"] === "Yes" &&
                            data?.["Booked Talent"]?.[0] === airtable_id) ? (
                            <th className="text-left border-none md:text-[16px] text-[14px]">
                              Action
                            </th>
                          ) : (
                            ""
                          )}
                        </tr>
                      </thead>
                      <tbody className="border-none">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]?.map(
                          (item: any, index: number) =>
                            index === 0 ? (
                              <tr
                                className="border-none"
                                key={"location info" + index}
                              >
                                <td className="border-none md:text-[16px] text-[12px]">
                                  {new Date(
                                    data?.["Start Date/Time"]
                                  ).toLocaleDateString("en-us", {
                                    year: "numeric",
                                    month: "numeric",
                                    day: "numeric",
                                    timeZone: "UTC",
                                  })}
                                </td>
                                <td className="border-none  md:text-[16px] text-[12px]">
                                  {
                                    new Date(data?.["Start Date/Time"])
                                      .toLocaleDateString("en-us", {
                                        hour: "numeric",
                                        hour12: true,
                                        minute: "numeric",
                                        timeZone: "UTC",
                                      })
                                      .split(", ")?.[1]
                                  }
                                  <span className="text-red-500 pl-2">UTC</span>
                                </td>
                                <td className="border-none  md:text-[16px] text-[12px]">
                                  {
                                    new Date(data?.["End Date/Time"])
                                      .toLocaleDateString("en-us", {
                                        hour: "numeric",
                                        hour12: true,
                                        minute: "numeric",
                                        timeZone: "UTC",
                                      })
                                      .split(", ")?.[1]
                                  }
                                  <span className="text-red-500 pl-2">UTC</span>
                                </td>
                                {data?.["Start Date/Time"] &&
                                (accountType === "booker" ||
                                  (data?.["ConfirmBooking"] === "Yes" &&
                                    data?.["Booked Talent"]?.[0] ===
                                      airtable_id)) ? (
                                  <td className="border-none  md:text-[16px] text-[12px]">
                                    <add-to-calendar-button
                                      name={data?.["Event"]}
                                      description={`${
                                        process.env.NEXT_PUBLIC_SERVER_URI
                                      }/job-board/${router.query.id?.toString()}/`}
                                      startDate={
                                        new Date(data?.["Start Date/Time"])
                                          ?.toISOString()
                                          ?.split("T")?.[0]
                                      }
                                      endDate={
                                        new Date(data?.["End Date/Time"])
                                          ?.toISOString()
                                          ?.split("T")?.[0]
                                      }
                                      startTime={
                                        new Date(data?.["Start Date/Time"])
                                          .toLocaleDateString("en-us", {
                                            hour: "numeric",
                                            hour12: false,
                                            minute: "numeric",
                                            timeZone: "UTC",
                                          })
                                          .split(", ")?.[1]
                                      }
                                      endTime={
                                        new Date(data?.["End Date/Time"])
                                          .toLocaleDateString("en-us", {
                                            hour: "numeric",
                                            hour12: false,
                                            minute: "numeric",
                                            timeZone: "UTC",
                                          })
                                          .split(", ")?.[1]
                                      }
                                      location={
                                        data?.["Account w/ Full Address"]?.[0]
                                      }
                                      options="['Apple','Google','iCal','Microsoft365','Outlook.com','Yahoo']"
                                      timeZone="EST"
                                      trigger="click"
                                      inline
                                      listStyle="dropdown-static"
                                      buttonStyle="text"
                                      iCalFileName={data?.["Event"]}
                                    />
                                  </td>
                                ) : (
                                  ""
                                )}
                              </tr>
                            ) : data?.[`Day ${index + 1} Start`] ? (
                              <tr
                                className="border-none"
                                key={"location info" + index}
                              >
                                <td className="border-none md:text-[16px] text-[12px]">
                                  {data?.[`Day ${index + 1} Start`]
                                    ? new Date(
                                        data?.[`Day ${index + 1} Start`]
                                      ).toLocaleDateString("en-us", {
                                        year: "numeric",
                                        month: "numeric",
                                        day: "numeric",
                                        timeZone: "UTC",
                                      })
                                    : ""}
                                </td>
                                <td className="border-none md:text-[16px] text-[12px]">
                                  {data?.[`Day ${index + 1} Start`]
                                    ? new Date(data?.[`Day ${index + 1} Start`])
                                        .toLocaleDateString("en-us", {
                                          hour: "numeric",
                                          hour12: true,
                                          minute: "numeric",
                                          timeZone: "UTC",
                                        })
                                        .split(", ")?.[1]
                                    : ""}
                                </td>
                                <td className="border-none md:text-[16px] text-[12px]">
                                  {data?.[`Day ${index + 1} End`]
                                    ? new Date(data?.[`Day ${index + 1} End`])
                                        .toLocaleDateString("en-us", {
                                          hour: "numeric",
                                          hour12: true,
                                          minute: "numeric",
                                          timeZone: "UTC",
                                        })
                                        .split(", ")?.[1]
                                    : ""}
                                </td>
                                {accountType === "booker" ||
                                (data?.["ConfirmBooking"] === "Yes" &&
                                  data?.["Booked Talent"]?.[0] ===
                                    airtable_id) ? (
                                  <td className="border-none  md:text-[16px] text-[12px]">
                                    <add-to-calendar-button
                                      name={data?.["Event"]}
                                      startDate={
                                        new Date(
                                          data?.[`Day ${index + 1} Start`]
                                        )
                                          ?.toISOString()
                                          ?.split("T")?.[0]
                                      }
                                      endDate={
                                        new Date(data?.[`Day ${index + 1} End`])
                                          ?.toISOString()
                                          ?.split("T")?.[0]
                                      }
                                      startTime={
                                        new Date(
                                          data?.[`Day ${index + 1} Start`]
                                        )
                                          .toLocaleDateString("en-us", {
                                            hour: "numeric",
                                            hour12: false,
                                            minute: "numeric",
                                            timeZone: "UTC",
                                          })
                                          .split(", ")?.[1]
                                      }
                                      endTime={
                                        new Date(data?.[`Day ${index + 1} End`])
                                          .toLocaleDateString("en-us", {
                                            hour: "numeric",
                                            hour12: false,
                                            minute: "numeric",
                                            timeZone: "UTC",
                                          })
                                          .split(", ")?.[1]
                                      }
                                      location={
                                        data?.["Account w/ Full Address"]?.[0]
                                      }
                                      options="['Apple','Google','iCal','Microsoft365','Outlook.com','Yahoo']"
                                      timeZone="EST"
                                      trigger="click"
                                      inline
                                      listStyle="dropdown-static"
                                      buttonStyle="text"
                                      iCalFileName={data?.["Event"]}
                                    />
                                  </td>
                                ) : (
                                  ""
                                )}
                              </tr>
                            ) : (
                              ""
                            )
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="bg-white md:px-[42px] mb-[30px] flex flex-col gap-5 ">
                    <div className="text-left border-none md:text-[16px] text-[14px] font-bold">
                      LOCATION
                    </div>
                    {data?.["Account w/ Full Address"]?.map(
                      (item: any, index: number) => (
                        <div key={"address" + index} className="border-none">
                          <Location text={item} />
                        </div>
                      )
                    )}
                    {accountType === "booker" ? (
                      <div className="bg-white p-3 rounded-xl">
                        <SubHeader text="Talent List" />
                        <div className="flex flex-col gap-5">
                          {talentBooked?.map((item: any, index) => (
                            <div
                              className="flex flex-row md:gap-5 justify-between flex-wrap"
                              key={index}
                            >
                              <Link
                                key={index}
                                href={`/dashboard/talents/${item?.id}`}
                                target="_blank"
                                className="my-auto flex flex-row gap-2 md:min-w-64 justify-start w-full md:w-auto"
                              >
                                <Avatar
                                  src={item?.fields?.Pictures?.split(",")?.[0]}
                                  name={item?.fields?.["TALENT FULL NAME"]}
                                />
                                <p className="my-auto">
                                  {item?.fields?.["TALENT FULL NAME"]}
                                </p>
                              </Link>
                              <div className="flex flex-row gap-3">
                                {data?.["ConfirmBooking"] === "Yes" ? (
                                  <Chip
                                    color="success"
                                    className="my-auto md:text-[16px] text-[12px]"
                                  >
                                    Confirmed
                                  </Chip>
                                ) : (
                                  <Chip
                                    color="danger"
                                    className="my-auto md:text-[16px] text-[12px]"
                                  >
                                    Booked
                                  </Chip>
                                )}
                                <p className="my-auto">
                                  {item?.fields?.["Cell Phone"]}
                                </p>
                              </div>
                              <Button
                                isIconOnly
                                color="danger"
                                variant="bordered"
                                size="sm"
                                className="bg-white my-auto"
                                onClick={() => handleDelete(item?.id)}
                              >
                                <FontAwesomeIcon icon={faTrash} />
                              </Button>
                            </div>
                          ))}
                          {talentAceepted?.map((item: any, index) => (
                            <div
                              className="flex flex-row md:gap-5 justify-between flex-wrap"
                              key={index}
                            >
                              <Link
                                key={index}
                                href={`/dashboard/talents/${item?.id}`}
                                target="_blank"
                                className="my-auto flex flex-row gap-2 md:min-w-64 justify-start w-full md:w-auto"
                              >
                                <Avatar
                                  src={item?.fields?.Pictures?.split(",")?.[0]}
                                  name={item?.fields?.["TALENT FULL NAME"]}
                                />
                                <p className="my-auto">
                                  {item?.fields?.["TALENT FULL NAME"]}
                                </p>
                              </Link>
                              <Chip
                                color="success"
                                className="my-auto md:text-[16px] text-[12px]"
                              >
                                Available
                              </Chip>
                              <Button
                                color="danger"
                                className={`${
                                  bookedTalent?.includes(item.id) ||
                                  bookedTalent?.[0]
                                    ? "hidden"
                                    : ""
                                }`}
                                onClick={() => handleBookTalent(item.id)}
                              >
                                Book Talent
                              </Button>
                              <Button
                                isIconOnly
                                color="danger"
                                variant="bordered"
                                size="sm"
                                className="bg-white"
                                onClick={() => handleDelete(item?.id)}
                              >
                                <FontAwesomeIcon icon={faTrash} />
                              </Button>
                            </div>
                          ))}
                          {talentUnAccepted?.map((item: any, index) => (
                            <div
                              className="flex flex-row md:gap-5 justify-between flex-wrap"
                              key={index}
                            >
                              <Link
                                key={index}
                                href={`/dashboard/talents/${item?.id}`}
                                target="_blank"
                                className="flex flex-row gap-2 md:min-w-64 justify-start w-full md:w-auto"
                              >
                                <Avatar
                                  src={item?.fields?.Pictures?.split(",")?.[0]}
                                  name={item?.fields?.["TALENT FULL NAME"]}
                                />
                                <p className="my-auto">
                                  {item?.fields?.["TALENT FULL NAME"]}
                                </p>{" "}
                              </Link>
                              <Chip
                                color="primary"
                                className="md:text-[16px] text-[12px]"
                              >
                                Unavailable
                              </Chip>
                              <Button
                                color="danger"
                                className={`${
                                  bookedTalent?.includes(item.id) ||
                                  bookedTalent?.[0]
                                    ? "hidden"
                                    : ""
                                }`}
                                onClick={() => handleBookTalent(item.id)}
                              >
                                Book Talent
                              </Button>
                              <Button
                                isIconOnly
                                color="danger"
                                variant="bordered"
                                size="sm"
                                className="bg-white my-auto"
                                onClick={() => handleDelete(item?.id)}
                              >
                                <FontAwesomeIcon icon={faTrash} />
                              </Button>
                            </div>
                          ))}
                          {talentPending?.map((item: any, index) => {
                            return (
                              <div
                                className="flex flex-row md:gap-5 justify-between flex-wrap"
                                key={index}
                              >
                                <Link
                                  key={index}
                                  href={`/dashboard/talents/${item?.id}`}
                                  target="_blank"
                                  className="flex flex-row gap-2 md:min-w-64 justify-start w-full md:w-auto"
                                >
                                  <Avatar
                                    src={
                                      item?.fields?.Pictures?.split(",")?.[0]
                                    }
                                    name={item?.fields?.["TALENT FULL NAME"]}
                                    style={{ verticalAlign: "middle" }}
                                  />
                                  <p className="my-auto">
                                    {item?.fields?.["TALENT FULL NAME"]}
                                  </p>
                                </Link>
                                <Chip
                                  className="my-auto md:text-[16px] text-[12px]"
                                  color="secondary"
                                >
                                  Invited
                                </Chip>
                                <Button
                                  color="danger"
                                  className={`${
                                    bookedTalent?.includes(item.id) ||
                                    bookedTalent?.[0]
                                      ? "hidden md:text-[16px] text-[12px]"
                                      : "md:text-[16px] text-[12px]"
                                  }`}
                                  onClick={() => handleBookTalent(item.id)}
                                >
                                  Book Talent
                                </Button>
                                <Button
                                  color="primary"
                                  size="sm"
                                  onClick={() => handleSendMessage(item?.id)}
                                  className="my-auto md:text-[16px] text-[12px]"
                                >
                                  Send message again
                                </Button>
                                <Button
                                  isIconOnly
                                  color="danger"
                                  variant="bordered"
                                  size="sm"
                                  className="bg-white my-auto"
                                  onClick={() => handleDelete(item?.id)}
                                >
                                  <FontAwesomeIcon icon={faTrash} />
                                </Button>
                              </div>
                            );
                          })}
                          {talentDeclined?.map((item: any, index) => (
                            <div
                              className="flex flex-row md:gap-5 justify-between flex-wrap"
                              key={index}
                            >
                              <Link
                                key={index}
                                href={`/dashboard/talents/${item?.id}`}
                                target="_blank"
                                className="flex flex-row gap-2 md:min-w-64 justify-start w-full md:w-auto"
                              >
                                <Avatar
                                  src={item?.fields?.Pictures?.split(",")?.[0]}
                                  name={item?.fields?.["TALENT FULL NAME"]}
                                />
                                <p className="my-auto">
                                  {item?.fields?.["TALENT FULL NAME"]}
                                </p>{" "}
                              </Link>
                              <Chip
                                color="default"
                                className="my-auto md:text-[16px] text-[12px]"
                              >
                                Invitation declined
                              </Chip>
                              <Button
                                isIconOnly
                                color="danger"
                                variant="bordered"
                                size="sm"
                                className="bg-white my-auto "
                                onClick={() => handleDelete(item?.id)}
                              >
                                <FontAwesomeIcon icon={faTrash} />
                              </Button>
                            </div>
                          ))}
                          {talentCanceled?.map((item: any, index) => {
                            return (
                              <div
                                className="flex flex-row md:gap-5 justify-between flex-wrap md:text-[16px] text-[12px]"
                                key={index}
                              >
                                <Link
                                  key={index}
                                  href={`/dashboard/talents/${item?.id}`}
                                  target="_blank"
                                  className="flex flex-row gap-2 md:min-w-64 justify-start w-full md:w-auto"
                                >
                                  <Avatar
                                    src={
                                      item?.fields?.Pictures?.split(",")?.[0]
                                    }
                                    name={item?.fields?.["TALENT FULL NAME"]}
                                    style={{ verticalAlign: "middle" }}
                                  />
                                  <p className="my-auto">
                                    {item?.fields?.["TALENT FULL NAME"]}
                                  </p>
                                </Link>
                                <Chip
                                  className="my-auto md:text-[16px] text-[12px]"
                                  color="default"
                                >
                                  Canceled
                                </Chip>
                                <Button
                                  color="primary"
                                  size="sm"
                                  onClick={() => handleSendMessage(item?.id)}
                                  className="my-auto md:text-[16px] text-[12px]"
                                >
                                  Send message again
                                </Button>
                                <Button
                                  isIconOnly
                                  color="danger"
                                  variant="bordered"
                                  size="sm"
                                  className="bg-white my-auto"
                                  onClick={() => handleDelete(item?.id)}
                                >
                                  <FontAwesomeIcon icon={faTrash} />
                                </Button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>

                  <Accordion
                    selectionMode="multiple"
                    selectedKeys={selectedKeys}
                    onSelectionChange={setSelectedKeys}
                    id="accordion"
                  >
                    <AccordionItem
                      key="JOB INFORMATION"
                      aria-label="JOB INFORMATION"
                      title="JOB INFORMATION"
                      id="job-info"
                    >
                      <div className="bg-white flex flex-col gap-5 pl-8 py-5">
                        {data?.["Brands"] ? (
                          <div className="">
                            <SubHeaderYellow text="BRANDS PROMOTIONG" />
                            <div className="px-3">{data?.["Brands"] || ""}</div>
                          </div>
                        ) : (
                          ""
                        )}

                        <div className="bg-white">
                          <SubHeaderYellow text="Event Description" />
                          <div className="px-3">
                            {/* {parse(data?.["EVENT DESCRIPTION"] || "")} */}
                            <pre>
                              {" "}
                              {parse(data?.["EVENT DESCRIPTION"] || "")}{" "}
                            </pre>
                          </div>
                        </div>

                        {(accountType === "talent" &&
                          data?.["ConfirmBooking"] === "Yes" &&
                          data?.["Booked Talent"]?.[0] === airtable_id) ||
                        accountType === "booker" ? (
                          data?.["Crawl Breakdown"] ? (
                            <div className="">
                              <SubHeaderYellow text="Crawl Breakdown" />
                              <div className="px-3">
                                <pre>{data?.["Crawl Breakdown"] || ""}</pre>
                              </div>
                            </div>
                          ) : (
                            ""
                          )
                        ) : (
                          ""
                        )}

                        {(accountType === "talent" &&
                          data?.["ConfirmBooking"] === "Yes" &&
                          data?.["Booked Talent"]?.[0] === airtable_id) ||
                        accountType === "booker" ? (
                          data?.["TALENT NEEDS TO BRING"] ? (
                            <div className="">
                              <SubHeaderYellow text="TALENT NEEDS TO BRING" />
                              <div className="px-3">
                                <pre>
                                  {data?.["TALENT NEEDS TO BRING"] || ""}
                                </pre>
                              </div>
                            </div>
                          ) : (
                            ""
                          )
                        ) : (
                          ""
                        )}

                        {(accountType === "talent" &&
                          data?.["ConfirmBooking"] === "Yes" &&
                          data?.["Booked Talent"]?.[0] === airtable_id) ||
                        accountType === "booker" ? (
                          data?.["CHECK IN INFO"] ? (
                            <div className="">
                              <SubHeaderYellow text="CHECK-IN" />
                              <div className="px-3">
                                <pre>{data?.["CHECK IN INFO"] || ""}</pre>
                              </div>
                            </div>
                          ) : (
                            ""
                          )
                        ) : (
                          ""
                        )}
                        {(accountType === "talent" &&
                          data?.["ConfirmBooking"] === "Yes" &&
                          data?.["Booked Talent"]?.[0] === airtable_id) ||
                        accountType === "booker" ? (
                          data?.["RECAP DESCRIPTION"] ? (
                            <div className="">
                              <SubHeaderYellow text="RECAP REQUIREMENTS" />
                              <div className="px-3">
                                <pre>
                                  {parse(data?.["RECAP DESCRIPTION"] || "")}
                                </pre>
                              </div>
                            </div>
                          ) : (
                            ""
                          )
                        ) : (
                          ""
                        )}
                        {(accountType === "talent" &&
                          data?.["ConfirmBooking"] === "Yes" &&
                          data?.["Booked Talent"]?.[0] === airtable_id) ||
                        accountType === "booker" ? (
                          data?.["Feature"] ? (
                            <div className="">
                              <SubHeaderYellow text="FEATURE" />
                              <div className="px-3">
                                <pre>{data?.["Feature"] || ""}</pre>
                              </div>
                            </div>
                          ) : (
                            ""
                          )
                        ) : (
                          ""
                        )}
                        {(accountType === "talent" &&
                          data?.["ConfirmBooking"] === "Yes" &&
                          data?.["Booked Talent"]?.[0] === airtable_id) ||
                        accountType === "booker" ? (
                          data?.["SAMPLE PRODUCT"] ? (
                            <div className="">
                              <SubHeaderYellow text="SAMPLE PRODUCT" />
                              <div className="px-3">
                                <pre>{data?.["SAMPLE PRODUCT"] || ""}</pre>
                              </div>
                            </div>
                          ) : (
                            ""
                          )
                        ) : (
                          ""
                        )}
                        {(accountType === "talent" &&
                          data?.["ConfirmBooking"] === "Yes" &&
                          data?.["Booked Talent"]?.[0] === airtable_id) ||
                        accountType === "booker" ? (
                          data?.["Bar Spend"] ? (
                            <div>
                              <SubHeaderYellow text="BAR SPEND" />
                              <div className="bg-white px-3">
                                <pre>{data?.["Bar Spend"] || ""}</pre>
                              </div>
                            </div>
                          ) : (
                            ""
                          )
                        ) : (
                          ""
                        )}
                        {(accountType === "talent" &&
                          data?.["ConfirmBooking"] === "Yes" &&
                          data?.["Booked Talent"]?.[0] === airtable_id) ||
                        accountType === "booker" ? (
                          data?.["REIMBURSEMENT"] ? (
                            <div>
                              <SubHeaderYellow text="REIMBURSEMENT" />
                              <div className="bg-white px-3 ">
                                <pre>{data?.["REIMBURSEMENT"] || ""}</pre>
                              </div>
                            </div>
                          ) : (
                            ""
                          )
                        ) : (
                          ""
                        )}
                        {(accountType === "talent" &&
                          data?.["ConfirmBooking"] === "Yes" &&
                          data?.["Booked Talent"]?.[0] === airtable_id) ||
                        accountType === "booker" ? (
                          data?.["GIVEAWAYS"] ? (
                            <div>
                              <SubHeaderYellow text="GIVEAWAYS" />
                              <div className="bg-white px-3 ">
                                <pre>{data?.["GIVEAWAYS"] || ""}</pre>
                              </div>
                            </div>
                          ) : (
                            ""
                          )
                        ) : (
                          ""
                        )}
                        {(accountType === "talent" &&
                          data?.["ConfirmBooking"] === "Yes" &&
                          data?.["Booked Talent"]?.[0] === airtable_id) ||
                        accountType === "booker" ? (
                          <div className="grid grid-cols-2 gap-5">
                            {data?.["TRACKING #"] ? (
                              <div>
                                <SubHeaderYellow text="TRACKING #" />
                                <div className="bg-white px-3 ">
                                  <pre>{data?.["TRACKING #"] || ""}</pre>
                                </div>
                              </div>
                            ) : (
                              ""
                            )}{" "}
                            {data?.["TRACKING #"] ? (
                              <div>
                                <SubHeaderYellow text="TRACKING #" />
                                <div className="bg-white px-3 ">
                                  <pre>{data?.["TRACKING #"] || ""}</pre>
                                </div>
                              </div>
                            ) : (
                              ""
                            )}
                          </div>
                        ) : (
                          ""
                        )}
                        {(accountType === "talent" &&
                          data?.["ConfirmBooking"] === "Yes" &&
                          data?.["Booked Talent"]?.[0] === airtable_id) ||
                        accountType === "booker" ? (
                          data?.["UNIFORM"] ? (
                            <div>
                              <SubHeaderYellow text="Wardrobe" />
                              <div className="bg-white px-3 ">
                                <pre>{parse(data?.["UNIFORM"] || "")}</pre>
                              </div>
                            </div>
                          ) : (
                            ""
                          )
                        ) : (
                          ""
                        )}
                        {(accountType === "talent" &&
                          data?.["ConfirmBooking"] === "Yes" &&
                          data?.["Booked Talent"]?.[0] === airtable_id) ||
                        accountType === "booker" ? (
                          data?.["PARKING"] ? (
                            <div>
                              <SubHeaderYellow text="PARKING" />
                              <div className="bg-white px-3 ">
                                <pre>{parse(data?.["PARKING"] || "")}</pre>
                              </div>
                            </div>
                          ) : (
                            ""
                          )
                        ) : (
                          ""
                        )}
                        {(accountType === "talent" &&
                          data?.["ConfirmBooking"] === "Yes" &&
                          data?.["Booked Talent"]?.[0] === airtable_id) ||
                        accountType === "booker" ? (
                          data?.["MAKE-UP & HAIR"] ? (
                            <div>
                              <SubHeaderYellow text="MAKE-UP & HAIR" />
                              <div className="bg-white px-3 ">
                                <pre>
                                  {parse(data?.["MAKE-UP & HAIR"] || "")}
                                </pre>
                              </div>
                            </div>
                          ) : (
                            ""
                          )
                        ) : (
                          ""
                        )}
                        {(accountType === "talent" &&
                          data?.["ConfirmBooking"] === "Yes" &&
                          data?.["Booked Talent"]?.[0] === airtable_id) ||
                        accountType === "booker" ? (
                          data?.["TRAVEL DESCRIPTION"] ? (
                            <div>
                              <SubHeaderYellow text="TRAVEL" />
                              <div className="bg-white px-3 ">
                                <pre>
                                  {parse(data?.["TRAVEL DESCRIPTION"] || "")}
                                </pre>
                              </div>
                            </div>
                          ) : (
                            ""
                          )
                        ) : (
                          ""
                        )}
                        {(accountType === "talent" &&
                          data?.["ConfirmBooking"] === "Yes" &&
                          data?.["Booked Talent"]?.[0] === airtable_id) ||
                        accountType === "booker" ? (
                          data?.["MISCELLANEOUS INSTRUCTIONS"] ? (
                            <div className="px-3">
                              <SubHeader text="MISCELLANEOUS INSTRUCTIONS" />
                              <div>
                                <pre>
                                  {parse(
                                    data?.["MISCELLANEOUS INSTRUCTIONS"] || ""
                                  )}
                                </pre>
                              </div>
                            </div>
                          ) : (
                            ""
                          )
                        ) : (
                          ""
                        )}
                        {(accountType === "talent" &&
                          data?.["ConfirmBooking"] === "Yes" &&
                          data?.["Booked Talent"]?.[0] === airtable_id) ||
                        accountType === "booker" ? (
                          data?.["SOCIAL MEDIA"] ? (
                            <div>
                              <SubHeaderYellow text="SOCIAL MEDIA" />
                              <div className="bg-white p-3 ">
                                <pre>{parse(data?.["SOCIAL MEDIA"] || "")}</pre>
                              </div>
                            </div>
                          ) : (
                            ""
                          )
                        ) : (
                          ""
                        )}
                        {talentWorking != "" && talentWorking != undefined ? (
                          <div>
                            <SubHeaderYellow text="Talent Working" />
                            <div className="flex flex-col gap-5 px-3">
                              {talentWorking
                                ?.split("\n")
                                .map((item: any, index: any) => (
                                  <div
                                    className="flex flex-row gap-5"
                                    key={index}
                                  >
                                    {item}
                                  </div>
                                ))}
                            </div>
                          </div>
                        ) : (
                          ""
                        )}
                        {receipt != "" && receipt != undefined ? (
                          <div>
                            <SubHeaderYellow text="Receipts" />
                            <div className="flex flex-col gap-5 px-3">
                              {receipt
                                ?.split("\n")
                                .map((item: any, index: any) => (
                                  <div
                                    className="flex flex-row gap-5"
                                    key={index}
                                  >
                                    {item}
                                  </div>
                                ))}
                            </div>
                          </div>
                        ) : (
                          ""
                        )}
                        {/* {sampleProduct != "" && sampleProduct != undefined ? (
                          <div>
                            <SubHeaderYellow text="Sample Products" />
                            <div className="flex flex-col gap-5 px-3">
                              {sampleProduct}
                            </div>
                          </div>
                        ) : (
                          ""
                        )}
                        {reimbursement != "" && reimbursement != undefined ? (
                          <div>
                            <SubHeaderYellow text="Reimbursement" />
                            <div className="flex flex-col gap-5 px-3">
                              {reimbursement}
                            </div>
                          </div>
                        ) : (
                          ""
                        )} */}
                      </div>
                    </AccordionItem>
                    <AccordionItem
                      key="rate information2"
                      aria-label="rate information"
                      title="RATE INFORMATION"
                      className={`${
                        (accountType === "talent" &&
                          data?.["ConfirmBooking"] === "Yes" &&
                          data?.["Booked Talent"]?.[0] === airtable_id) ||
                        accountType === "booker" ||
                        data?.["Status"] === "Payment Sent" ||
                        data?.["Status"] === "Complete" ||
                        new Date(data?.["End Date/Time"]) < new Date()
                          ? ""
                          : "hidden"
                      }`}
                      id="rate-info"
                    >
                      <div className="bg-white grid grid-cols-2 md:grid-cols-3 gap-5 pl-8 py-5">
                        <div>
                          <SubHeader text="RATE" />
                          <div className="">
                            $ {data?.["Talent Rate"]} / {data?.["Billing"]}
                          </div>
                        </div>
                        {accountType === "talent" ||
                        accountType === "booker" ? (
                          data?.["Expense"] ? (
                            <div>
                              <SubHeader text="Expense" />
                              <div>$ {data?.["Expense"] || ""}</div>
                            </div>
                          ) : (
                            ""
                          )
                        ) : (
                          ""
                        )}
                        {accountType === "talent" ||
                        accountType === "booker" ? (
                          data?.["Reimbursed to Talent"] ? (
                            <div>
                              <SubHeader text="Reimbursed" />
                              <div>
                                $ {data?.["Reimbursed to Talent"] || ""}
                              </div>
                            </div>
                          ) : (
                            ""
                          )
                        ) : (
                          ""
                        )}
                        {accountType === "talent" ||
                        accountType === "booker" ? (
                          data?.["Check Amount"] ? (
                            <div>
                              <SubHeader text="Payment Amount" />
                              <div>
                                ${" "}
                                {data?.["Check Amount"] || ""}
                              </div>
                            </div>
                          ) : (
                            ""
                          )
                        ) : (
                          ""
                        )}
                        {accountType === "talent" ||
                        accountType === "booker" ? (
                          data?.["Date Check Sent"] ? (
                            <div>
                              <SubHeader text="DATE PAYMENT SENT" />
                              <div>$ {data?.["Date Check Sent"] || ""}</div>
                            </div>
                          ) : (
                            ""
                          )
                        ) : (
                          ""
                        )}
                        {accountType === "talent" ||
                        accountType === "booker" ? (
                          data?.["Check #"] ? (
                            <div>
                              <SubHeader text="PAYMENT REFERENCE" />
                              <div>$ {data?.["Check #"] || ""}</div>
                            </div>
                          ) : (
                            ""
                          )
                        ) : (
                          ""
                        )}
                      </div>
                    </AccordionItem>
                    <AccordionItem
                      key="TERMS & CONDITIONS"
                      aria-label="TERMS & CONDITIONS 3"
                      title="TERMS & CONDITIONS"
                      id="terms-info"
                      className={`${
                        (accountType === "talent" &&
                          data?.["ConfirmBooking"] === "Yes" &&
                          data?.["Booked Talent"]?.[0] === airtable_id) ||
                        accountType === "booker"
                          ? ""
                          : "hidden"
                      }`}
                    >
                      <div className="bg-white flex flex-col gap-10 pl-8 py-5">
                        {(accountType === "talent" &&
                          data?.["ConfirmBooking"] === "Yes" &&
                          data?.["Booked Talent"]?.[0] === airtable_id) ||
                        accountType === "booker" ? (
                          data?.["REFERRALS"] ? (
                            <div>
                              <SubHeader text="Referrals" />
                              <pre>
                                <div>{parse(data?.["REFERRALS"] || "")}</div>
                              </pre>
                            </div>
                          ) : (
                            ""
                          )
                        ) : (
                          ""
                        )}
                        {(accountType === "talent" &&
                          data?.["ConfirmBooking"] === "Yes" &&
                          data?.["Booked Talent"]?.[0] === airtable_id) ||
                        accountType === "booker" ? (
                          data?.["TALENT EXPECTATIONS"] ? (
                            <div>
                              <SubHeader text="Talent Expectations" />
                              <div>
                                <pre>
                                  {parse(data?.["TALENT EXPECTATIONS"] || "")}
                                </pre>
                              </div>
                            </div>
                          ) : (
                            ""
                          )
                        ) : (
                          ""
                        )}
                        {(accountType === "talent" &&
                          data?.["ConfirmBooking"] === "Yes" &&
                          data?.["Booked Talent"]?.[0] === airtable_id) ||
                        accountType === "booker" ? (
                          data?.["CANCELLATION DESCRIPTION"] ? (
                            <div>
                              <SubHeader text="Cancellation" />
                              <div>
                                <pre>
                                  {parse(
                                    data?.["CANCELLATION DESCRIPTION"] || ""
                                  )}
                                </pre>
                              </div>
                            </div>
                          ) : (
                            ""
                          )
                        ) : (
                          ""
                        )}
                      </div>
                    </AccordionItem>
                  </Accordion>
                </div>
              </div>
              {accountType === "client" ? (
                <div className="bg-white p-3 rounded-xl">
                  <SubHeader text="Booked Talent" />
                  <div className="flex flex-col gap-2">
                    {talentBooked?.map((item: any, index) => (
                      <div className="flex flex-row gap-2" key={index}>
                        <Link
                          key={index}
                          href={`/dashboard/talents/${item?.id}`}
                          target="_blank"
                          className="my-auto flex flex-row gap-2"
                        >
                          <Avatar
                            src={item?.fields?.Pictures?.split(",")?.[0]}
                            name={item?.fields?.["TALENT FULL NAME"]}
                          />
                          <p className="my-auto">
                            {item?.fields?.["TALENT FULL NAME"]}
                          </p>
                        </Link>
                        <div className="flex flex-row gap-3">
                          <Chip color="danger" className="my-auto">
                            Booked
                          </Chip>
                          <p className="my-auto">
                            Contact Phone: {item?.fields?.["Cell Phone"]}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                ""
              )}
              {/* Talent List */}
            </div>
          </div>
        </div>
      </div>
      <Modal
        isOpen={isOpen}
        placement="auto"
        size="lg"
        onOpenChange={onOpenChange}
      >
        <ModalContent className="">
          {(onClose) => (
            <>
              <ModalHeader>
                <p className="font-bold">Want to cancel this job?</p>
              </ModalHeader>
              <ModalBody>
                <div className="w-full py-3 ">
                  <div className="flex flex-col gap-[10px]">
                    {/* Section1 */}
                    {new Date() <
                    new Date(
                      new Date(data?.["Start Date/Time"]).getTime() -
                        7 * 24 * 60 * 60 * 1000
                    )
                      ? "Are you sure you want to cancel?"
                      : `You are currently within the 7-day cancellation period,
                      and pressing cancel may result in incurring a $100
                      cancellation fee. For assistance, please contact your
                      booker to arrange a replacement or to provide them with
                      emergency documentation`}
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <div className="flex flex-row gap-3">
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                  <Button color="primary" onPress={handleCancel}>
                    Submit
                  </Button>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal
        isOpen={messageOpen}
        placement="auto"
        size="lg"
        onOpenChange={handleModalOpen}
      >
        <ModalContent className="">
          {(onClose) => (
            <>
              <ModalHeader>
                <p className="font-bold">Send Message</p>
              </ModalHeader>
              <ModalBody>
                <div className="w-full py-3 flex flex-col gap-4">
                  <Select
                    variant="bordered"
                    label="To"
                    size="sm"
                    selectedKeys={messageType}
                    isRequired
                    onSelectionChange={setMessageType as any}
                    className="rounded-xl"
                  >
                    <SelectItem key="All Talent" value="All Talent">
                      All Talent (except unavailable)
                    </SelectItem>
                    <SelectItem
                      key="Talent Not Responded"
                      value="Talent Not Responded"
                    >
                      Talent Not Responded
                    </SelectItem>
                    <SelectItem key="Confirmed Talent" value="Confirmed Talent">
                      Confirmed Talent
                    </SelectItem>
                    <SelectItem key="Booked Talent" value="Booked Talent">
                      Booked Talent (unconfirmed)
                    </SelectItem>
                  </Select>

                  <Select
                    variant="bordered"
                    label="To"
                    size="sm"
                    selectedKeys={templateType}
                    isRequired
                    onSelectionChange={setTemplateType as any}
                    className="rounded-xl"
                  >
                    <SelectItem key="0" value="0">
                      Event Reminder Email
                    </SelectItem>
                    <SelectItem key="1" value="1">
                      Call for Availability
                    </SelectItem>
                    <SelectItem key="2" value="2">
                      RECAP NOT RECEIVED
                    </SelectItem>
                    <SelectItem key="3" value="3">
                      TALENT NEEDS TO CONFIRM
                    </SelectItem>
                    <SelectItem key="4" value="4">
                      Off-Premise Event Info Reminder
                    </SelectItem>
                    <SelectItem key="5" value="5">
                      On-Premise Event Booking info
                    </SelectItem>
                  </Select>
                  <p>
                    Subject<span className="text-red-500">*</span>
                  </p>
                  <Input
                    type="text"
                    variant="bordered"
                    className="w-full"
                    label="Client Name"
                    isRequired
                    size="sm"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                  <p>
                    Message<span className="text-red-500">*</span>
                  </p>
                  <div className="border-[2px] rounded-lg py-1 overflow-hidden">
                    <QuillNoSSRWrapper
                      className={`w-full bg-white h-[200px] mb-[40px] `}
                      theme="snow"
                      value={message}
                      key={"package-message"}
                      onChange={setMessage}
                    />
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <div className="flex flex-row gap-3">
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                  <Button color="primary" onPress={handleSubmit}>
                    Submit
                  </Button>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </main>
  );
};

export default Home;
