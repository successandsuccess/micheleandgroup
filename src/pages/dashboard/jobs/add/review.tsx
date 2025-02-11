import { StepsLayout } from "@/components/Steps/StepsLayout";
import { NavigationButtons } from "@/components/Steps/NavigationButtons";
import Sidebar from "@/components/Sidebar";
import useJobState from "@/store/use-job";
import { Header } from "@/components/Jobs/Header";
import { Label } from "@/components/Jobs/Label";
import parse from "html-react-parser";
import { SubHeader } from "@/components/Jobs/SubHeader";
import Link from "next/link";
import { Avatar, Button } from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import useParticipantStore from "@/store/use-participant";
import { useEffect } from "react";

const YourAnswers = () => {
  const {
    clientsList,
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
    talentNote,
    setTalentInvited,
  } = useJobState((state) => state);

  const {setDataLoading, loading} = useParticipantStore(state => state)

  const handleDelete = (idx: number) => {
    const updated = talentInvited?.filter(
      (item: any, index: number) => index !== idx
    );
    setTalentInvited(updated);
  };

  return (
    <main
      className={`min-h-screen xl:flex xl:flex-row justify-stretch  bg-gray-100`}
    >
      <Sidebar />
      <div className="p-[30px]  w-full">
        <p className="md:text-[26px]  text-[24px] sm:text-left text-center font-semibold mb-[30px]">
          Add Job
        </p>
        <div className="flex flex-col gap-[30px]">
          <div className="rounded-2xl lg:p-[30px] md:p-[20px] p-[15px] bg-white shadow-md">
            <StepsLayout>
              <div className="flex flex-col gap-5 min-w-[500px] min-h-[200px] px-5">
                <Header text="Basic Event Information" />
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <SubHeader text="Event Title" />
                    <p>{eventTitle}</p>
                  </div>
                  <div>
                    <SubHeader text="Event Type" />
                    <p>{Array.from(eventType).toString()}</p>
                  </div>
                  <div>
                    <SubHeader text="Talent Quota" />
                    <p>{talentQuota}</p>
                  </div>
                  <div>
                    <SubHeader text="Event Reference" />
                    <p>{eventRef}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-5">
                  <SubHeader text="Event Description" />
                  <div>{parse(eventDescription)}</div>
                </div>

                <Header text="Event Date & Time" />
                {/* <div>
                  <SubHeader text="Reqruied to attend all days?" />
                  <div>{Array.from(requiredAttendDay).toString()}</div>
                </div> */}
                <table>
                  <thead>
                    <tr>
                      <th className="text-left">
                        Event Date<span className="text-[#ff0000]">*</span>
                      </th>
                      <th className="text-left">
                        Start Time<span className="text-[#ff0000]">*</span>
                      </th>
                      <th className="text-left">
                        End Time<span className="text-[#ff0000]">*</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {eventDates.map((item, index) => (
                      <tr key={index}>
                        <td>
                          <input
                            className="w-full outline-none border-[2px] rounded-md p-3"
                            type="date"
                            value={item.eventDate}
                            disabled
                          />
                        </td>
                        <td>
                          <input
                            className="w-full outline-none border-[2px] rounded-md p-3"
                            type="time"
                            value={item.startTime}
                            disabled
                          />
                        </td>
                        <td>
                          <input
                            className="w-full outline-none border-[2px] rounded-md p-3"
                            type="time"
                            value={item.endTime}
                            disabled
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <Header text="Event Location" />
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <SubHeader text="Address 1" />
                    <div>{address1}</div>
                  </div>
                  <div>
                    <SubHeader text="Address 2" />
                    <div>{address2}</div>
                  </div>
                  <div>
                    <SubHeader text="City" />
                    <div>{city}</div>
                  </div>
                  <div>
                    <SubHeader text="State / Province / Region" />
                    <div>{Array.from(state).toString()}</div>
                  </div>
                  <div>
                    <SubHeader text="Zip / Postal Code" />
                    <div>{zip}</div>
                  </div>
                </div>

                <Header text="Rate Information" />
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <SubHeader text="Talent Rate" />
                    <div>{talentRate}$</div>
                  </div>
                  <div>
                    <SubHeader text="Client Rate" />
                    <div>{clientRate}$</div>
                  </div>
                  <div>
                    <SubHeader text="Agency Fee" />
                    <div>{Array.from(agencyFee).toString()}</div>
                  </div>
                  <div>
                    <SubHeader text="Rate Basis" />
                    <div>{Array.from(rateBasis).toString()}</div>
                  </div>
                </div>

                <Header text="Contact Information" />
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <SubHeader text="Client Assigned" />
                    <div>{clientAssigned}</div>
                  </div>
                  <div>
                    <SubHeader text="Onsite Contact Name" />
                    <div>{contactName}</div>
                  </div>
                  <div>
                    <SubHeader text="Onsite Contact Phone" />
                    <div>{contactPhone}</div>
                  </div>
                </div>

                <Header text="Important Instructions" />
                <div>
                  <SubHeader text="Wardrobe" />
                  <div>{parse(wardrobe)}</div>
                </div>

                <div>
                  <SubHeader text="Parking" />
                  <div>{parse(parking)}</div>
                </div>

                <div>
                  <SubHeader text="Makeup & Hair" />
                  <div>{parse(makeup)}</div>
                </div>

                <div>
                  <SubHeader text="Travel" />
                  <div>{parse(travel)}</div>
                </div>

                <div>
                  <SubHeader text="Recap Requirements" />
                  <div>{parse(recap)}</div>
                </div>

                <div>
                  <SubHeader text="Social Media" />
                  <div>{parse(social)}</div>
                </div>

                <div>
                  <SubHeader text="CRAWL BREAKDOWN" />
                  <div>{parse(additionalLocation)}</div>
                </div>

                <div>
                  <SubHeader text="Referrals" />
                  <div>{parse(referrals)}</div>
                </div>

                <div>
                  <SubHeader text="Talent Expectations" />
                  <div>{parse(talentExpectations)}</div>
                </div>

                <div>
                  <SubHeader text="Cancellation" />
                  <div>{parse(cancellation)}</div>
                </div>

                <div>
                  <SubHeader text="Contacts" />
                  <div>{parse(contacts)}</div>
                </div>

                <div>
                  <SubHeader text="Miscellaneous Instructions" />
                  <div>{parse(miscellaneous)}</div>
                </div>
                <div>
                  <SubHeader text="Talent Note" />
                  <div>{parse(talentNote)}</div>
                </div>
                <div>
                  <SubHeader text="Talent List" />
                  <div className="grid md:grid-cols-3 max-md:grid-cols-2 gap-x-2 max-h-40 overflow-y-auto">
                    {talentInvited.map((item: any, index) => (
                      <div className="flex flex-row  justify-between">
                        <Link
                          key={index}
                          href={`/dashboard/talents/${item.id}`}
                          target="_blank"
                          className="flex flex-row gap-2  min-w-64 justify-start"
                        >
                          <Avatar src={item.url} name={item.name}/>
                          <p className="my-auto">{item.name}</p>
                        </Link>
                        <Button
                          isIconOnly
                          color="danger"
                          variant="bordered"
                          size="sm"
                          className="bg-white"
                          onClick={() => handleDelete(index)}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
                <NavigationButtons
                  back="/dashboard/jobs/add/step-two"
                  next="submit"
                  home
                />
              </div>
            </StepsLayout>
          </div>
        </div>
      </div>
    </main>
  );
};

export default YourAnswers;
