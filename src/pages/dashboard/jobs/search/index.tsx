import { GetBookersList } from "@/actions/getBookersList";
import { GetClientsList } from "@/actions/getClientsList";
import { SearchJob } from "@/actions/searchJob";
import { Pagination } from "@/components/Pagination";
import Sidebar from "@/components/Sidebar";
import { JobStatus } from "@/lib/selectoptions";
import useJobState from "@/store/use-job";
import useParticipantStore from "@/store/use-participant";
import { faFilter, faRotate } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Autocomplete,
  AutocompleteItem,
  Chip,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Home() {
  const { airtable_id, setDataLoading, accountType } = useParticipantStore(
    (state) => state
  );

  const { clientsList, setClientsList } = useJobState((state) => state);

  const [name, setName] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [pageIndex, setPageIndex] = useState(0);
  const [offsetArr, setOffsetArr] = useState([""]);
  const [pageSize, setPageSize] = useState(new Set<string>([`10`]));
  const [records, setRecords] = useState<any>();

  const [bookers, setBookers] = useState<any>();
  const [selectedBooker, setSelectedBooker] = useState(
    new Set<string>([airtable_id])
  );

  const [filterHidden, setFilterHidden] = useState(true);

  const [client, setClient] = useState(null);
  const [status, setStatus] = useState(null);

  const router = useRouter();

  useEffect(() => {
    (async () => {
      if (airtable_id && clientsList?.length === 0) {
        setDataLoading(true);
        // const result = await GetBookersList();
        // console.log(result);
        // const booker_list: any = [];
        // result.data.data.records.map((item: any) => {
        //   booker_list.push({ id: item.id, name: item.fields.Name });
        // });
        const clients_result = await GetClientsList(airtable_id, accountType);
        const data = clients_result.data.data;
        const temp: any = [];
        data?.map((item: any) => {
          temp.push({ name: item.company, value: item.id });
        });
        setClientsList(temp);
        // setBookers(booker_list);
        setDataLoading(false);
      }
    })();
  }, [airtable_id, clientsList]);

  useEffect(() => {
    (async () => {
      if (airtable_id && pageSize) {
        setDataLoading(true);
        const job_records = await SearchJob(
          airtable_id,
          name,
          fromDate,
          toDate,
          offsetArr[0],
          pageSize,
          client,
          status
        );
        setRecords(job_records.data.records);
        setPageIndex(0);
        setOffsetArr(["", job_records.data.offset]);
        // setRecords(result.data.records);
        setDataLoading(false);
      }
    })();
  }, [airtable_id, pageSize, fromDate, toDate, client, status]);

  const handleSearch = async () => {
    setDataLoading(true);
    console.log(fromDate);
    const job_records = await SearchJob(
      airtable_id,
      name,
      fromDate,
      toDate,
      offsetArr[0],
      pageSize,
      client,
      status
    );
    console.log(job_records);
    setRecords(job_records.data.records);
    setPageIndex(0);
    setOffsetArr(["", job_records.data.offset]);
    setDataLoading(false);
  };

  useEffect(() => {
    console.log(offsetArr);
  }, [offsetArr]);

  const handlePagenation = async (index: any) => {
    console.log(index);
    if (index < 0) return;
    if (pageIndex === index) return;

    setDataLoading(true);

    console.log(offsetArr[index]);
    const job_records = await SearchJob(
      airtable_id,
      name,
      fromDate,
      toDate,
      offsetArr[index],
      pageSize,
      client,
      status
    );
    setPageIndex(index);
    if (offsetArr.length === index + 1)
      setOffsetArr([...offsetArr, job_records.data.offset]);
    setRecords(job_records.data.records);
    setDataLoading(false);
  };

  const handleKeyDown = async (e: any) => {
    if (e.key === "Enter") {
      await handleSearch();
    }
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
      <div className="p-[30px]  w-full">
        <p className="md:text-[26px]  text-[24px] sm:text-left text-center font-semibold mb-[30px]">
          Search Job
        </p>
        <div className="flex flex-col gap-[30px]">
          <div className="rounded-2xl lg:p-[30px] md:p-[20px] p-[15px] bg-white shadow-md flex flex-col lg:gap-[30px] gap-[10px]">
            <div className="flex flex-col gap-1">
              <Input
                type="text"
                variant="bordered"
                className="w-full"
                label="Job Title"
                size="sm"
                value={name}
                onKeyDown={handleKeyDown}
                onChange={(e) => setName(e.target.value)}
              />
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <p>From Date</p>
                  <div className="flex flex-row gap-1">
                    <input
                      type="date"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                      className="outline-none w-full border-[2px] p-2 rounded-xl"
                    />
                    <button onClick={() => setFromDate("")}>
                      <FontAwesomeIcon icon={faRotate} />
                    </button>
                  </div>
                </div>
                <div>
                  <p>To Date</p>
                  <div className="flex flex-row gap-1">
                    <input
                      type="date"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                      className="outline-none w-full border-[2px] p-2 rounded-xl"
                    />
                    <button onClick={() => setToDate("")}>
                      <FontAwesomeIcon icon={faRotate} />
                    </button>
                  </div>
                </div>

                <Autocomplete
                  label="Client"
                  variant="bordered"
                  allowsCustomValue={true}
                  onSelectionChange={(e: any) => setClient(e)}
                >
                  {clientsList?.map((item) => (
                    <AutocompleteItem key={item.name}>
                      {item.name}
                    </AutocompleteItem>
                  ))}
                </Autocomplete>
                <Autocomplete
                  label="Job Status"
                  variant="bordered"
                  allowsCustomValue={true}
                  onSelectionChange={(e: any) => setStatus(e)}
                >
                  {JobStatus?.map((item) => (
                    <AutocompleteItem key={item}>{item}</AutocompleteItem>
                  ))}
                </Autocomplete>
              </div>

              {/* <Select
                variant="bordered"
                label="Booker"
                size="lg"
                selectedKeys={selectedBooker}
                onSelectionChange={setSelectedBooker as any}
              >
                {bookers?.map((item: any) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.name}
                  </SelectItem>
                ))}
              </Select> */}
            </div>
            <div className="w-full">
              <table className="w-full">
                <thead>
                  <tr className="text-left bg-primary l">
                    <th>Date</th>
                    <th>Time</th>
                    <th>Event Name</th>
                    <th>Client</th>
                    {/* <th>Status</th> */}
                    {/* <th>Event Status</th> */}
                  </tr>
                </thead>
                <tbody>
                  {records ? (
                    records.map((item: any, index: number) => (
                      <tr
                        key={index}
                        className="border-b-[1px] hover:bg-gray-100 bg-white cursor-pointer"
                        onClick={() =>
                          redirectToExternalUrl(`/job-board/${item.id}`)
                        }
                      >
                        <td>{item.fields["START DATE"]}</td>
                        {item?.fields?.["Start Date/Time"] ? (
                          <td>
                            {new Date(
                              item.fields["Start Date/Time"]
                            ).toLocaleTimeString("en-US", {
                              hour: "numeric",
                              hour12: true,
                              minute: "numeric",
                              timeZone: "UTC",
                            }) +
                              " - " +
                              new Date(
                                item.fields["End Date/Time"]
                              ).toLocaleTimeString("en-US", {
                                hour: "numeric",
                                hour12: true,
                                minute: "numeric",
                                timeZone: "UTC",
                              })+"(UTC)"}
                          </td>
                        ) : (
                          <td></td>
                        )}

                        <td>{item.fields["JOB TITLE"]}</td>
                        {accountType !== "talent" ? (
                          <td>{item?.fields?.["Company (from Client)"]}</td>
                        ) : (
                          ""
                        )}
                        {/* {accountType !== "talent" ? (
                          <td>
                            {item.fields?.["Status for Talent View"] ? (
                              <Chip
                                color={`${
                                  item.fields?.["Status for Talent View"] ===
                                  "Talent Booked, Needs to Confirm"
                                    ? "danger"
                                    : item.fields?.[
                                        "Status for Talent View"
                                      ] === "Talent Confirmed Booking"
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
                        )} */}
                      </tr>
                    ))
                  ) : (
                    <tr></tr>
                  )}
                </tbody>
              </table>
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
        </div>
      </div>
    </main>
  );
}
