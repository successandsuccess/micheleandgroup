import { GetAccountInformation } from "@/actions/getAccountInformation";
import Sidebar from "@/components/Sidebar";
import useParticipantStore from "@/store/use-participant";
import {
  faAngleLeft,
  faAngleRight,
  faLink,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Accordion,
  AccordionItem,
  Chip,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { SearchIcon } from "@/components/SearchIcon";
import { Pagination } from "@/components/Pagination";
import { useRouter } from "next/router";
import { GetBookedJobs } from "@/actions/getBookedJobs";
import { StatusType } from "@/lib/selectoptions";

export default function Jobs() {
  const { airtable_id, setDataLoading, accountType } = useParticipantStore(
    (state) => state
  );
  const [jobs, setJobs] = useState<any>();
  const [search, setSearch] = useState("");
  const [pageIndex, setPageIndex] = useState(0);
  const [offsetArr, setOffsetArr] = useState([""]);
  const [pageSize, setPageSize] = useState(new Set<string>([`10`]));
  const [option, setOption] = useState(new Set<string>(["ALL"]));
  const [selectedKeys, setSelectedKeys] = useState<any>(new Set([]));

  const router = useRouter();

  useEffect(() => {
    (async () => {
      if (airtable_id && pageSize && option) {
        setDataLoading(true);

        const result = await GetBookedJobs(
          airtable_id,
          accountType,
          Array.from(option).toString(),
          Array.from(pageSize).toString(),
          search
        );
        setPageIndex(0);
        setOffsetArr(["", result.data.offset]);
        setJobs(result.data.records);
        console.log(result);
        setDataLoading(false);
      }
    })();
  }, [airtable_id, pageSize, option]);

  const handlePagenation = async (index: any) => {
    console.log(index);
    if (index < 0) return;
    if (pageIndex === index) return;
    setDataLoading(true);

    console.log(offsetArr);
    console.log(offsetArr[index]);
    const result = await GetBookedJobs(
      airtable_id,
      accountType,
      Array.from(option).toString(),
      Array.from(pageSize).toString(),
      search,
      offsetArr[index]
    );
    setPageIndex(index);
    if (offsetArr.length === index + 1)
      setOffsetArr([...offsetArr, result.data.offset]);

    // console.log(result.data);
    // const temp = offsetArr;
    // temp.push(result.data.records);
    // setOffsetArr(temp);
    setJobs(result.data.records);
    setDataLoading(false);
  };

  const handleSearch = async () => {
    setDataLoading(true);
    const result = await GetBookedJobs(
      airtable_id,
      accountType,
      Array.from(option).toString(),
      Array.from(pageSize).toString(),
      search
    );
    setJobs(result.data.records);
    setPageIndex(0);
    setOffsetArr(["", result.data.offset]);
    setDataLoading(false);
  };

  const redirectToExternalUrl = (url: string) => {
    const win = window.open(url, "_blank");
    win?.focus();
  };

  return (
    <main
      className={`min-h-screen xl:flex xl:flex-row justify-stretch  bg-gray-100`}
    >
      <Sidebar />
      <div className="md:p-[30px] p-1  w-full">
        <p className="md:text-[26px]  text-[24px] sm:text-left text-center font-semibold mb-[30px]">
          Booked Jobs
        </p>
        <div className="rounded-2xl lg:p-[30px] flex flex-col gap-5 w-full md:p-[20px] p-[15px] bg-white shadow-md">
          {/* <p className="text-[18px] font-bold">Account Login</p> */}
          <Input
            label="Search"
            isClearable
            radius="lg"
            classNames={{
              label: "text-black/50 dark:text-white/90",
              input: [
                "bg-transparent",
                "text-black/90 dark:text-white/90",
                "placeholder:text-default-700/50 dark:placeholder:text-white/60",
              ],
              innerWrapper: "bg-transparent",
              inputWrapper: [
                "shadow-xl",
                "bg-default-200/50",
                "dark:bg-default/60",
                "backdrop-blur-xl",
                "backdrop-saturate-200",
                "hover:bg-default-200/70",
                "dark:hover:bg-default/70",
                "group-data-[focused=true]:bg-default-200/50",
                "dark:group-data-[focused=true]:bg-default/60",
                "!cursor-text",
              ],
            }}
            onClear={() => setSearch("")}
            placeholder="Type Event Name to search..."
            startContent={
              <SearchIcon className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
            }
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={async (e) => {
              if (e.key === "Enter") await handleSearch();
            }}
          />
          <Select
            variant="bordered"
            label="Job Type"
            size="lg"
            selectedKeys={option}
            onSelectionChange={setOption as any}
          >
            {[
              "ALL",
              "Today",
              "UPCOMING BOOKED JOBS",
              "PAST COMPLETED JOBS",
            ].map((item) => (
              <SelectItem
                key={
                  item === "Today"
                    ? new Date().toLocaleDateString("en-CA", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })
                    : item
                }
                value={
                  item === "Today"
                    ? new Date().toLocaleDateString("en-CA", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })
                    : item
                }
              >
                {item}
              </SelectItem>
            ))}
          </Select>
          <div className="rounded-md overflow-hidden border-[1px]">
            <table className="w-full max-md:hidden">
              <thead>
                <tr className="text-left bg-primary l">
                  <th>Date</th>
                  <th>Time</th>
                  <th>Event Name</th>
                  {accountType === "talent" ? <th>Talent Status</th> : ""}
                  {/* <th>Event Status</th> */}
                </tr>
              </thead>
              <tbody>
                {jobs ? (
                  jobs.map((item: any, index: number) => (
                    <tr
                      key={index}
                      className="border-b-[1px] hover:bg-gray-100 bg-white cursor-pointer"
                      onClick={
                        () =>
                          redirectToExternalUrl(`/job-board/booked/${item.id}`)
                        // router.push(`/job-board/booked/${item.id}`)
                      }
                    >
                      {/* <td className="p-5">#{item.fields["ID"]}</td> */}
                      <td>{item.fields["START DATE"]}</td>
                      <td>
                        {new Date(item.fields?.["Start Date/Time"])
                          .toLocaleDateString("en-us", {
                            hour: "numeric",
                            hour12: true,
                            minute: "numeric",
                            timeZone: "UTC",
                          })
                          .split(", ")?.[1] +
                          " - " +
                          new Date(item.fields?.["End Date/Time"])
                            .toLocaleDateString("en-us", {
                              hour: "numeric",
                              hour12: true,
                              minute: "numeric",
                              timeZone: "UTC",
                            })
                            .split(", ")?.[1] +
                          "(UTC)"}
                      </td>
                      <td>{item.fields["JOB TITLE"]}</td>
                      {/* <td>#12960</td> */}
                      {accountType === "talent" ? (
                        <td>
                          {item.fields?.["Status for Talent View"] ? (
                            <Chip
                              color={`${
                                item.fields?.["Status for Talent View"] ===
                                "Talent Booked, Needs to Confirm"
                                  ? "danger"
                                  : item.fields?.["Status for Talent View"] ===
                                    "Talent Confirmed Booking"
                                  ? "success"
                                  : "primary"
                              }`}
                            >
                              {item.fields?.["Status for Talent View"]}
                            </Chip>
                          ) : (
                            ""
                          )}
                        </td>
                      ) : (
                        ""
                      )}
                    </tr>
                  ))
                ) : (
                  <tr></tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="md:hidden">
            <Accordion
              selectionMode="multiple"
              selectedKeys={selectedKeys}
              onSelectionChange={setSelectedKeys}
              id="accordion"
            >
              {jobs
                ? jobs.map((item: any, index: number) =>
                    item?.fields?.["Status"] !== "Booked" &&
                    item?.fields?.["Status"] !== "Reminded to Confirm" &&
                    item?.fields?.["Status"] !== "2nd Reminder to Confirm" &&
                    item?.fields?.["Status"] !== "Final Reminder to Confirm" &&
                    item?.fields?.["Status"] !== "Talent Confirmed" ? (
                      <AccordionItem
                        key={index}
                        aria-label={index.toString()}
                        title={
                          <div className="flex flex-row justify-between gap-1">
                            <p>{item.fields["JOB TITLE"]}</p>
                            {accountType === "talent" ? (
                              <div className="my-auto">
                                {item.fields?.["Status for Talent View"] ? (
                                  <Chip
                                    color={`${
                                      item.fields?.[
                                        "Status for Talent View"
                                      ] === "Talent Booked, Needs to Confirm"
                                        ? "danger"
                                        : item.fields?.[
                                            "Status for Talent View"
                                          ] === "Talent Confirmed Booking"
                                        ? "success"
                                        : "primary"
                                    }`}
                                  >
                                    {
                                      StatusType?.[
                                        item?.fields?.[
                                          "Status for Talent View"
                                        ] || ""
                                      ]
                                    }
                                  </Chip>
                                ) : (
                                  ""
                                )}
                              </div>
                            ) : (
                              ""
                            )}
                          </div>
                        }
                        className="accordion-items mb-2"
                      >
                        <div className="bg-white pl-3 py-1 text-[14px]">
                          <div>Date: {item.fields["START DATE"]}</div>
                          <div>
                            Time:{" "}
                            {new Date(
                              item.fields["Start Date/Time"]
                            ).toLocaleDateString("en-us", {
                              hour: "numeric",
                              hour12: true,
                              minute: "numeric",
                              timeZone: "UTC",
                            }) +
                              " - " +
                              new Date(
                                item.fields["End Date/Time"]
                              ).toLocaleDateString("en-us", {
                                hour: "numeric",
                                hour12: true,
                                minute: "numeric",
                                timeZone: "UTC",
                              }) +
                              "(UTC)"}
                          </div>
                          <div>
                            Location:{" "}
                            {item.fields?.["Account City"]?.[0]
                              ? item.fields?.["Account City"]?.[0] +
                                ", " +
                                item.fields?.["State"]?.[0]
                              : ""}
                          </div>
                          <Link
                            target="_blank"
                            href={`/job-board/${item.id}`}
                            className="border-b-1 border-[#00000055] no-underline"
                          >
                            Open Link{" "}
                            <FontAwesomeIcon
                              icon={faLink}
                              size="sm"
                              className="my-auto"
                            />
                          </Link>
                        </div>
                      </AccordionItem>
                    ) : (
                      ""
                    )
                  )
                : ""}
            </Accordion>
          </div>
          <div className="flex flex-row justify-between mt-[30px]">
            <div className="w-[100px]">
              <Select
                variant="bordered"
                selectedKeys={pageSize}
                size="sm"
                onSelectionChange={setPageSize as any}
              >
                <SelectItem key={10} value="10">
                  10
                </SelectItem>
                <SelectItem key={20} value="20">
                  20
                </SelectItem>
                <SelectItem key={50} value="50">
                  50
                </SelectItem>
                <SelectItem key={100} value="100">
                  100
                </SelectItem>
              </Select>
            </div>
            <Pagination
              offsetArr={offsetArr}
              handleClick={handlePagenation}
              pageIndex={pageIndex}
              pageSize={pageSize}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
