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
import { Chip } from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";

const Home = () => {
  const router = useRouter();
  const { airtable_id, setDataLoading, accountType } = useParticipantStore(
    (state) => state
  );
  const { clientsList } = useJobState((state) => state);
  const { eventRef, talentInvited } = useJobState((state) => state);

  const [data, setData] = useState<any>();
  const [client, setClient] = useState("");
  const [talentPending, setTalentPending] = useState<Array<any>>([]);
  const [talentAceepted, setTalentAccepted] = useState<Array<any>>([]);
  const [talentDeclined, setTalentDeclined] = useState<Array<any>>([]);

  useEffect(() => {
    (async () => {
      if (router.query.id) {
        setDataLoading(true);
        const data = await GetJobById(router.query.id.toString());
        console.log(data);
        if (data.status === true) {
          if (clientsList.length === 0) {
            const client = await GetClientById(data.data.data.fields.Client);
            setClient(client.data.data.fields.Company);
          }
          setData(data.data.data.fields);
          if (accountType === "client" || accountType === "booker") {
            setTalentPending(data.data?.talent_pending?.records || []);
            setTalentAccepted(data.data?.talent_accepted?.records || []);
            setTalentDeclined(data.data?.talent_declined?.records || []);
          }
        }
        setDataLoading(false);
      }
    })();
  }, [router.query.id]);

  return (
    <main
      className={`min-h-screen xl:flex xl:flex-row justify-stretch  bg-gray-100`}
    >
      <Sidebar />
      <div className="p-[30px]  w-full">
        {/* <p className="md:text-[26px]  text-[24px] sm:text-left text-center font-semibold mb-[30px]">
          Add Job
        </p> */}
        <div className="flex flex-col gap-[30px]">
          <div className="rounded-2xl lg:p-[30px] md:p-[20px] p-[15px] bg-white shadow-md">
            <div className="flex flex-col gap-3 min-w-[500px] min-h-[200px] px-5">
              <div className="text-center mb-[30px]">
                <Header text={data?.["JOB TITLE"]} />
                {accountType === "booker" ? (
                  <button
                    onClick={() =>
                      router.push(`edit/detail/${router.query.id}`)
                    }
                    className="flex flex-row py-[14px] px-[28px] text-[18px] gap-2 bg-primary h-[55px] my-auto rounded-l-full rounded-r-full hover:bg-primarylight transition ease-in-out duration-300"
                  >
                    <FontAwesomeIcon icon={faPenToSquare} className="pt-1" />
                    Edit Detail
                  </button>
                ) : (
                  ""
                )}
              </div>

              <div className="grid grid-cols-2 bg-gray-100 p-3 rounded-xl">
                <div>
                  <SubHeader text="Event Type" />
                  <p>{data?.["Type of Event"]}</p>
                </div>
                <div>
                  <SubHeader text="Talent Quota" />
                  <p>{data?.["Total # Talent"]}</p>
                </div>
                {/* <div>
                  <SubHeader text="Event Reference" />
                  <p>{eventRef}</p>
                </div> */}
              </div>
              <div className="bg-gray-100 p-3 rounded-xl">
                <SubHeader text="Event Description" />
                <div>{parse(data?.["EVENT DESCRIPTION"] || "")}</div>
              </div>

              {/* <div>
                <SubHeader text="Reqruied to attend all days?" />
                <div>{}</div>
              </div> */}
              <table>
                <thead>
                  <tr>
                    <th className="text-left">
                      Start Time<span className="text-[#ff0000]">*</span>
                    </th>
                    <th className="text-left">
                      End Time<span className="text-[#ff0000]">*</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <p>{data?.["Start Date/Time"]}</p>
                    </td>
                    <td>
                      <p>{data?.["End Date/Time"]}</p>
                    </td>
                  </tr>
                </tbody>
              </table>

              <Header text="Event Location" />
              <div className="grid grid-cols-2 bg-gray-100 p-3 rounded-xl">
                <div>
                  <SubHeader text="Address 1" />
                  <div>{data?.["Address1"]}</div>
                </div>
                <div>
                  <SubHeader text="Address 2" />
                  <div>{data?.["Address2"]}</div>
                </div>
                <div>
                  <SubHeader text="City" />
                  <div>{data?.["City"]}</div>
                </div>
                <div>
                  <SubHeader text="State / Province / Region" />
                  <div>{data?.["States"]}</div>
                </div>
                <div>
                  <SubHeader text="Zip / Postal Code" />
                  <div>{data?.["Zip"]}</div>
                </div>
              </div>

              <Header text="Rate Information" />
              <div className="grid grid-cols-2 bg-gray-100 p-3 rounded-xl">
                <div>
                  <SubHeader text="Talent Rate" />
                  <div>{data?.["Talent Rate"]}$</div>
                </div>
                <div>
                  <SubHeader text="Client Rate" />
                  <div>{data?.["Client Rate"]}$</div>
                </div>
                <div>
                  <SubHeader text="Agency Fee" />
                  <div>{data?.["Agency Fee"]}</div>
                </div>
                <div>
                  <SubHeader text="Rate Basis" />
                  <div>{data?.["Billing"]}</div>
                </div>
              </div>

              <Header text="Client Information" />
              <div className="grid grid-cols-2 bg-gray-100 p-3 rounded-xl">
                <div>
                  <SubHeader text="Client Assigned" />
                  <div>{client}</div>
                </div>
                <div>
                  <SubHeader text="Onsite Contact Name" />
                  <div>{data?.["Onsite Contact Name"]}</div>
                </div>
                <div>
                  <SubHeader text="Onsite Contact Phone" />
                  <div>{data?.["Onsite Contact Phone"]}</div>
                </div>
              </div>

              <Header text="Important Instructions" />
              <div className="bg-gray-100 p-3 rounded-xl">
                <SubHeader text="Wardrobe" />
                <div>{parse(data?.["Wardrobe"] || "")}</div>
              </div>

              <div className="bg-gray-100 p-3 rounded-xl">
                <SubHeader text="Parking" />
                <div>{parse(data?.["Parking"] || "")}</div>
              </div>

              <div className="bg-gray-100 p-3 rounded-xl">
                <SubHeader text="Makeup & Hair" />
                <div>{parse(data?.["Makeup & Hair"] || "")}</div>
              </div>

              <div className="bg-gray-100 p-3 rounded-xl">
                <SubHeader text="Travel" />
                <div>{parse(data?.["Travel Description"] || "")}</div>
              </div>

              <div className="bg-gray-100 p-3 rounded-xl">
                <SubHeader text="Recap Requirements" />
                <div>{parse(data?.["Recap Description"] || "")}</div>
              </div>

              <div className="bg-gray-100 p-3 rounded-xl">
                <SubHeader text="Social Media" />
                <div>{parse(data?.["Social Media"] || "")}</div>
              </div>

              <div className="bg-gray-100 p-3 rounded-xl">
                <SubHeader text="CRAWL BREAKDOWN" />
                <div>{parse(data?.["CRAWL BREAKDOWN"] || "")}</div>
              </div>

              <div className="bg-gray-100 p-3 rounded-xl">
                <SubHeader text="Referrals" />
                <div>{parse(data?.["Referrals"] || "")}</div>
              </div>

              <div className="bg-gray-100 p-3 rounded-xl">
                <SubHeader text="Talent Expectations" />
                <div>
                  {parse(data?.["Talent Expectations Description"] || "")}
                </div>
              </div>

              <div className="bg-gray-100 p-3 rounded-xl">
                <SubHeader text="Cancellation" />
                <div>{parse(data?.["Cancellation Description"] || "")}</div>
              </div>

              <div className="bg-gray-100 p-3 rounded-xl">
                <SubHeader text="Contacts" />
                <div>{parse(data?.["CONTACTS"] || "")}</div>
              </div>

              <div className="bg-gray-100 p-3 rounded-xl">
                <SubHeader text="Miscellaneous Instructions" />
                <div>{parse(data?.["Miscellaneous Instructions"] || "")}</div>
              </div>
              <div className="flex flex-row ">
                {accountType === "booker" ? (
                  <button
                    onClick={() =>
                      router.push(`edit/talent/${router.query.id}`)
                    }
                    className="flex flex-row py-[14px] px-[28px] text-[18px] gap-2 bg-primary h-[55px] my-auto rounded-l-full rounded-r-full hover:bg-primarylight transition ease-in-out duration-300"
                  >
                    <FontAwesomeIcon icon={faPenToSquare} className="pt-1" />
                    Add Talents
                  </button>
                ) : (
                  ""
                )}
              </div>

              {accountType !== "talent" ? (
                <div className="bg-gray-100 p-3 rounded-xl">
                  <SubHeader text="Talent List" />
                  <div className="flex flex-col gap-2">
                    {talentAceepted?.map((item: any, index) => (
                      <Link
                        key={index}
                        href={`/dashboard/talents/${item?.id}`}
                        target="_blank"
                      >
                        {item?.fields?.["TALENT FULL NAME"]}{" "}
                        <Chip color="success">Accepted</Chip>
                      </Link>
                    ))}
                    {talentPending?.map((item: any, index) => (
                      <Link
                        key={index}
                        href={`/dashboard/talents/${item?.id}`}
                        target="_blank"
                      >
                        {item?.fields?.["TALENT FULL NAME"]}{" "}
                        <Chip color="primary">Pending</Chip>
                      </Link>
                    ))}
                    {talentDeclined?.map((item: any, index) => (
                      <Link
                        key={index}
                        href={`/dashboard/talents/${item?.id}`}
                        target="_blank"
                      >
                        {item?.fields?.["TALENT FULL NAME"]}{" "}
                        <Chip color="danger">Declined</Chip>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;
