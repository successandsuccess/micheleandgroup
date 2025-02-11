import { GetAccountInformation } from "@/actions/getAccountInformation";
import Sidebar from "@/components/Sidebar";
import useParticipantStore from "@/store/use-participant";
import { Button, Input } from "@nextui-org/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import timeGridPlugin from "@fullcalendar/timegrid";
import { GetCalendarList } from "@/actions/getCalendarList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";

export default function EditAccount() {
  const { airtable_id, setDataLoading, accountType } = useParticipantStore(
    (state) => state
  );
  const [events, setEvents] = useState<any>();

  useEffect(() => {
    (async () => {
      if (airtable_id) {
        setDataLoading(true);
        const result = await GetCalendarList(airtable_id, accountType);
        let temp: any = [];
        console.log(result);
        result?.data?.map((item: any) => {
          if (item?.fields?.["ConfirmBooking"]) {
            temp.push({
              title: item.fields["JOB TITLE"],
              start: item.fields["Start Date/Time"],
              end: item.fields["End Date/Time"],
              url: `${process.env.NEXT_PUBLIC_SERVER_URI}/job-board/${item.id}`,
              // url: item.fields["Job Link"],
            });
            ["2", "3", "4", "5", "6", "7", "8", "9", "10", "11"].map(
              (date: string) => {
                if (item.fields?.[`Day ${date} Start`]) {
                  temp.push({
                    title: item.fields["JOB TITLE"],
                    start: item.fields[`Day ${date} Start`],
                    end: item.fields[`Day ${date} End`],
                    url: `${process.env.NEXT_PUBLIC_SERVER_URI}/job-board/${item.id}`,
                  });
                }
              }
            );
          }
        });
        setEvents(temp);
        setDataLoading(false);
      }
    })();
  }, [airtable_id]);
  return (
    <main
      className={`min-h-screen xl:flex xl:flex-row justify-stretch  bg-gray-100`}
    >
      <Sidebar />
      <div className="p-[30px]  w-full">
        <p className="md:text-[26px]  text-[24px] sm:text-left text-center font-semibold mb-[30px]">
          Calendar
        </p>
        {/* <div className="flex flex-col md:flex-row md:justify-between gap-5 mb-[30px]">
          <a href="https://calendar.google.com/">
            <Button
              color="primary"
              startContent={<FontAwesomeIcon icon={faCalendarDays} />}
            >
              Google Calendar
            </Button>
          </a>
          <a href="https://www.icloud.com/calendar">
            <Button
              color="primary"
              startContent={<FontAwesomeIcon icon={faCalendarDays} />}
            >
              Apple Calendar
            </Button>
          </a>
        </div> */}
        <div className="calendar-container">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            navLinks={true}
            dayMaxEvents={true}
            eventBackgroundColor="#e7b532"
            eventBorderColor="#ffffff00"
            editable={true}
            events={events}
            timeZone="EST"
          />
        </div>
      </div>
    </main>
  );
}
